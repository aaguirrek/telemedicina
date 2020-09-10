# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "telemedicina"
app_title = "Telemedicina"
app_publisher = "Alejandro Aguirre"
app_description = "Telemedicina"
app_icon = "octicon octicon-file-directory"
app_color = "pink"
app_email = "a.aguirre@frappe.technology"
app_license = "MIT"
app_logo_url = '/assets/telemedicina/img/favicon.svg'

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
app_include_css = [ "/assets/telemedicina/css/fullcalendar@5.2.0/main.min.css",
                    "/assets/telemedicina/css/dashboard_medico.css",
                   "/assets/telemedicina/css/guide.css"
                  ]
app_include_js = [
  "/assets/telemedicina/js/sha1.min.js",
  "/assets/telemedicina/js/video_conferencia.js",
  "/assets/telemedicina/js/imgcache.js",
  "/assets/telemedicina/js/moment.luxon.js",
  "/assets/telemedicina/js/guide.js"
  
  ]

# include js, css files in header of web template
# web_include_css = "/assets/telemedicina/css/telemedicina.css"
web_include_js = "/assets/telemedicina/js/sha1.min.js"


# include js in page
page_js = {"hisalud-dashboard" : [
  "public/js/fullcalendar@5.2.0/main.min.js",
  "public/hisalud-dashboard/init.js",
  "public/hisalud-dashboard/dashboard.js",
  "public/hisalud-dashboard/vital_sings.js",
  "public/hisalud-dashboard/medico.js",
  "public/hisalud-dashboard/fields.js",
  "public/hisalud-dashboard/datosMedico.js",
  
]}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
doctype_list_js = {
  "Patient Appointment":"public/appoiment.js",
}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}
doctype_calendar_js = {
  "Patient Appointment":"public/appoiment.js",
}
# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "telemedicina.utils.get_home_page"

# Generators
# ----------


website_context = {
	'favicon': 	'/assets/telemedicina/img/favicon.svg',
	'splash_image': '/assets/telemedicina/img/favicon.svg'
}
# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "telemedicina.install.before_install"
# after_install = "telemedicina.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "telemedicina.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

doc_events = {
    "Patient Appointment": {
        "on_submit": "telemedicina.api.create_conference"
	},
    "Payment Entry": {
        "on_submit": "telemedicina.api.create_conference"
	},
    "Sales Invoice": {
        "on_submit": "telemedicina.api.create_conference"
	}
}

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"telemedicina.tasks.all"
# 	],
# 	"daily": [
# 		"telemedicina.tasks.daily"
# 	],
# 	"hourly": [
# 		"telemedicina.tasks.hourly"
# 	],
# 	"weekly": [
# 		"telemedicina.tasks.weekly"
# 	]
# 	"monthly": [
# 		"telemedicina.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "telemedicina.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "telemedicina.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "telemedicina.task.get_dashboard_data"
# }

