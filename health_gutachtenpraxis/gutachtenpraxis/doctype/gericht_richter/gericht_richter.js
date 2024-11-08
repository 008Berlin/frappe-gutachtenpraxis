// Copyright (c) 2023, Aron Wiederkehr and contributors
// For license information, please see license.txt

frappe.ui.form.on('Gericht Richter', {
	// refresh: function(frm) {

	// }
});

frappe.ui.form.on('Gericht Richter', {
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
