// Copyright (c) 2023, Aron Wiederkehr and contributors
// For license information, please see license.txt

frappe.ui.form.on('Gutachten', {
	court: function(frm) {
        // Call 'get_judges' when 'Court' field is changed
        frappe.call({
            method: 'health_gutachtenpraxis.gutachtenpraxis.utils.get_judges',
            args: {
                'court': frm.doc.court
            },
            callback: function(r) {
                // Update 'Judge' field options with the returned Judges
                frm.set_df_property('judge', 'options', r.message);
            }
        });
    }
});

