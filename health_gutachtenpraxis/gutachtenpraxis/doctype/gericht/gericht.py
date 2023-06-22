# Copyright (c) 2023, Aron Wiederkehr and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Gericht(Document):
	def after_insert(self):
		try:
			kanban_board = frappe.get_doc('Kanban Board', 'Gutachten Board')
			if kanban_board:
				kanban_board.append('columns', {
					'column_name': self.name
				})
				kanban_board.save()
		except:
			frappe.clear_last_message()
		
