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
