# Copyright (c) 2023, Aron Wiederkehr and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document

class Rechnung(Document):
	def autoname(self):
		self.name = "RN " + self.gutachten[3:]
