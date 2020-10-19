# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# MIT License. See license.txt
from __future__ import unicode_literals

import frappe
import frappe.client
import requests
import frappe.handler
import datetime
from frappe import _
from frappe.utils import cint
from frappe.utils.response import build_response


@frappe.whitelist()
def get_medicos_filtros(nombre=None,apellidos=None,departamento=None,provincia=None,distrito=None,especialidad=None, start_limit=0, limit_end=20):
    sqlWhere = "where "
    first_filter = 0
    depa = 0
    if( nombre is not None and nombre != ""):
        sqlWhere += "nombre like \'%"+nombre+"%\' "
        first_filter=1
    if( apellidos is not None and apellidos != ""):
        if(first_filter == 1 ):
            sqlWhere+="and "
        sqlWhere += "apellidos like '%"+apellidos+"%' "
        first_filter=1
    if( departamento is not None and departamento != ""):
        if(first_filter == 1 ):
            sqlWhere+="and "
        sqlWhere += "(( departamento_1 = '"+departamento+"' "
        depa=1
        first_filter=1
    if( provincia is not None and provincia != ""):
        if(first_filter == 1 ):
            sqlWhere+="and "
        sqlWhere += "provincia_1 = '"+provincia+"' "
        depa=1
        first_filter=1
    if( distrito is not None and distrito != ""):
        if(first_filter == 1 ):
            sqlWhere+="and "
        sqlWhere += "distrito_1 = '"+distrito+"' "
        depa=1
        first_filter=1
    if( depa == 1 ):
        sqlWhere += ") "
    
    if( departamento is not None and departamento != ""):
        if(first_filter == 1 ):
            sqlWhere+="or "
        sqlWhere += "( departamento_2 = '"+departamento+"' "
        depa=1
        first_filter=1
    if( provincia is not None and provincia != ""):
        if(first_filter == 1 ):
            sqlWhere+="and "
        sqlWhere += "provincia_2 = '"+provincia+"' "
        depa=1
        first_filter=1
    if( distrito is not None and distrito != ""):
        if(first_filter == 1 ):
            sqlWhere+="and "
        sqlWhere += "distrito_2 = '"+distrito+"' "
        depa=1
        first_filter=1
    if( depa == 1):
        sqlWhere += ") ) "
    if( especialidad is not None and especialidad != ""):
        if(first_filter == 1 ):
            sqlWhere+="and "
        sqlWhere += "( especialidad = '"+especialidad+"' "
        first_filter=1
    if( especialidad is not None and especialidad != ""):
        if(first_filter == 1 ):
            sqlWhere+="or "
        sqlWhere += "segunda_especialidad = '"+especialidad+"' )"
        first_filter=1
    if(first_filter==0):
        sqlWhere=""
    
    result = frappe.db.sql("""select * from `tabFicha de Registro de Medicos` """+sqlWhere+""" order by creation desc limit """+str(start_limit)+ ""","""+str(limit_end), as_dict=True)
    return result

@frappe.whitelist( allow_guest = True )
def dni(dni, code):
    url =  'https://lobellum.frappe.technology/api/services/dni/'+dni
    x = requests.get(url, headers = {"Authorization": "Bearer m5TX5llKHKx3WhIGBqNqX3VLozorFcz7yBxtpAWXGFojX7brWA","Content-Type": "application/json"}).json()
    if str(x['data']['verification_code']) == str(code):
        return x    
    else:
        return {"success": "false", "message": "dni y el codigo de verificación no coinciden"}
    return x

@frappe.whitelist( allow_guest = True )
def create(url):
    x = requests.post(url)
    return x.text

@frappe.whitelist( allow_guest = True )
def get_patient(user_id):
    patientname = frappe.db.get_value('Patient', { "owner":user_id }, 'name')
    patient = frappe.get_doc('Patient', patientname)
    return patient

@frappe.whitelist()
def edit_medico(user_id, campo, value, hospital, image):
    medico = frappe.db.set_value('Healthcare Practitioner', user_id ,"op_consulting_charge", value)
    medico = frappe.db.set_value('Healthcare Practitioner', user_id ,"department", campo)
    medico = frappe.db.set_value('Healthcare Practitioner', user_id ,"department", campo)
    medico = frappe.db.set_value('Healthcare Practitioner', user_id ,"hospital", hospital)
    medico = frappe.db.set_value('Healthcare Practitioner', user_id ,"image", image)
    medico = frappe.db.set_value('User', frappe.session.user ,"user_image", image) 
    return medico


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
        last_doc = frappe.get_list(
            "Saldos y Pagos",
            fields='"*"', 
            filters=[["medico","=","Ficha-Administrator"],["estado","=","Por Retirar"]], 
            order_by='creation desc',
            limit_page_length=5
        )
        saldo = 0
        if len(last_doc) == 0:
            saldo=0
        else:
            saldo = last_doc[0].monto
            
        saldo = frappe.get_doc({
            "cita": doc.name,
            "medico": "Ficha-" + practitioner.user_id,
            "paciente": doc.patient,
            "monto": doc.paid_amount,
            "fecha_y_hora": doc.appointment_date.strftime("%Y-%m-%d")+" "+str(doc.appointment_time),
            "estado":"Por Retirar",
            "doctype":"Saldos y Pagos",
            "acumulado": saldo + doc.paid_amount
        })
        saldo.save()
        
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