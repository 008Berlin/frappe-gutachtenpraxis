frappe.listview_settings['Gutachten'] = {
	get_indicator: function (doc) {
		var colors = {
			"Abgeschlossen": "green",
			"Anstehend": "yellow",
			"Wiedervorlage": "orange",
			"Überfällig": "red",
			"in Tagesliste": "blue"
		};
		return [__(doc.status), colors[doc.status], "status,=," + doc.status];

	}
};