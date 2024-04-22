// Copyright (c) 2023, Aron Wiederkehr and contributors
// For license information, please see license.txt

frappe.ui.form.on("Gutachten", {
  onload: function (frm) {
    // Ensure there's a container to render the map
    //$(frm.fields_dict.map_display.wrapper).html('<div id="custom_map" style="height: 400px;"></div>');
    refreshMapGeo(frm);
    if (frm.doc.lat && frm.doc.lon) {
      createMap(frm);
    }
  },

  refresh: function (frm) {
    // Add Custom button for Anamnesebogen pdf
    frm.add_custom_button("Anamnesebogen generieren", function () {
      var w = window.open(
        "/api/method/health_gutachtenpraxis.gutachtenpraxis.doctype.gutachten.gutachten.generate_pdf?" +
        "doctype=" +
        encodeURIComponent(frm.doc.doctype) +
        "&name=" +
        encodeURIComponent(frm.doc.name)
      );
      if (!w) {
        frappe.msgprint(__("Please enable pop-ups"));
        return;
      }
    });
  },

  court: function (frm) {
    if (frm.doc.court) {
      frappe.call({
        method: "health_gutachtenpraxis.gutachtenpraxis.utils.get_judges",
        args: {
          court: frm.doc.court,
        },
        callback: function (r) {
          if (r.message) {
            // Store the judge names in a separate variable
            let judgeNames = r.message.map((judge) => judge.name);
            // Set the "options" property to "Richter"
            frm.set_df_property("judge", "options", "Richter");
            // Filter the options that are displayed to the user
            frm.set_query("judge", function () {
              return {
                filters: { name: ["in", judgeNames] },
              };
            });
          }
        },
      });
    } else {
      frm.set_df_property("judge", "options", []);
      frm.set_query("judge", function () {
        return;
      });
    }
  },

  // Change to receipt date results in due date
  receipt_date: function (frm) {
    if (frm.doc.receipt_date && frm.doc.period) {
      let receipt_date = frappe.datetime.str_to_obj(frm.doc.receipt_date);
      let due_date = frappe.datetime.add_days(receipt_date, frm.doc.period);
      frm.set_value('due_date', frappe.datetime.obj_to_str(due_date));
    }
  },
  // This function runs every time the period field is modified
  period: function (frm) {
    if (frm.doc.receipt_date && frm.doc.period) {
      let receipt_date = frappe.datetime.str_to_obj(frm.doc.receipt_date);
      let due_date = frappe.datetime.add_days(receipt_date, frm.doc.period);
      frm.set_value('due_date', frappe.datetime.obj_to_str(due_date));
    }
  },
});

function createMap(frm) {
  // We'll use the first feature to set the initial map view
  var lat = frm.doc.lat;
  var lon = frm.doc.lon;

  $(cur_frm.fields_dict.geolocation_html.wrapper).html('<div id="map_html" style="height: 600px;"></div>');

  var map = L.map('map_html').setView([lat, lon], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    id: 'openstreetmap'
  }).addTo(map);

  L.marker([lat, lon]).addTo(map)
}

function refreshMapGeo(frm) {
  frappe.call({
    method: "health_gutachtenpraxis.gutachtenpraxis.doctype.gutachten.gutachten.address_to_geojson",
    args: {
      gutachten: frm.doc
    }
  });
}

//Adresse für die Tagesliste
frappe.ui.form.on('Gutachten', {
  onload: function (frm) {
    if (frm.doc.patient) {
      frappe.call({
        method: "frappe.client.get",
        args: {
          doctype: "Gutachten Patient",
          name: frm.doc.patient
        },
        callback: function (r) {
          if (r.message) {
            var patientData = r.message;
            if (patientData.a_patient_street) {
              frm.set_value('infos_tl', patientData.a_patient_street + ', ' + patientData.a_patient_zipcode + ' ' + patientData.a_patient_city);
            } else {
              frm.set_value('infos_tl', patientData.m_patient_street + ', ' + patientData.m_patient_zipcode + ' ' + patientData.m_patient_city);
            }
          }
        }
      });
    }
  }
});

