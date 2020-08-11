from __future__ import unicode_literals
from frappe import _


def get_data():
    return [
        {
            "label": _("Telemedicina"),
            "items": [
                {
                    "type": "doctype",
                    "name": "Patient Appointment",
					"onboard": 1
                },
                {
                    "type": "doctype",
                    "name": "Patient",
					"onboard": 1
                },
                {
                    "type": "doctype",
                    "name": "Healthcare Practitioner",
                    "label": "Medico",
					"onboard": 0
                }
            ]
        },
        {
            "label": _("Conferencia"),
            "items": [
                {
                    "type": "page",
                    "name": "video-conferencia",
                    "label":"Iniciar Conferencia",
					"onboard": 1
                },
                {
                    "type": "doctype",
                    "name": "Video Conferencia",
					"onboard": 1
                }
            ]
        }
    ]