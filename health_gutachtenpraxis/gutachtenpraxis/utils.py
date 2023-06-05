import frappe

@frappe.whitelist()
def get_judges(court):
    court_doc = frappe.get_doc("Gericht", court)
    judge_names = [d.judge for d in court_doc.judges]
    judges = []
    for judge_name in judge_names:
        judge_doc = frappe.get_doc("Richter", judge_name)
        judge = {
            "name": judge_name,
            "description": judge_doc.judge_name,  # Replace with an actual field of the "Richter" DocType
            # Add more fields here if needed
        }
        judges.append(judge)
    return judges
