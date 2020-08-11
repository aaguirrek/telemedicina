frappe.provide('frappe.form_dict');
frappe.provide('frappe.pages');
frappe.provide('frappe.views');
frappe.provide('sample_register');

frappe.pages['video-conferencia'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'VideoConferenciaAdmin',
		single_column: true
	});
	page.wrapperTemplate = page.wrapper.html(frappe.render_template("video_conferencia","" ) )	
	confere = frappe.ui.form.make_control({
		parent: $('#conferencia'),
		df: {
			label: 'Paciente',
			fieldname: 'paciente',
			fieldtype: 'Link',
			options:"Patient",
			change: function(frm){
				getcita(confere.get_value() );
			}
		},
		render_input: true
	});
}
function getcita(cit=""){
	$("#crearBoton").hide();
	var d = new Date();

	var citas=null;
	$('#cita').html("");
	
	
	frappe.call({
		method:"frappe.client.get",
		args:{
			"doctype": 'Patient', 
			fields:"*", 
			name:cit
		},
		async:true,
        callback: function(r) {
			let doc = r.message;
			$("#datosPaciente").html(`
			<p><b>Paciente:</b> ${doc.patient_name}</p>
			<p><b>Celular:</b> ${doc.mobile}</p>
			<p><b>Email:</b> ${doc.email}</p>
			<p><b>Fecha de nacimiento:</b> ${doc.dob}</p>
			<p><b>Cliente:</b> ${doc.customer}</p>
			<p><b>Grupo Sanguíneo:</b> ${doc.blood_group}</p>
			`);
        }
	});

	frappe.call({
		method:"frappe.client.get_list",
		args:{"doctype": 'Video Conferencia', fields:"*",filters:[["paciente","=",cit],["returncode","!=","SUCCESS"], ["fecha","=", d.getUTCDate ] ] },
		async:false,
        callback: function(r) {
            citas = r.message;
        }
	});
	
	var horarios=[];
	citas.forEach(element => {
		horarios.push(element.hora);
	});
	
	 cita = frappe.ui.form.make_control({
		parent: $('#cita'),
		df: {
			label: 'Cita',
			fieldname: 'cita',
			fieldtype: 'Select',
			options: horarios,
			change: function(frm){
				$("#crearBoton").show();
			}
		},
		render_input: true
	});

	
}