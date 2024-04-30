// Copyright (c) 2023, Aron Wiederkehr and contributors
// For license information, please see license.txt

frappe.views.calendar['Tagesliste'] = {
    field_map: {
        start: 'date',
        end: 'date',
        id: 'name',
        title: 'name',
        allDay: 'all_day'
    },
    gantt: false,
    options: {
        timeFormat: 'H:mm', // Use 'H:mm' for 24-hour format or 'h:mm a' for 12-hour format
        slotLabelFormat: 'H:mm', // Use 'H:mm' for 24-hour format or 'h:mm a' for 12-hour format
        defaultView: 'agendaWeek',
        contentHeight: 'auto',
        aspectRatio: 2
    }
};
