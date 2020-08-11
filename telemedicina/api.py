# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# MIT License. See license.txt
from __future__ import unicode_literals

import frappe
import frappe.client
import requests
import frappe.handler
import datetime
from frappe import _
from frappe.utils.response import build_response

@frappe.whitelist( allow_guest = True )
def create(url):
    x = requests.post(url)
    return x.text

@frappe.whitelist( allow_guest = True )
def get_patient(user_id):
    patientname = frappe.db.get_value('Patient', { "owner":user_id }, 'name')
    patient = frappe.get_doc('Patient', patientname)
    return patient

def create_conference(doc, method=None):
    invoicename = "Paid"
    if(doc.doctype == "Payment Entry"):
        doc = frappe.get_doc("Sales Invoice",doc.references[0].reference_name) 

    if(doc.doctype == "Patient Appointment"):
        invoicename = frappe.db.get_value('Sales Invoice', { "reference_dt":"Patient Appointment","reference_dn":doc.name }, 'status')

    if(doc.doctype == "Sales Invoice"):
        invoicename = doc.status
        if(doc.items[0].reference_dt == "Patient Appointment"):
            doc = frappe.get_doc("Patient Appointment",doc.items[0].reference_dn)
        else:
            return
    	
    if( invoicename == "Paid"):
        practitioner = frappe.get_doc("Healthcare Practitioner",doc.practitioner)
        doc = frappe.get_doc({
            "doctype":"Video Conferencia",
            "userpacient":doc.owner,
            "paciente":doc.patient,
            "fecha":doc.appointment_date,
            "hora":doc.appointment_time,
            "medico":doc.practitioner,
            "usuario_medico":practitioner.user_id,
            "time": doc.appointment_date.strftime("%Y-%m-%d")+" "+str(doc.appointment_time),
            "cita": doc.name

        })
        doc.save()

    else:
        return
    return doc