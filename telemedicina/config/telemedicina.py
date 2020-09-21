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
                    "name": "Ficha de Registro de Medicos",
                    "label":"Ficha de Registro de Medicos",
					"onboard": 0
                    
                },
                {
                    "type": "doctype",
                    "name": "Saldos y Pagos",
                    "label":"Saldos y Pagos",
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
                    "label":"Mi Espacio de trabajo",
					"link": "hisalud-dashboard",
					"onboard": 1
                },
                {
                    "type": "doctype",
                    "name": "Video Conferencia",
					"onboard": 1
                },
            ]
        }
    ]