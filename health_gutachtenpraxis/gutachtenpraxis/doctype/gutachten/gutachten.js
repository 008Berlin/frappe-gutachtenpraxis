// Copyright (c) 2023, Aron Wiederkehr and contributors
// For license information, please see license.txt

frappe.ui.form.on('Gutachten', {
	court: function(frm) {
        if (frm.doc.court) {
            frappe.call({
                method: "health_gutachtenpraxis.gutachtenpraxis.utils.get_judges",
                args: {
                    "court": frm.doc.court
                },
                callback: function(r) {
                    if (r.message) {
                        // Store the judge names in a separate variable
                        let judgeNames = r.message.map(judge => judge.name);
                        
                        // Set the "options" property to "Richter"
                        frm.set_df_property("judge", "options", "Richter");
                        
                        // Filter the options that are displayed to the user
                        frm.set_query("judge", function() {
                            return {
                                filters: {"name": ["in", judgeNames]}
                            };
                        });
                    }
                }
            });
        } else {
            frm.set_df_property("judge", "options", []);
            frm.set_query("judge", function() { return; });
        }
    }
});
