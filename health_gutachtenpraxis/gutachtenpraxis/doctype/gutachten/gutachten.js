// Copyright (c) 2023, Aron Wiederkehr and contributors
// For license information, please see license.txt

frappe.ui.form.on("Gutachten", {
  onload: function (frm) {
    // Ensure there's a container to render the map
    $(frm.fields_dict.map_display.wrapper).html('<div id="custom_map" style="height: 400px;"></div>');

    if (frm.doc.lat && frm.doc.lon) {
      renderMap(frm, frm.doc.lat, frm.doc.lon, frm.doc.name);
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
function renderMap(frm, lat, lon, popupText) {
  // Create the map with 'custom_map' ID
  var map = L.map('custom_map').setView([lat, lon], 15);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    id: 'openstreetmap'
  }).addTo(map);
  
  // Add a marker with the popup
  L.marker([lat, lon]).addTo(map).bindPopup(popupText).openPopup();
}
