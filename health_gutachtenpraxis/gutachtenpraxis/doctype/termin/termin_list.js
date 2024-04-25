frappe.listview_settings['Termin'] = {
    //filters: [["status", "=", "Open"]],
    get_indicator: function (doc) {
        var colors = {
            "Wiedervorlage": "purple",
            "Privat Fichtel - Praxis": "black",
            "Termin bestätigt, Gutachten": "red",
            "Planung Fahrer": "cyan",
            "Vergebliche Anfahrt": "gray",
            "abgs. Praxis - neu terminieren": "orange",
            "Termin mitgeteilt, nicht bestätigt": "green",
            "Termin geplant nicht mitgeteilt": "cyan",
            "Urlaub": "cyan",
            "Arbeitszeiten (An- und Abwesenheit)": "purple"

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