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
from frappe.utils.password import update_password as _update_password


    
@frappe.whitelist()
def createWebUser( email, nombre, contrasena,apellido="",sexo="Male" ):
    nuevo = 0
    if( not frappe.db.exists("User",email) ):
        nuevo=1
        doc = frappe.get_doc({
                        "doctype": "User",
                        "enabled":1,
                        "email": email,
                        "username": email,
                        "first_name": nombre,
                        "last_name": "",
                        "send_welcome_email":1,
                        "thread_notify":0,
                        "new_password":contrasena,
                        "user_type":"Website User",
                        'roles':[{
                                "doctype": "Has Role",
                                "role":"Patient"
                            },
                            {
                                "doctype": "Has Role",
                                "role":"Customer"
                            }]
        })
        doc.insert()
        _update_password(user=email, pwd=contrasena, logout_all_sessions=1)
        doc = frappe.get_doc("User",email)
        doc.save()
    
    #if (not frappe.db.exists({ 'doctype': 'Patient', "owner":email }) ):
    #    nuevo=0
    #    patient = frappe.get_doc({
    #        "doctype": "Patient",
    #        "patient_name": nombre + " " + apellido,
    #        "sex":"Male",
    #        "email":email,
    #        "owner":email
    #    } )
    #    patient.insert()
    if(nuevo == 0 ):
        return "usuario ya existe"
    else:
        return doc
@frappe.whitelist()
def create_pacient(email, nombre, apellido, contrasena,sexo="Male" ):    
    patient = frappe.get_doc({
        "doctype": "Patient",
        "patient_name": nombre + " " + apellido,
        "email":email,
        "sex":sexo,
        "owner":email
    } )
    patient.insert(ignore_permissions=True)
    return "creado"

@frappe.whitelist()
def get_medicos_filtros(nombre=None,apellidos=None,departamento=None,provincia=None,distrito=None,especialidad=None,tiempo=None, dia=None, estado=None, start_limit=0, limit_end=20):
    sqlWhere = "WHERE "
    sqlSelect = "select ficha.* from `tabFicha de Registro de Medicos` AS ficha "
    sqlInnerJoin = " INNER JOIN `tabHealthcare Schedule Time Slot` AS timeslot ON ficha.owner = timeslot.owner "

    first_filter = 0
    depa = 0
    tiempo_dia=0

    if( nombre is not None and nombre != ""):
        sqlWhere += "ficha.nombre like \'%"+nombre+"%\' "
        first_filter=1
    if( apellidos is not None and apellidos != ""):
        if(first_filter == 1 ):
            sqlWhere+="AND "
        sqlWhere += "ficha.apellidos like '%"+apellidos+"%' "
        first_filter=1
    if( departamento is not None and departamento != ""):
        if(first_filter == 1 ):
            sqlWhere+="AND "
        sqlWhere += "(( ficha.departamento_1 = '"+departamento+"' "
        depa=1
        first_filter=1
    if( provincia is not None and provincia != ""):
        if(first_filter == 1 ):
            sqlWhere+="AND "
        sqlWhere += "ficha.provincia_1 = '"+provincia+"' "
        depa=1
        first_filter=1
    if( distrito is not None and distrito != ""):
        if(first_filter == 1 ):
            sqlWhere+="AND "
        sqlWhere += "ficha.distrito_1 = '"+distrito+"' "
        depa=1
        first_filter=1
    if( depa == 1 ):
        sqlWhere += ") "
    
    if( departamento is not None and departamento != ""):
        if(first_filter == 1 ):
            sqlWhere+="OR "
        sqlWhere += "( ficha.departamento_2 = '"+departamento+"' "
        depa=1
        first_filter=1
    if( provincia is not None and provincia != ""):
        if(first_filter == 1 ):
            sqlWhere+="AND "
        sqlWhere += "ficha.provincia_2 = '"+provincia+"' "
        depa=1
        first_filter=1
    if( distrito is not None and distrito != ""):
        if(first_filter == 1 ):
            sqlWhere+="AND "
        sqlWhere += "ficha.distrito_2 = '"+distrito+"' "
        depa=1
        first_filter=1
    if( depa == 1):
        sqlWhere += ") ) "
    if( especialidad is not None and especialidad != ""):
        if(first_filter == 1 ):
            sqlWhere+="AND "
        sqlWhere += "( ficha.especialidad = '"+especialidad+"' "
        first_filter=1
    if( estado is not None and estado != ""):
        if(first_filter == 1 ):
            sqlWhere+="AND "
        sqlWhere += "( ficha.estado = '"+estado+"' "
        first_filter=1
    if( especialidad is not None and especialidad != ""):
        if(first_filter == 1 ):
            sqlWhere+="OR "
        sqlWhere += "ficha.segunda_especialidad = '"+especialidad+"' )"
        first_filter=1
    if( tiempo is not None and tiempo != ""):
        if(first_filter == 1 ):
            sqlWhere+="AND "
        sqlWhere += "timeslot.from_time LIKE '"+tiempo+".000000' "
        first_filter=1
        tiempo_dia=1
    if( dia is not None and dia != ""):
        if(first_filter == 1 ):
            sqlWhere+="AND "
        sqlWhere += "timeslot.`day` = '"+dia+"' "
        first_filter=1
        tiempo_dia=1
    if(first_filter==0):
        sqlWhere=""
    if(tiempo_dia==0):
        sqlInnerJoin=""
    result = frappe.db.sql( sqlSelect + sqlInnerJoin+sqlWhere + " GROUP BY ficha.name ORDER BY ficha.creation DESC LIMIT " + str(start_limit) + "," + str(limit_end), as_dict=True)
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

def create_conference(doc, method=None, culqi=None, token="", amount="10000", email="richard@piedpiper.com", currency_code="PEN"):
    invoicename = "Paid"    
    if(doc.doctype == "Payment Entry"):
        paid_total = doc.total_allocated_amount
        doc = frappe.get_doc("Sales Invoice",doc.references[0].reference_name) 
        if(doc.items[0].reference_dt == "Patient Appointment"):
            appoint = frappe.get_doc(doc.items[0].reference_dt,doc.items[0].reference_dn) 
            appoint.paid_amount = paid_total
            appoint.estapagado = "Pagado"
            appoint.save()

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