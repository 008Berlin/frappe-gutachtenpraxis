frappe.views.calendar['Termin'] = {
    field_map: {
        start: 'start_time',
        end: 'end_time',
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