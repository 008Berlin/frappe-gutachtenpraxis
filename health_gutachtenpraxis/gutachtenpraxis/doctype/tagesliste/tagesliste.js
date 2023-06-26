// Copyright (c) 2023, Aron Wiederkehr and contributors
// For license information, please see license.txt

frappe.ui.form.on('Tagesliste', {
    refresh: function (frm) {
        refreshMap(frm)
    },
    after_save: function (frm) {
        location.reload();
    }
});

function refreshMap(frm) {
    frappe.call({
        method: "health_gutachtenpraxis.gutachtenpraxis.doctype.tagesliste.tagesliste.gutachten_list_to_geojson",
        args: {
            tagesliste: cur_frm.doc
        },
        callback: function (response) {
            var data = JSON.parse(response.message);

            createMap(data.features);
        }
    });
}

function createMap(features) {
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
            .bindPopup(name);
    });
}