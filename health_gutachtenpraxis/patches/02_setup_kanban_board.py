import frappe

def execute():
    # Fetch all Amtsgericht documents
    courts = frappe.get_all('Gericht')
    # Create Kanban Board with each Amtsgericht as a column
    # if frappe.get_doc('Kanban Board', 'Gutachten Board'):
    #     return
    kanban_board = frappe.get_doc({
        "doctype": "Kanban Board",
        "kanban_board_name": "Gutachten Board",
        "reference_doctype": "Gutachten",
        "field_name": "court",
        "card_fields": ["name"]
    })
    print(kanban_board.as_dict())
    print("Add each Amtsgericht as a column")
    # Add each Amtsgericht as a column
    for court in courts:
        print(court.name)
        kanban_board.append("columns", {
            "column_name": court.name
        })
    print(kanban_board.as_dict())
    print("Save the Kanban Board")
    # Save the Kanban Board
    kanban_board.insert()
    # print("Fetch all Gutachten documents")
    # # Fetch all Gutachten documents
    # gutachtens = frappe.get_all('Gutachten')

    # # Map each Gutachten to the appropriate column
    # for gutachten in gutachtens:
    #     frappe.db.set_value('Gutachten', gutachten.name, 'kanban_column', gutachten.court)