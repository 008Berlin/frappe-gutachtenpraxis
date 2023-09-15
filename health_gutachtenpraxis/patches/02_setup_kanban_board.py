import frappe

def execute():
    # Fetch all Amtsgericht documents
    courts = frappe.get_all('Gericht')
    
    # Check if the Kanban Board already exists
    kanban_board_exists = frappe.db.exists('Kanban Board', 'Gutachten Board')
    
    if not kanban_board_exists:
        kanban_board = frappe.get_doc({
            "doctype": "Kanban Board",
            "kanban_board_name": "Gutachten Board",
            "reference_doctype": "Gutachten",
            "field_name": "court",
            "card_fields": ["name"]
        })
        
        print("Add each Amtsgericht as a column")
        
        # Add each Amtsgericht as a column
        for court in courts:
            print(court.name)
            kanban_board.append("columns", {
                "column_name": court.name
            })
        
        print("Save the Kanban Board")
        # Save the Kanban Board
        kanban_board.insert()
        
    else:
        print("Kanban Board already exists. Skipping creation.")
        
    print("Patch execution completed.")
