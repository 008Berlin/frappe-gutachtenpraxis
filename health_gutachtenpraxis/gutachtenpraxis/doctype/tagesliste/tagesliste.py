# Copyright (c) 2023, Aron Wiederkehr and contributors
# For license information, please see license.txt

import frappe
import requests
import json
from frappe.model.document import Document
import googlemaps
from datetime import datetime, timedelta

class Tagesliste(Document):
    def before_save(self):
        if not self.gutachten_list:
            frappe.logger().error("gutachten_list is empty before save!")
            return

        for item in self.gutachten_list:
            item.parent = self.name
            item.parentfield = "gutachten_list"
            item.parenttype = "Tagesliste"

        frappe.logger().error(f"Final gutachten_list Before Save: {self.gutachten_list}")
    def validate(self):
        self.update_gutachten_status()

    def on_trash(self):
        current_gutachten_set = set([d.gutachten for d in self.gutachten_list])
        for g in current_gutachten_set:
            frappe.db.set_value("Gutachten", g, "status", 'Nicht terminiert')

    def update_gutachten_status(self):
        old_gutachten_set = set([d.gutachten for d in self.get_old_gutachten_list()])
        current_gutachten_set = set([d.gutachten for d in self.gutachten_list])

        added_gutachten = current_gutachten_set - old_gutachten_set
        removed_gutachten = old_gutachten_set - current_gutachten_set

        for g in added_gutachten:
            frappe.db.set_value("Gutachten", g, "status", 'in Tagesliste')

        for g in removed_gutachten:
            frappe.db.set_value("Gutachten", g, "status", 'Nicht terminiert')

    def get_old_gutachten_list(self):
        if self.is_new():
            return []

        return [d for d in frappe.get_all('Tagesliste Gutachten', filters={'parent': self.name}, fields=['gutachten'])]

    def get_current_gutachten_list(self):
        return [d.gutachten for d in self.gutachten_list]

    def get_gutachtens(self):
        gutachtens = []
        for item in self.gutachten_list:
            gutachtens.append(frappe.get_doc("Gutachten", item.gutachten))
        return gutachtens

def change_gutachten_status(gutachten, status):
    pass

def address_to_geojson_feature(gutachten):
    if gutachten.lat and gutachten.lon:
        lat = gutachten.lat
        lon = gutachten.lon
    else:
        response = requests.get(
            "https://nominatim.openstreetmap.org/search",
            params={"q": gutachten.address_string(), "format": "json"},
        )
        data = response.json()
        if data:
            lat = data[0]["lat"]
            lon = data[0]["lon"]

    geojson = {
        "type": "Feature",
        "properties": {"name": gutachten.name},
        "geometry": {
            "type": "Point",
            "coordinates": [lon, lat],
        },
    }

    return geojson


@frappe.whitelist()
def gutachten_list_to_geojson(tagesliste):
    tagesliste = frappe.get_doc(json.loads(tagesliste))
    geojson = {
        "type": "FeatureCollection",
        "features": [],
    }
    gutachtens: list = tagesliste.get_gutachtens()
    for gutachten in gutachtens:
        feature = address_to_geojson_feature(gutachten)
        geojson["features"].append(feature)

    return json.dumps(geojson)


@frappe.whitelist()
def create_tagesliste(court):
    # Fetch Gutachten linked to the court
    gutachten_list = frappe.get_all(
        "Gutachten", filters={"court": court, "status": "Nicht terminiert"}, fields=["name"]
    )

    # Create a new Tagesliste
    tagesliste = frappe.new_doc("Tagesliste")
    tagesliste.court = court
    for gutachten in gutachten_list:
        # Add Gutachten to the child table
        tagesliste.append("gutachten_list", {"gutachten": gutachten["name"]})

        gutachten_doc = frappe.get_doc("Gutachten", gutachten.name)
        gutachten_doc.status = "in Tagesliste"
        gutachten_doc.save()

    tagesliste.save(ignore_permissions=True)

    return tagesliste.name

@frappe.whitelist()
def optimize_route(tagesliste_name):
    tagesliste = frappe.get_doc("Tagesliste", tagesliste_name)
    api_key = frappe.db.get_single_value("Google Settings", "api_key")

    # Hole die Firmenadresse als Start-/Endpunkt
    company_address = get_company_address()  # Deine Methode für Firmenadresse hier verwenden

    # Koordinaten der Gutachten extrahieren
    gutachten_list = tagesliste.get_gutachtens()
    locations = [
        {"location": {"latLng": {"latitude": float(gutachten.lat), "longitude": float(gutachten.lon)}}}
        for gutachten in gutachten_list
    ]

    url = "https://routes.googleapis.com/directions/v2:computeRoutes"

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": "routes",
    }

    data = {
        "origin": {"address": company_address},
        "destination": {"address": company_address},
        "intermediates": locations,
        "travelMode": "DRIVE",
        "routingPreference": "TRAFFIC_AWARE",
        "departureTime": (datetime.utcnow() + timedelta(minutes=5)).isoformat() + "Z",
        "optimizeWaypointOrder": True
    }

    response = requests.post(url, json=data, headers=headers)

    if response.status_code != 200:
        frappe.throw(f"API request failed: {response.text}")

    result = response.json()
#     print(result)

    if "routes" in result and result["routes"]:
        optimized_order = result["routes"][0].get("optimizedIntermediateWaypointIndex", [])
        print(f"Optimized Order: {optimized_order}")

        print("Before Sorting:", tagesliste.gutachten_list)

        # Reorder gutachten_list based on optimized order
        sorted_gutachten_list = [tagesliste.gutachten_list[i] for i in optimized_order]

        # Clear current child table and add sorted items with correct idx
        tagesliste.set("gutachten_list", [])

        for idx, gutachten in enumerate(sorted_gutachten_list, start=1):
            gutachten.idx = idx  # Ensure correct indexing
            tagesliste.append("gutachten_list", gutachten)

        print("After Sorting:", tagesliste.gutachten_list)

        # Save changes
        tagesliste.save()
        frappe.db.commit()

    return True


@frappe.whitelist()
def get_company_address():
    default_company = frappe.get_single('Global Defaults').default_company

    # Fetch the address of the default company
    address = frappe.get_value('Dynamic Link', {
        'link_doctype': 'Company',
        'link_name': default_company,
        'parenttype': 'Address'
    }, 'parent')

    if address:
        company_address = frappe.get_value('Address', address, ['address_line1', 'city', 'pincode'])
        return company_address[0] + ", " + company_address[2] + " " + company_address[1]

    return None

def sort_gutachten_list(tagesliste, correct_order):
    """ Sort tagesliste.gutachten_list based on the provided correct order of lat/lng values """

    def get_index(item):
        # Fetch the associated Gutachten document
        gutachten = frappe.get_doc("Gutachten", item.gutachten)  # Assuming `gutachten` is the field name
        if hasattr(gutachten, "lat") and hasattr(gutachten, "lon"):
            lat_lng = (gutachten.lat, gutachten.lon)
            return correct_order.index(lat_lng) if lat_lng in correct_order else float('inf')
        return float('inf')  # Push items without lat/lon to the end

    tagesliste.gutachten_list.sort(key=get_index)
    return tagesliste
