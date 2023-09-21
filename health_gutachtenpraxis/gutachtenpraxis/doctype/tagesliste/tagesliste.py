# Copyright (c) 2023, Aron Wiederkehr and contributors
# For license information, please see license.txt

import frappe
import requests
import json
from frappe.model.document import Document
import googlemaps
from datetime import datetime


class Tagesliste(Document):
    def validate(self):
        self.update_gutachten_status()
        
    
    def on_trash(self):
        current_gutachten_set = set([d.gutachten for d in self.gutachten_list])
        for g in current_gutachten_set:
            frappe.db.set_value("Gutachten", g, "status", 'Anstehend')

    def update_gutachten_status(self):
        old_gutachten_set = set([d.gutachten for d in self.get_old_gutachten_list()])
        current_gutachten_set = set([d.gutachten for d in self.gutachten_list])

        added_gutachten = current_gutachten_set - old_gutachten_set
        removed_gutachten = old_gutachten_set - current_gutachten_set

        for g in added_gutachten:
            frappe.db.set_value("Gutachten", g, "status", 'in Tagesliste')

        for g in removed_gutachten:
            frappe.db.set_value("Gutachten", g, "status", 'Anstehend')

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

    print(geojson)

    return json.dumps(geojson)


@frappe.whitelist()
def create_tagesliste(court):
    # Fetch Gutachten linked to the court
    gutachten_list = frappe.get_all(
        "Gutachten", filters={"court": court, "status": "Anstehend"}, fields=["name"]
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
    tagesliste = frappe.get_doc('Tagesliste', tagesliste_name)
    api_key = frappe.db.get_single_value("Google Settings", "api_key")
    client = googlemaps.Client(key=api_key)
        
    # Get company address as the origin
    company_address = get_company_address()
    
    # Extract lat, lon from gutachten_list
    locations = ["{0},{1}".format(gutachten.lat, gutachten.lon) for gutachten in tagesliste.get_gutachtens()]

    print(locations)
        
    # Request optimized route from Google Maps
    result = client.directions(
        origin=company_address,
        destination=company_address,
        waypoints=locations,
        optimize_waypoints=True,
        mode="driving",
        departure_time=datetime.now()
    )
    print(result)
    print(result[0]['waypoint_order'])
    
    # Get the optimized waypoint order
    waypoint_order = result[0]['waypoint_order']
    
    # Reorder gutachten_list based on the optimized order
    gutachten_order = []
    for new_idx, old_idx in enumerate(waypoint_order, 1):
        tagesliste.gutachten_list[old_idx].idx = new_idx
        gutachten_order.append(tagesliste.gutachten_list[old_idx])
    
    # Replace the gutachten_list with the reordered list
    tagesliste.gutachten_list = gutachten_order
    
    # Save the updated document
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