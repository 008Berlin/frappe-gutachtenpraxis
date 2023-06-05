# Copyright (c) 2023, Aron Wiederkehr and contributors
# For license information, please see license.txt

import frappe
from datetime import datetime, timedelta
from frappe.model.document import Document


class Gutachten(Document):
	def validate(self):
		self.set_due_date()

	def set_due_date(self):
		if self.receipt_date:
			print(self.receipt_date)
			print(type(self.receipt_date))
			new_date = datetime.strptime(self.receipt_date, "%Y-%m-%d") + timedelta(days=int(self.period))
			self.due_date = new_date.strftime("%Y-%m-%d")
		else:
			frappe.throw("Bitte Eingangsdatum angeben!")