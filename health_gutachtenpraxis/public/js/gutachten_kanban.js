setInterval(function() {
    var route = frappe.get_route();
    if (route[0] === 'List' && route[1] === 'Gutachten' && route[2] === 'Kanban') {
        // We're in the Kanban view of the Gutachten DocType

        // Wait for the Kanban board to load
        frappe.after_ajax(function() {
            $('.kanban-column:not(.add-new-column)').each(function() {
                var $column = $(this);
                var court = $column.attr('data-column-value');  // Get the court from the column's attribute
                console.log(court)

                // Check if the custom div already exists
                var $div = $column.find('.custom-div');
                console.log($div)
                if (!$div.length) {
                    // Create custom div and apply styles
                    console.log("Create custom div")
                    $div = $('<div class="custom-div"></div>');
                    $div.css({
                        'margin-bottom': '10px',
                        'text-align': 'center'
                    });
                    console.log($column.find('.kanban-column-header'))
                    $column.find('.kanban-column-header').after($div);
                }

                // Check if the custom button already exists
                if (!$div.find('.custom-button').length) {
                    // Create custom button and apply styles
                    console.log("Create custom button")
                    var $button = $('<button class="custom-button btn btn-primary">Create Tagesliste</button>');
                    $button.on('click', function() {
                        // Fetch Gutachten linked to the court
                        frappe.call({
                            method: 'health_gutachtenpraxis.gutachtenpraxis.doctype.tagesliste.tagesliste.create_tagesliste',
                            args: {
                                court: court
                            },
                            callback: function(response) {
                                // Redirect to the new Tagesliste
                                if (response.message) {
                                    var tagesliste_name = response.message;
                                    frappe.set_route('Form', 'Tagesliste', tagesliste_name);
                                }
                            }
                        });
                    });

                    // Add custom button to the div
                    $div.append($button);
                }
            });
        });
    }
});
