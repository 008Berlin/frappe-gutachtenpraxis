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
        kanban_board = frappe.get_doc('Kanban Board', 'Gutachten Board')
        existing_columns = [column.column_name for column in kanban_board.columns]
        
        print("Add missing Amtsgerichts as columns")
        
        for court in courts:
            if court.name not in existing_columns:
                print(f"Adding column for {court.name}")
                kanban_board.append("columns", {
                    "column_name": court.name
                })
        
        kanban_board.save()
        print("Kanban Board updated.")
        
    print("Patch execution completed.")
