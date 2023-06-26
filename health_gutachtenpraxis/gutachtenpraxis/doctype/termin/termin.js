// Copyright (c) 2023, Aron Wiederkehr and contributors
// For license information, please see license.txt

frappe.ui.form.on('Termin', {
    status: function(frm) {
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
