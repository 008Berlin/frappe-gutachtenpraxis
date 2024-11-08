// Copyright (c) 2023, Aron Wiederkehr and contributors
// For license information, please see license.txt

frappe.ui.form.on('Gutachten Patient', {
	onload: function (frm) {
		if (frm.doc.dob) {
			let age_str = get_age(frm.doc.dob)
			$(frm.fields_dict['age_html'].wrapper).html(`${__('Alter')} : ${age_str}`);
		} else {
			$(frm.fields_dict['age_html'].wrapper).html('');
		}
	},
	refresh: function (frm) {
		if (frm.doc.dob) {
			let age_str = get_age(frm.doc.dob)
			$(frm.fields_dict['age_html'].wrapper).html(`${__('Alter')} : ${age_str}`);
		} else {
			$(frm.fields_dict['age_html'].wrapper).html('');
		}
	},
	a_patient_residence: function (frm) {
		if (frm.doc.a_patient_residence) {
			frappe.call({
				method: 'frappe.client.get',
				args: {
					doctype: 'Einrichtung',
					name: frm.doc.a_patient_residence
				},
				callback: function (response) {
					var einrichtung = response.message;
					frm.set_value('a_patient_street', einrichtung.street);
					frm.set_value('a_patient_zipcode', einrichtung.zipcode);
					frm.set_value('a_patient_city', einrichtung.city);
					frm.set_value('a_patient_residence_station', einrichtung.zusatz);
					frm.set_value('a_patient_residence_phone', einrichtung.tel_number);

				}
			});
		}
	}
});

frappe.ui.form.on('Gutachten Patient', 'dob', function (frm) {
	if (frm.doc.dob) {
		let today = new Date();
		let birthDate = new Date(frm.doc.dob);
		if (today < birthDate) {
			frappe.msgprint(__('Please select a valid Date'));
			frappe.model.set_value(frm.doctype, frm.docname, 'dob', '');
		} else {
			let age_str = get_age(frm.doc.dob);
			$(frm.fields_dict['age_html'].wrapper).html(`${__('Alter')} : ${age_str}`);
		}
	} else {
		$(frm.fields_dict['age_html'].wrapper).html('');
	}
});

let get_age = function (birth) {
	let ageMS = Date.parse(Date()) - Date.parse(birth);
	let age = new Date();
	age.setTime(ageMS);
	let years = age.getFullYear() - 1970;
	return years + ' Jahr(e) ';
};


frappe.ui.form.on('Gutachten Patient', {
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
