# # Copyright (c) 2023, Aron Wiederkehr and contributors
# # For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe import db

class Termin(Document):
    # def __onload(self):
    #     # frappe.get_hooks("app_include_css").append(
    #     #     "/assets/health_gutachtenpraxis-app/css/termin.css"
    #     # )

    def validate(self):
        gutachten = frappe.get_doc("Gutachten", self.gutachten)
        if self.docstatus == 0 and self.is_new():
            # Entry on Gutachten timeline
            comment_text = f"Ein neuer Termin <a href='/app/termin/{self.name}'>{self.name}</a> wurde erstellt"
            gutachten.add_comment("Edit", comment_text)

        # Validates times
        if self.start_time and self.end_time:
            if self.end_time < self.start_time:
                frappe.throw("Der Start muss vor dem Ende liegen!")

        try:
            og_value = self._original_values.get("status")
        except:
            og_value = None
        if self.get_value("status") != og_value:
            if self.get_value("status") == "Wiedervorlage":
                gutachten.status == "Wiedervorlage"
        # TODO: fixen

    def autoname(self):
        # Count existing Termin documents for this Gutachten
        termin_count = db.count("Termin", filters={"gutachten": self.gutachten})

        # Construct the name
        self.name = f"TRN-{self.gutachten}-{self.patient_last_name}-{termin_count + 1}"