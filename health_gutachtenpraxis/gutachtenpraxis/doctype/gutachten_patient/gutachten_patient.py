# Copyright (c) 2023, Aron Wiederkehr and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.model.naming import getseries
from frappe.contacts.address_and_contact import load_address_and_contact
from frappe.utils import getdate, formatdate


class GutachtenPatient(Document):
    def onload(self):
        """Load address and contacts in `__onload`"""
        load_address_and_contact(self)

    def autoname(self):
        # Format date_of_birth as DD.MM.YYYY
        formatted_date = formatdate(self.dob, "dd.MM.yyyy")

        # Concatenate first_name, last_name, and formatted_date
        name = f"{self.first_name} {self.last_name}, {formatted_date}"

        self.name = name

    def validate(self):
        self.set_full_name()
        self.flags.is_new_doc = self.is_new()

    def set_full_name(self):
        if self.last_name:
            self.patient_name = " ".join(
                filter(None, [self.first_name, self.last_name])
            )
        else:
            self.patient_name = self.first_name

    @property
    def age(self):
        if not self.dob:
            return
        dob = getdate(self.dob)
        age = dateutil.relativedelta.relativedelta(getdate(), dob)
        return age

    def get_age(self):
        age = self.age
        if not age:
            return
        age_str = f'{str(age.years)} {_("Year(s)")} {str(age.months)} {_("Month(s)")} {str(age.days)} {_("Day(s)")}'
        return age_str
