// Copyright (c) 2023, Aron Wiederkehr and contributors
// For license information, please see license.txt

frappe.ui.form.on('Termin', {
    refresh: function (frm) {
        var allowed_statuses = ['Wiedervorlage', 'Privat Fichtel - Praxis', 'Termin bestätigt, Gutachten', 'Planung Fahrer', 'Vergebliche Anfahrt', 'abgs. Praxis - neu terminieren', 'Termin mitgeteilt, nicht bestätigt', 'Termin geplant nicht mitgeteilt', 'Urlaub', 'Arbeitszeiten (An- und Abwesenheit)'];
        if (allowed_statuses.includes(frm.doc.status)) {
          frm.set_value("color", getStatusColor(frm.doc.status));
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
           frm.set_value("color", "#B04DD0")
        }
    },
    status: function (frm) {
        var color = getStatusColor(frm.doc.status);
        frm.set_value('color', color);
    }
});

function getStatusColor(status) {
    var statusColorMapping = {

        "Wiedervorlage": "#B04DD0",
        "Privat Fichtel - Praxis": "#000000",
        "Termin bestätigt, Gutachten": "#DA2B4D",
        "Planung Fahrer": "#629EF2",
        "Vergebliche Anfahrt": "#D0D0D0",
        "abgs. Praxis - neu terminieren": "#E07F26",
        "Termin mitgeteilt, nicht bestätigt": "#63D13B",
        "Termin geplant nicht mitgeteilt": "#629EF2",
        "Urlaub": "#629EF2",
        "Arbeitszeiten (An- und Abwesenheit)": "#B04DD0",

    };

    return statusColorMapping[status];
}

frappe.ui.form.on('Termin', {
    after_save: function (frm) {
        // Neu laden der Seite nach dem Speichern des Termins
        window.location.reload();
    }
});

frappe.ui.form.on('Termin', {
  refresh: function (frm) {

    // Function to handle custom back button navigation
    function backNavigationWarning(event) {
      // Prevent immediate navigation if there are unsaved changes and warning is not ignored
      if (frm.is_dirty()) {

        frappe.confirm(
          "Es gab ungespeicherte Änderungen. Wollen Sie diese speichern?",
          function () {
            // User clicked "Yes", save changes and navigate back after save
            frm.save();
          },
        );
      }
    }

    if (!frm.backNavigationWarningAdded) {
      window.addEventListener("popstate", backNavigationWarning);
      frm.backNavigationWarningAdded = true;  // Set flag to indicate listener is added
    }
  }
});
