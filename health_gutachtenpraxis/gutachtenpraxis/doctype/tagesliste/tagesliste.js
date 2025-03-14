// Copyright (c) 2023, Aron Wiederkehr and contributors
// For license information, please see license.txt

frappe.ui.form.on('Tagesliste', {
    onload: function (frm) {
        refreshMap(frm, createMap);
    },
    refresh: function (frm) {
        frm.add_custom_button(__('Route öffnen'), function () {
            // Use the GeoJSON data to create the route
            if (frm.geojson_data) {
                createRoute(frm, frm.geojson_data.features);
            }
        });
    },
    before_save: function(frm) {
        if (!frm.doc.gutachten_list) {
            frm.doc.gutachten_list = [];
        }

        $.each(frm.doc.gutachten_list, function(idx, row) {
            row.idx = idx + 1;
            row.parent = frm.doc.name;
            row.parentfield = "gutachten_list";
            row.parenttype = "Tagesliste";
        });

        // **Force ERPNext to detect changes**
        frm.set_value("gutachten_list", frm.doc.gutachten_list);
        frm.refresh_field("gutachten_list");
        frm.dirty();

        // **Override Save Function to Manually Send `gutachten_list`**
        frappe.call({
            method: "frappe.desk.form.save.savedocs",
            args: {
                doc: frm.doc,
                action: "Save"
            },
            callback: function(response) {
                location.reload();
            }
        });

        return false;  // Stop default save process, use our manual save
    },
    optimize_route: function (frm) {
        frappe.show_alert({
            message: __("Route wurde optimiert"),
            indicator: 'orange'
        });
        frappe.call({
            method: "health_gutachtenpraxis.gutachtenpraxis.doctype.tagesliste.tagesliste.optimize_route",
            args: { 'tagesliste_name': frm.doc.name },
            callback: function (response) {
                if (response.message) {
                    frm.reload_doc();
                    frappe.msgprint(__('Route wurde optimiert'));
                }
            }
        });
    }
});

function refreshMap(frm) {
    frappe.call({
        method: "health_gutachtenpraxis.gutachtenpraxis.doctype.tagesliste.tagesliste.gutachten_list_to_geojson",
        args: {
            tagesliste: frm.doc
        },
        callback: function (response) {
            frm.geojson_data = JSON.parse(response.message);
            createMap(frm.geojson_data.features);
        }
    });
}

function createMap(features) {

    if ( typeof features === undefined || typeof features[0] === undefined || features.length === 0 ) {
        return;
    }

    // We'll use the first feature to set the initial map view
    var lat = features[0].geometry.coordinates[1];
    var lon = features[0].geometry.coordinates[0];

    $(cur_frm.fields_dict.geolocation.wrapper).html('<div id="map" style="height: 600px;"></div>');

    var map = L.map('map').setView([lat, lon], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        id: 'openstreetmap'
    }).addTo(map);

    // Now, create a marker for each feature
    features.forEach(function (feature) {
        var lat = feature.geometry.coordinates[1];
        var lon = feature.geometry.coordinates[0];
        var name = feature.properties.name;
        L.marker([lat, lon]).addTo(map)
            .bindPopup(name).openPopup();
    });
}


function createRoute(frm, features) {
    frappe.call({
        method: 'health_gutachtenpraxis.gutachtenpraxis.doctype.tagesliste.tagesliste.get_company_address',
        args: {},
        callback: function (response) {
            var company_address = response.message;

            var waypoints = features.map(feature => {
                var lat = feature.geometry.coordinates[1];
                var lon = feature.geometry.coordinates[0];
                return lat + "," + lon;
            }).join('|');

            var google_maps_url = "https://www.google.com/maps/dir/?api=1" +
                "&origin=" + encodeURIComponent(company_address) +
                "&destination=" + encodeURIComponent(company_address) +
                "&travelmode=driving&waypoints=" + encodeURIComponent(waypoints);

            window.open(google_maps_url, '_blank');
        }
    });
}
