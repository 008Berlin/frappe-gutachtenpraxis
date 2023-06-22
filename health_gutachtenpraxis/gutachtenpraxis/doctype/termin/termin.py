# Copyright (c) 2023, Aron Wiederkehr and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Termin(Document):
	def __onload(self):
		frappe.get_hooks('app_include_css').append('/assets/health_gutachtenpraxis-app/css/termin.css')

