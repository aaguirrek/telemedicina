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

def ficha_registro_store(doc, method=None):
    if(doc.doctype == "Ficha de Registro de Medicos"):
        horario = frappe.get_doc({
            'doctype':'Practitioner Schedule',
            'schedule_name':'horario '+frappe.session.user,
            'name':'horario '+frappe.session.user
        })
        horario.insert(ignore_permissions=True,ignore_if_duplicate=True)
        #horario.save(ignore_permissions=True)
        medico = frappe.get_doc({
            'doctype': 'Healthcare Practitioner',
            'name': doc.dni,
            'first_name': doc.nombre,
            'last_name': doc.apellidos,
            'hospital': doc.centro_de_labores_1,
            'image': doc.foto,
            'department': doc.especialidad,
            'practitioner_schedules': [{"schedule":'Horario '+frappe.session.user,"service_unit":"Citas 1 - H"}],
            'op_consulting_charge':doc.precio,
            'user_id':frappe.session.user,
            'nombre_de_usuario':frappe.session.user
        })
        user = frappe.get_doc("User", frappe.session.user )
        user.append('roles',{
                    "doctype": "Has Role",
                    "role":"Physician"
                })
        user.role_profile_name = frappe.session.user_rol
        user.save(ignore_permissions=True)

        medico.insert(ignore_permissions=True,ignore_if_duplicate=True)
        frappe.rename_doc("Healthcare Practitioner", medico.name, doc.dni)
        #medico.save(ignore_permissions=True)
        
        frappe.db.set_value('User', frappe.session.user ,"user_image", doc.foto)
        frappe.db.set_value('User', frappe.session.user ,"first_name", doc.nombre)
        frappe.db.set_value('User', frappe.session.user ,"last_name", doc.apellidos)
        frappe.db.set_value('User', frappe.session.user ,"last_name", doc.apellidos)
        return medico
    return True