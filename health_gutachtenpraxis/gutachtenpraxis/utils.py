import frappe

@frappe.whitelist()
def get_judges(court):
    print("Jetzt werden Jduges gegetteed")
    judges = frappe.db.sql("""
        SELECT judge 
        FROM `tabGericht Richter`
        WHERE parent = %s
    """, (court), as_dict=1)
    return [d.judge for d in judges]
