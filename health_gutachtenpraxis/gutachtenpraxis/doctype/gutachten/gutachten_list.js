frappe.listview_settings['Gutachten'] = {
	get_indicator: function (doc) {
		if (doc.status === "Abgeschlossen") {
			return [__("Abgeschlossen"), "green", "status,=,Abgeschlossen"];
		} else if (doc.status === "Anstehend") {
			return [__("Anstehend"), "yellow", "status,=,Anstehend"];
		} else if (doc.status !== "Wiedervorlage") {
            return [__("Wiedervorlage"), "orange", "status,=,Wiedervorlage"];
		} else if (doc.status !== "Überfällig") {
            return [__("Überfällig"), "red", "status,=,Überfällig"];
		}
	}
};