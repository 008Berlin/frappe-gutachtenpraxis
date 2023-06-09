from . import __version__ as app_version
import frappe

app_name = "health_gutachtenpraxis"
app_title = "Health Gutachtenpraxis"
app_publisher = "Aron Wiederkehr"
app_description = "Frappe app based on healthcare module"
app_email = "aron.wiederkehr@gmail.com"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/health_gutachtenpraxis/css/health_gutachtenpraxis.css"
# app_include_js = "/assets/health_gutachtenpraxis/js/health_gutachtenpraxis.js"

# include js, css files in header of web template
# web_include_css = "/assets/health_gutachtenpraxis/css/health_gutachtenpraxis.css"
# web_include_js = "/assets/health_gutachtenpraxis/js/health_gutachtenpraxis.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "health_gutachtenpraxis/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
#	"methods": "health_gutachtenpraxis.utils.jinja_methods",
#	"filters": "health_gutachtenpraxis.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "health_gutachtenpraxis.install.before_install"
# after_install = "health_gutachtenpraxis.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "health_gutachtenpraxis.uninstall.before_uninstall"
# after_uninstall = "health_gutachtenpraxis.uninstall.after_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "health_gutachtenpraxis.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
#	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
#	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
#	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
#	"*": {
#		"on_update": "method",
#		"on_cancel": "method",
#		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
#	"all": [
#		"health_gutachtenpraxis.tasks.all"
#	],
#	"daily": [
#		"health_gutachtenpraxis.tasks.daily"
#	],
#	"hourly": [
#		"health_gutachtenpraxis.tasks.hourly"
#	],
#	"weekly": [
#		"health_gutachtenpraxis.tasks.weekly"
#	],
#	"monthly": [
#		"health_gutachtenpraxis.tasks.monthly"
#	],
# }

# Testing
# -------

# before_tests = "health_gutachtenpraxis.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
#	"frappe.desk.doctype.event.event.get_events": "health_gutachtenpraxis.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
#	"Task": "health_gutachtenpraxis.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["health_gutachtenpraxis.utils.before_request"]
# after_request = ["health_gutachtenpraxis.utils.after_request"]

# Job Events
# ----------
# before_job = ["health_gutachtenpraxis.utils.before_job"]
# after_job = ["health_gutachtenpraxis.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
#	{
#		"doctype": "{doctype_1}",
#		"filter_by": "{filter_by}",
#		"redact_fields": ["{field_1}", "{field_2}"],
#		"partial": 1,
#	},
#	{
#		"doctype": "{doctype_2}",
#		"filter_by": "{filter_by}",
#		"partial": 1,
#	},
#	{
#		"doctype": "{doctype_3}",
#		"strict": False,
#	},
#	{
#		"doctype": "{doctype_4}"
#	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
#	"health_gutachtenpraxis.auth.validate"
# ]
fixtures = [
    'Gutachtenarten',
]

# In your hooks.py file

def on_update(doc, method):
    print("on_update called") 

    # Fetch all gutachten where this patient is linked
    gutachten_list = frappe.get_all('Gutachten', filters={'patient': doc.name})
    print("Found {} gutachten(s)".format(len(gutachten_list)))  # Debugging print statement

    # Define the fields you want to update
    fields_to_update = [
        'salutation',
        'first_name',
        'last_name',
        'dob',
        'm_patient_street',
        'm_patient_zipcode',
        'm_patient_city',
        'patient_phone',
        'patient_additions',
        'copy_mainfile',
        'a_patient_residence',
        'a_patient_residence_name',
        'a_patient_residence_station',
        'a_patient_street',
        'a_patient_zipcode',
        'a_patient_city',
        'a_patient_residence_phone'
    ]

    # Update each gutachten
    for gutachten in gutachten_list:
        g_doc = frappe.get_doc('Gutachten', gutachten.name)

        # Update each field
        for field in fields_to_update:
            g_doc.set('patient_' + field, doc.get(field))

        g_doc.save()
        print("Updated gutachten {}".format(gutachten.name))  # Debugging print statement

# Define the hook
doc_events = {
    "Gutachten Patient": {
        "on_update": ["health_gutachtenpraxis.hooks.on_update"]
    }
}

