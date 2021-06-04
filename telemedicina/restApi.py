# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# MIT License. See license.txt
from __future__ import unicode_literals

import base64
import binascii
import json

from six import string_types
from six.moves.urllib.parse import urlencode, urlparse
from pyfcm import FCMNotification

import frappe
import frappe.client
import frappe.handler
from frappe import _
from frappe.utils.response import build_response
from frappe.utils.password import update_password as _update_password, check_password
  
def correctLogin(usr,pwd):
    try:
        return check_password(usr, pwd)
    except frappe.AuthenticationError:
        return 'contraseña incorrecta'

@frappe.whitelist(allow_guest = True)
def createWebUser( email, nombre, contrasena,apellido="",sexo="Male" ):
    frappe.set_user("Administrator")
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
    if(nuevo == 0 ):
        return "usuario ya existe"
    else:
        return doc

@frappe.whitelist(allow_guest = True)
def reactLogin(usr, pwd ):
    response = correctLogin(usr,pwd)
    if(response != "contraseña incorrecta"):
        frappe.set_user(response)
        response = frappe.get_doc("User", usr)
        medico=frappe.db.get_list("Healthcare Practitioner",filters=[["user_id","=",response.name]], page_length=1)
        medico_name=None
        if medico:
            medico_name = medico[0].name
    return {"user":response, "medico":medico_name}

@frappe.whitelist(allow_guest = True)
def firebase_send(user_destination,titulo="",body="", data={}):
    push_service = FCMNotification(api_key="AAAAZWvO8w8:APA91bGHOXZ_61-Ns0hNaW4GKx6kwHqujCNHuo_DMus9HOV3MqSvMRsrENDChLLVFB1T4TMHVXA9j3baVQQzFo2ClV-003snRxpvKrKswE3_cNiotuSHPclOmSkeOFhPcsAHxy0_3hdt")
    medico=frappe.db.get_list("Firebase Token",fields=["token"],filters=[["user","=",user_destination]], as_list=True)
    if not medico:
        return "sin data"
    
    registration_ids = []
    for key in medico:
        registration_ids.append(key[0])
    message_title = titulo
    message_body = body
    data_message = data

    message_icon = "https://hisalud.com/files/message_icon-01.png"
    push_message=push_service.notify_multiple_devices(registration_ids=registration_ids, message_title=message_title, message_body=message_body, message_icon=message_icon, data_message=data_message)
    return push_message

@frappe.whitelist(allow_guest = True)
def firebase(user,disp,token):
    if frappe.db.exists("Firebase Token",disp):
        doc = frappe.get_doc("Firebase Token",disp)
        doc.user=user
        doc.disp=disp
        doc.token=token
        return doc.save()
    else:
        doc = frappe.get_doc({
            "doctype":"Firebase Token", 
            "user":user,
            "disp":disp,
            "token":token
        })
        
        return doc.insert()

@frappe.whitelist(allow_guest = True)
def react():
    """
        Handler for `/api/method/telemedicina.restApi.react` methods
        data:{
            url:/{resources}/{doctype}/{name}
        }

        ### Examples:

        `/api/method/{methodname}` will call a whitelisted method

        `/api/resource/{doctype}` will query a table
            examples:
            - `?fields=["name", "owner"]`
            - `?filters=[["Task", "name", "like", "%005"]]`
            - `?limit_start=0`
            - `?limit_page_length=20`

        `/api/resource/{doctype}/{name}` will point to a resource
            `GET` will return doclist
            `POST` will insert
            `PUT` will update
            `DELETE` will delete

        `/api/resource/{doctype}/{name}?run_method={method}` will run a whitelisted controller method
    """
    pathname= frappe.local.form_dict.url
    formulario=frappe.local.form_dict
    authorization_header = frappe.get_request_header("ReactAuth", str()).split(" ")
    auth_token = authorization_header[1]
    usr, pwd = frappe.safe_decode(base64.b64decode(auth_token)).split(":")
    user = correctLogin(usr,pwd)
    if(user == "contraseña incorrecta"):
        return user
    frappe.set_user(user)
    parts = pathname.split("/",3)

    call = doctype = name = None
    formulario.pop('url', None)
    for item in formulario:
        if(item=="filters" or item=="fields"):
           formulario[item] = json.loads(formulario[item] )
    if len(parts) > 1:
        call = parts[1]

    if len(parts) > 2:
        doctype = parts[2]

    if len(parts) > 3:
        name = parts[3]
    if call=="method":
        return frappe.local.form_dict
        frappe.local.form_dict.cmd = doctype
        return frappe.handler.handle()
    elif call=="get":
        if name:
            doc = frappe.get_doc(doctype, name)
            if not doc.has_permission("read"):
                raise frappe.PermissionError
            frappe.local.response.update({"data": doc})
        elif doctype:
            formulario.setdefault('limit_page_length', 20)
            formulario.setdefault('limit_page_start', 0)
            formulario.setdefault('order_by', 'modified desc')
            if formulario.get("filters"):
                frappe.local.response.update({
                            "data":frappe.db.get_list(
                                doctype=doctype,
                                fields=formulario.fields,
                                filters=formulario.filters,
                                start=formulario.limit_page_start,
                                page_length=formulario.limit_page_length,
                                order_by=formulario.order_by 
                                ) })
            else:
                frappe.local.response.update({
                            "data":frappe.db.get_list(
                                doctype=doctype,
                                fields=formulario.fields,
                                start=formulario.limit_page_start,
                                page_length=formulario.limit_page_length,
                                order_by=formulario.order_by 
                                ) })
    elif call=="resource":
        if "run_method" in formulario:
            method = formulario.pop("run_method")
            doc = frappe.get_doc(doctype, name)
            doc.is_whitelisted(method)
            if frappe.local.request.method=="POST":
                if not doc.has_permission("write"):
                    frappe.throw(_("Not permitted"), frappe.PermissionError)

                frappe.local.response.update({"data": doc.run_method( method, formulario )})
                frappe.db.commit()

        else:
            if name:
                if frappe.local.request.method=="PUT":
                    data = get_request_form_data()

                    doc = frappe.get_doc(doctype, name)

                    if "flags" in data:
                        del data["flags"]

                    # Not checking permissions here because it's checked in doc.save
                    doc.update(data)

                    frappe.local.response.update({
                        "data": doc.save().as_dict()
                    })

                    if doc.parenttype and doc.parent:
                        frappe.get_doc(doc.parenttype, doc.parent).save()

                    frappe.db.commit()

                if frappe.local.request.method=="DELETE":
                    # Not checking permissions here because it's checked in delete_doc
                    frappe.delete_doc(doctype, name, ignore_missing=False)
                    frappe.local.response.http_status_code = 202
                    frappe.local.response.message = "ok"
                    frappe.db.commit()


            elif doctype:
                if frappe.local.request.method == "POST":
                    data = get_request_form_data()
                    data.update({
                        "doctype": doctype
                    })
                    frappe.local.response.update({
                        "data": frappe.get_doc(data).insert().as_dict()
                    })
                    frappe.db.commit()
            else:
                raise frappe.DoesNotExistError
    else:
        raise frappe.DoesNotExistError
    return build_response("json")

def get_request_form_data():
    if frappe.local.form_dict.data is None:
        data = json.loads(frappe.safe_decode(frappe.local.request.get_data()))
    else:
        data = frappe.local.form_dict.data
        if isinstance(data, string_types):
            data = json.loads(frappe.local.form_dict.data)

    return data
