// Copyright (c) 2020, Alejandro Aguirre and contributors
// For license information, please see license.txt

frappe.ui.form.on('Ficha de Registro de Medicos', {
	setup:function(frm){
		frm.set_value("user", frappe.user.name);
	},
	dni: function(frm) {
		if (frm.doc.codigo_de_verificacion != "" && frm.doc.codigo_de_verificacion !== undefined){
			frappe.call({
				method:"telemedicina.api.dni",
				args:{
				  dni: frm.doc.dni,
				  code: frm.doc.codigo_de_verificacion
				},
			  freeze:1, 
				callback: function(r) { set_dni(r.message)} 
			});
		}
	},
	codigo_de_verificacion: function(frm) {
		if (frm.doc.dni != "" && frm.doc.dni  !== undefined){
			frappe.call({
				method:"telemedicina.api.dni",
				args:{
				  dni: frm.doc.dni,
				  code: frm.doc.codigo_de_verificacion
				},
			  freeze:1, 
				callback: function(r) { set_dni(r.message)} 
			});
		}
	}
});

function set_dni(e){
	if(e.success == "false" || e.success == false){
		return frappe.throw(
			title='Error',
			msg=e.message,
			exc=FileNotFoundError
		)
	}else{
		cur_frm.set_value("nombre",e.data.names);
		var d = e.data.date_of_birthday.split("/");
		cur_frm.set_value("fecha_de_nacimiento", new Date(d[2],d[1]-1,d[0]));
		cur_frm.set_value("apellidos", e.data.first_name+" "+e.data.last_name);
		cur_frm.set_value("sexo", e.data.sex);
	}
}