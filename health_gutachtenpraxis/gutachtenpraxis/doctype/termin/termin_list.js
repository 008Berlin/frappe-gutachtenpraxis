frappe.listview_settings['Termin'] = {
	//filters: [["status", "=", "Open"]],
	get_indicator: function(doc) {
		var colors = {
			"Nicht terminiert": "orange",
			"Terminiert, nicht bestätigt": "yellow",
			"Bestätigt": "blue",
			"Begutachtet": "green",
            "Vergebliche Anfahrt": "orange",
            "Gutachten abgebrochen": "red",
            "Zutritt verweigert": "red",
            "Von Praxis abgesagt": "red",
            "Von Betroffenen abgesagt": "red",
            "Verschoben": "red",
            "Im Krankenhaus": "red",
            "Nicht erschienen": "red",
            "Standort gewechselt/ umgezogen": "red",
            "Verstorben": "grey"
		};
		return [__(doc.status), colors[doc.status], "status,=," + doc.status];
	}
};