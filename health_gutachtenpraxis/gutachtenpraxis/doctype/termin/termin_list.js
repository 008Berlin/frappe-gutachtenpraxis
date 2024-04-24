frappe.listview_settings['Termin'] = {
    //filters: [["status", "=", "Open"]],
    get_indicator: function (doc) {
        var colors = {
            "Wiedervorlage": "orange",
            "Privat Fichtel - Praxis": "yellow",
            "Termin bestätigt, Gutachten": "blue",
            "Planung Fahrer": "green",
            "Vergebliche Anfahrt": "orange",
            "abgs. Praxis - neu terminieren": "red",
            "Termin mitgeteilt, nicht bestätigt": "red",
            "Termin geplant nicht mitgeteilt": "red",
            "Urlaub": "red",
            "Arbeitszeiten (An- und Abwesenheit)": "red"

            /*
            "Wiedervorlage": "orange",
            "Privat Fichtel - Praxis": "yellow",
            "Termin bestätigt, Gutachten": "blue",
            "Planung Fahrer": "green",
            "Vergebliche Anfahrt": "orange",
            "abgs. Praxis - neu terminieren": "red",
            "Termin mitgeteilt, nicht bestätigt": "red",
            "Termin geplant nicht mitgeteilt": "red",
            "Urlaub": "red",
            "Arbeitszeiten (An- und Abwesenheit)": "red"
            */
        };
        return [__(doc.status), colors[doc.status], "status,=," + doc.status];
    }
};