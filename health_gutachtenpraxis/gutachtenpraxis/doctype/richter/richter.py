# Copyright (c) 2023, Aron Wiederkehr and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document

class Richter(Document):
	def validate(self):
		self.set_full_name()
		self.flags.is_new_doc = self.is_new()

	def set_full_name(self):
		if self.last_name:
			self.judge_name = " ".join(filter(None, [self.judge_salutation, self.last_name]))
		else:
			self.judge_name = self.last_name
