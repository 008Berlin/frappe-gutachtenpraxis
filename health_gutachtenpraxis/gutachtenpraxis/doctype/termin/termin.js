// Copyright (c) 2023, Aron Wiederkehr and contributors
// For license information, please see license.txt

frappe.ui.form.on('Termin', {
    refresh: function (frm) {
        var allowed_statuses = ['Vergebliche Anfahrt', 'Gutachten abgebrochen', 'Zutritt verweigert', 'Von Praxis abgesagt', 'Von Betroffenen abgesagt', 'Verschoben', 'Im Krankenhaus', 'Nicht erschienen', 'Standort gewechselt/ umgezogen', 'Verstorben'];
        if (allowed_statuses.includes(frm.doc.status)) {
            frm.add_custom_button(__('Neuer Termin'), function () {
                frappe.model.with_doctype('Termin', function () {
                    var new_doc = frappe.model.get_new_doc('Termin');
                    new_doc.gutachten = frm.doc.gutachten;
                    new_doc.date = frm.doc.date;
                    new_doc.last_name = frm.doc.last_name;
                    frappe.set_route('Form', 'Termin', new_doc.name);
                });

            });
        } else {
            frm.add_custom_button(__('Neuer Termin'), function () {
                frappe.msgprint(__('Bitte den Status des Termins auf einen der folgenden setzen:\n {0}', [allowed_statuses.join(', ')]));
            }).addClass('disabled');
        }
    },
    status: function (frm) {
        var color = getStatusColor(frm.doc.status);
        frm.set_value('color', color);
    }
});

function getStatusColor(status) {
    var statusColorMapping = {
        "Nicht terminiert": "#FAD7A0",
        "Terminiert, nicht bestätigt": "#FDEBD0",
        "Bestätigt": "#85C1E9",
        "Begutachtet": "#82E0AA",
        "Vergebliche Anfahrt": "#FAD7A0",
        "Gutachten abgebrochen": "#E6B0AA",
        "Zutritt verweigert": "#E6B0AA",
        "Von Praxis abgesagt": "#E6B0AA",
        "Von Betroffenen abgesagt": "#E6B0AA",
        "Verschoben": "#E6B0AA",
        "Im Krankenhaus": "#E6B0AA",
        "Nicht erschienen": "#E6B0AA",
        "Standort gewechselt/ umgezogen": "#E6B0AA",
        "Verstorben": "#D7DBDD"
    };

    return statusColorMapping[status];
}
