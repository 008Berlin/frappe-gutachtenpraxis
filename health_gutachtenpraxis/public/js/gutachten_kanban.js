// Your main function to add the custom button
// TODO: FIXIT for chrome
function addCustomButton() {
    $('.kanban-column:not(.add-new-column)').each(function () {
        var $column = $(this);
        var court = $column.attr('data-column-value');  // Get the court from the column's attribute

        // Check if the custom div already exists
        var $div = $column.find('.custom-div');
        if (!$div.length) {
            // Create custom div and apply styles
            $div = $('<div class="custom-div"></div>');
            $div.css({
                'margin-bottom': '10px',
                'text-align': 'center'
            });
            $column.find('.kanban-column-header').after($div);
        }

        // Check if the custom button already exists
        if (!$div.find('.custom-button').length) {
            // Create custom button and apply styles
            var $button = $('<button class="custom-button btn btn-primary">Erstelle Tagesliste</button>');
            $button.on('click', function () {
                // Disable the button and show spinner
                $button.prop('disabled', true).find('.fa-spinner').css('display', 'inline-block');
                frappe.show_alert({
                    message:__('Tagesliste wird erstellt'),
                    indicator:'yellow'
                }, 5);
                // Fetch Gutachten linked to the court
                frappe.call({
                    method: 'health_gutachtenpraxis.gutachtenpraxis.doctype.tagesliste.tagesliste.create_tagesliste',
                    args: {
                        court: court
                    },
                    callback: function (response) {
                        // Once the process is complete, enable the button and hide spinner
                        $button.prop('disabled', false).find('.fa-spinner').css('display', 'none');
                        // Redirect to the new Tagesliste
                        if (response.message) {
                            var tagesliste_name = response.message;
                            frappe.set_route('Form', 'Tagesliste', tagesliste_name);
                        }
                    },
                    // In case of an error, still revert the button to its original state
                    always: function () {
                        $button.prop('disabled', false).find('.fa-spinner').css('display', 'none');
                    }
                });
            });

            // Add custom button to the div
            $div.append($button);
        }
    });
}

// Listen to route changes
frappe.router.on('change', () => {
    let current_route = frappe.get_route();

    if (current_route && current_route[0] === "List" && current_route[1] === "Gutachten" && current_route[2] === "Kanban") {
        console.log("We're on the right page!");

        // Delay to ensure the Kanban board is fully loaded
        setTimeout(addCustomButton, 5000);  // Adjust the delay time if necessary
    }

    (function() {
        // Get the current URL
        let url = new URL(window.location.href);

        // Check if the path contains '/app/termin/view/calendar/default'
        if (url.pathname === "/app/termin/view/calendar/default") {
            // Replace 'default' with 'Standard'
            let newPath = url.pathname.replace("/default", "/Standard");

            // Construct the new URL with the same query parameters
            let newUrl = url.origin + newPath + url.search;

            // Redirect to the new URL
            window.location.replace(newUrl);

            console.log('tview');
        }
    })();

});


const doctypesWithBackNavigationWarning = [
    "Termin",
    "Gutachten",
    "Gutachtenart",
    "Rechnung",
    "Richter",
    "Gericht Richter",
    "Gutachten Patient",
    "Einrichtung",
    "Gericht",
    "Rechnung",
    "Tagesliste"
];

doctypesWithBackNavigationWarning.forEach((doctype) => {
    frappe.ui.form.on(doctype, {
        onload: function (frm) {

            setInterval(() => {

                if ( frm.is_dirty() && frm.is_new() !== 1 ) {
                    frm.save();
                }

            }, 5000); // 5000ms = 5 seconds

        }
    });
});
$(document).ready(function () {
    // Create the button
    let button_html = `
      <button class="btn btn-primary header-calender" style="margin-left: 15px;">
          Terminkalender
      </button>
    `;

    // Add it next to the search bar
    $('.navbar .form-inline').append(button_html);

    // Add click handler
    $('.header-calender').click(function () {
        window.location.href = 'https://erp.folkerfichtel.com/app/termin/view/calendar/Standard';
    });

    (function() {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://www.bugherd.com/sidebarv2.js?apikey=56rowwnxvfwdzeph2m7mjq";
        script.async = true;
        document.head.appendChild(script);
    })();

});



// Gutachten Anwendung auf Formular
frappe.ui.form.on('Gutachten', {
    refresh(frm) {
        frm.fields_dict['type'].get_query = function() {
            return {
                query: 'health_gutachtenpraxis.gutachtenpraxis.doctype.gutachten.gutachten.get_sorted_appraisal_types_query'
            };
        };
    }
});

// Termin Anwendung auf Formular
frappe.ui.form.on('Termin', {
    gutachten: function(frm) {  // Überwacht das verknüpfte 'gutachten'-Feld
        // Verhindere Endlosloop, indem du den API-Aufruf nur einmal ausführst
        frappe.call({
            method: 'frappe.client.validate_link',
            args: {
                doctype: 'Gutachten',       // Gib den Doctype an
                docname: frm.doc.gutachten, // Gib den Namen des Dokuments an
                link: frm.doc.gutachten      // Ersetze dies durch den Wert des Gutachtens
            },
            callback: function(response) {
                if (response.message) {
                    //frm.set_value('link_validated', true);  // Setze ein Flag, um zu verhindern, dass der Aufruf erneut getätigt wird
                    //frappe.msgprint(__('Link validiert: {0}', [response.message]));
                } else {
                    //frappe.msgprint(__('Keine Antwort erhalten.'));
                }
            },
            error: function(err) {
                // Fehlerbehandlung
                if (err.message) {
                    //frappe.msgprint(__('Fehler aufgetreten: {0}', [err.message]));
                } else {
                    //frappe.msgprint(__('Unbekannter Fehler.'));
                }
            }
        });

    }
});


// Termin Anwendung auf Formular
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
