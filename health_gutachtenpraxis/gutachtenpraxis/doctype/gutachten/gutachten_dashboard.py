# Copyright (c) 2023, Aron Wiederkehr and Contributors
# See license.txt

from frappe import _

def get_data():
    return {
        'fieldname': 'gutachten',
        'non_standard_fieldnames': {
            'Tagesliste': 'gutachten',
            'Termin': 'gutachten',
            'Rechnung': 'gutachten',
        },
        'transactions': [
            {
                'label': _('Verbundene Tagesliste'),
                'items': ['Tagesliste']
            },
            {
                'label': _('Verbundene Termine'),
                'items': ['Termin']
            },
            {
                'label': _('Verbundene Rechnung'),
                'items': ['Rechnung']
            },
        ]
    }
