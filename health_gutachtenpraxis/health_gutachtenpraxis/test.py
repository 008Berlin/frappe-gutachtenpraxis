import frappe

def main():
    # Your script logic goes here
    print("Hello from my_script!")
    
    # Example: Accessing Frappe's database
    doc = frappe.get_doc("ToDo", "12345")
    print(doc.description)

if __name__ == "__main__":
    frappe.connect()
    main()
    frappe.db.commit()