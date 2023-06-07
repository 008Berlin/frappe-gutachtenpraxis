# Copyright (c) 2023, Aron Wiederkehr and contributors
# For license information, please see license.txt

import frappe
from datetime import datetime, timedelta
from frappe.model.document import Document


class Gutachten(Document):
	def validate(self):
		pass
    
	
@frappe.whitelist(allow_guest=True)
def generate_pdf(doctype, name):
    # Get the default Letter Head
    options = {
        "format": "A4",
        "orientation": "Portrait"
    }

    # Generate the HTML for the Print Format
    html = frappe.get_print(doctype, name, print_format="Anamnesebogen")

    # Create the PDF
    pdf = frappe.utils.pdf.get_pdf(html)

    # Set the file name
    filename = "{name}.pdf".format(name=name)

    # Set the response headers for PDF file
    frappe.local.response.filename = filename
    frappe.local.response.filecontent = pdf
    frappe.local.response.type = "download"


