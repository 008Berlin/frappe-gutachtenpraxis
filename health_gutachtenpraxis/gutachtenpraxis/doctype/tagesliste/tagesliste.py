# Copyright (c) 2023, Aron Wiederkehr and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Tagesliste(Document):
	pass

@frappe.whitelist()
def create_tagesliste(court):
    # Fetch Gutachten linked to the court
    gutachten_list = frappe.get_all('Gutachten', filters={'court': court}, fields=['name'])

    # Create a new Tagesliste
    tagesliste = frappe.new_doc('Tagesliste')
    tagesliste.court = court
    for gutachten in gutachten_list:
        # Add Gutachten to the child table
        tagesliste.append('gutachten_list', {
            'gutachten': gutachten['name']
        })
    tagesliste.save(ignore_permissions=True)

    return tagesliste.name