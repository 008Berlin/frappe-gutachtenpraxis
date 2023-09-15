# Copyright (c) 2023, Aron Wiederkehr and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe import db

status_color_mapping = {
    "Nicht terminiert": "#FAD7A0",
    "Terminiert, nicht bestätigt": "#FDEBD0",
    "Bestätigt": "#85C1E9",
    "Begutachtet": "#82E0AA",
    "Vergebliche Anfahrt": "#FAD7A0",
    "Gutachten abgebrochen": "#E6B0AA",
    "Zutritt verweigert": "#E6B0AA",
    "Von Praxis abgesagt": "#E6B0AA",
    "Von Betroffenen abgesagt": "#E6B0AA",
    "Verschoben": "#E6B0AA",
    "Im Krankenhaus": "#E6B0AA",
    "Nicht erschienen": "#E6B0AA",
    "Standort gewechselt/ umgezogen": "#E6B0AA",
    "Verstorben": "#D7DBDD"
}


class Termin(Document):
    def __onload(self):
        frappe.get_hooks("app_include_css").append(
            "/assets/health_gutachtenpraxis-app/css/termin.css"
        )

    def validate(self):
        gutachten = frappe.get_doc('Gutachten', self.gutachten)
        if self.docstatus == 0 and self.is_new():
            comment_text = f"Ein neuer Termin <a href='/app/termin/{self.name}'>{self.name}</a> has been created by {frappe.session.user}."
            gutachten.add_comment("Edit", comment_text)

        if self.start_time and self.end_time:
            if self.end_time < self.start_time:
                frappe.throw("Der Start muss vor dem Ende liegen!")

        if self.get_value("status") != self._original_values.get("status"):
        # Check if the new value is "#E6B0AA"
            if self.get_value("status") == "#E6B0AA":
                gutachten.status == "Wiedervorlage"


        

    def autoname(self):
        # Count existing Termin documents for this Gutachten
        termin_count = db.count("Termin", filters={"gutachten": self.gutachten})

        # Construct the name
        self.name = f"TRN-{self.gutachten}-{self.patient_last_name}-{termin_count + 1}"


# @frappe.whitelist()
# def create_followup_termin(termin):
#     termin = frappe.get_doc(frappe.parse_json(termin))

#     new_termin = frappe.new_doc('Termin')
#     new_termin.gutachten = termin.gutachten
#     new_termin.patient_last_name = termin.patient_last_name
#     new_termin.insert(ignore_permissions=True)

#     return new_termin.name
