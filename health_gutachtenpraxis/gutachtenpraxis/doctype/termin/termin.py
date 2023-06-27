# Copyright (c) 2023, Aron Wiederkehr and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe import db


class Termin(Document):
    def __onload(self):
        frappe.get_hooks("app_include_css").append(
            "/assets/health_gutachtenpraxis-app/css/termin.css"
        )

    def validate(self):
        if self.docstatus == 0 and self.is_new():
            comment_text = f"Ein neuer Termin <a href='/app/termin/{self.name}'>{self.name}</a> has been created by {frappe.session.user}."
            gutachten = frappe.get_doc('Gutachten', self.gutachten)
            gutachten.add_comment("Edit", comment_text)
        

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
