frappe.listview_settings['Termin'] = {
	filters: [["status", "=", "Open"]],
	get_indicator: function(doc) {
		var colors = {
			"Nicht terminiert": "orange",
			"Terminiert, nicht bestätigt": "yellow",
			"Bestätigt": "green",
			"Begutachtet": "red",
            "Vergebliche Anfahrt": "purple",
            "Gutachten abgebrochen": "purple",
            "Zutritt verweigert": "purple",
            "Von Praxis abgesagt": "purple",
            "Von Betroffenen abgesagt": "purple",
            "Verschoben": "purple",
            "Im Krankenhaus": "purple",
            "Nicht erschienen": "purple",
            "Standort gewechselt/ umgezogen": "purple",
            "Verstorben": "purple"
		};
		return [__(doc.status), colors[doc.status], "status,=," + doc.status];
	}
};