
frappe.provide("frappe.ui.form.ControlTable")
var page;

var socket = io('https://peruintercorp.com:4103',{secure: true});
var horario_dias=[];
var doc_horario;
var domain = null;
var options = null;
var api = null;
var iframec=0;

socket.on('new message', (data) => {
	if(data.medico == telemedicina.data.medico.dni && data.tipo =="nueva cita"){
		reloadcitas();
	}
});
function reloadheightframe(e){
	iframec++;
	resizeIframe(e);
	if(iframec<6){
	}
}
function reloadcitas(){
	page.wrapper.html(frappe.render_template("hisalud_dashboard",{user:frappe.user.name} )).promise().done(()=>{
		telemedicina.DocType.vital_sings();
		telemedicina.DocType.addOther();
		telemedicina.saldos.init();
		telemedicina.medico.init();
		
		});
}
frappe.pages['hisalud-dashboard'].on_page_load = function(wrapper) {
	page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'HiSalud Dashboard',
		single_column: true
	});
  var target = $('.cabecera-medico');
  ImgCache.useCachedBackground(target, function () {}, function(){
    $(".cabecera-medico").css({"background": "url("+response.url+")",
			"background-size": "cover",
			"background-position-y": "center"});
  })
	page.wrapper.html(frappe.render_template("hisalud_dashboard",{} )).promise().done(()=>{
    
		telemedicina.DocType.addOther();
		telemedicina.datosmedico.init();
		telemedicina.saldos.init();
		$('#menudebotones').slimScroll({
			height: '100vh',
			alwaysVisible: true,
			color:"#efefef",
			
		});
		
		if(window.innerWidth < 992){
			$("#ContainerPrincipal").removeClass("containeresponsivo");
		}
		
	});
	initHorario()
}
function chatToggleF(){
	return $(".dropdown-toggle.frappe-chat-toggle").trigger("click");
  }
var msgfrappe;
var finalizarCita = function(){
	$('#pageprincipal').show();
	$('#pageprincipal2').show();
	msgfrappe=null;
		if(localStorage.getItem("estadodeCita") != "guardado"){
			return msgfrappe = frappe.msgprint({
				title: __('Desea salir sin guardar'),
				message: '<b>Esta seguro que desea terminar la cita sin guardar los datos?</b> <br> si quiere guardar los datos presione sobre cerrar y luego en el botón dentro de la sección encuentro (en la barra oscura) y presione el boton que dice: <br><br>"<button type="button" class="btn btn-primary btn-sm">Guardar</button>"',
				primary_action:{
					'label': 'Salir sin guardar',
					action(values) {
						localStorage.setItem("estadodeCita", "guardado");  
						finalizarCita();
						this.hide();
					}
				}
			});
		}
	$("#framenecuentro").attr("src","");
	api.executeCommand('stopRecording', 'file');
	
	$("#meet").html("");
	if($(".iniciar-conferencia").is(':visible') ){
		$(".iniciar-conferencia").hide();
		$(".enviar-receta").show();
		  frappe.db.get_list('Patient Encounter', {
			fields: ['name'],
			filters: {
				patient: localStorage.getItem("patient-name"),
				practitioner: telemedicina.data.medico.dni
			},
		}).then(records => {
			localStorage.setItem("ultimo_encuentro",records[0].name);
		})
	   }else{
		   	$(".iniciar-conferencia").show();
			$(".enviar-receta").hide();
	  }
	/**/
	io("https://peruintercorp.com:4103", {
		secure: true
		}).emit("new message", {
		tipo: "finbbb",
		meetingid:Ncita
	});
	$("#bigbluebutton").fadeOut("slow");
  	//	$("#bbb-frame").attr("src","");
  	frappe.call({
		method:"frappe.client.get_list",
		args:{ 
			doctype     : 'Video Conferencia', 
			fields      : "*", 
			filters     : [ ["cita","=", Ncita ] ] 
		},
		async:false,
		callback: function(r) {
			if(r.message.length > 0){doc = r.message[0];}
		}
	});
	doc.returncode = "FINALIZE";
	frappe.db.set_value('Video Conferencia', doc.name, doc ).then(r => {});

	$(".dropdown-toggle.frappe-chat-toggle").css({left:"unset",right:"30px"});	
	
}
var  abrirIntro = () =>{
  $("#introframe").attr("src","https://app.wideo.co/embed/28749161597381453659?width=960&height=540&repeat=false&autoplay=true");
  $("#videointro").fadeIn();
}
var vdconferencia={};
var iniciarCita = function(){
  //conferencia.Patient_dashboard_create();
	  localStorage.setItem("appointment", Ncita);
	  localStorage.setItem("estadodeCita", "iniciado");
	  vdconferencia={};
	frappe.call({
		method:"frappe.client.get_list",
		args:{ 
			doctype     : 'Video Conferencia', 
			fields      : "*", 
			filters     : [ ["cita","=", Ncita ] ] 
		},
		async:false,
		callback: function(r) {
			
			if(r.message.length > 0){
				vdconferencia = r.message[0];
				doc = r.message[0];
				doc.returncode = "SUCCESS";
				frappe.db.set_value('Video Conferencia', doc.name, doc ).then(r => {});
			}else{
				return frappe.msgprint("El paciente no ha completado el pago");
			}
		}
	});

	$(".dropdown-toggle.frappe-chat-toggle").css({left:"20px",right:"unset"});	
	
	$("#framenecuentro").attr("src","https://hisalud.com/desk#Form/Patient%20Encounter/Nuevo%20Encuentro%20con%20el%20Paciente%201");
	$("#bigbluebutton").fadeIn("slow").promise().done(function(){
		//$("#cita-tabss").slimscroll({height:"auto"});
		$('#pageprincipal').hide();
		$('#pageprincipal2').hide();
		
		domain = 'meet.hisalud.com';
		options = {
			roomName: Ncita,
			width: "100%",
			userInfo: {
				email: 	telemedicina.data.medico.user,
				displayName: telemedicina.data.medico.nombre,
				avatarUrl: telemedicina.data.medico.foto
			},
			parentNode: document.querySelector('#meet')
			
		};
		api = new JitsiMeetExternalAPI(domain, options);
		api.executeCommand('displayName', telemedicina.data.medico.nombre);
		api.executeCommand('avatarUrl', "https://hisalud.com" + telemedicina.data.medico.foto);
		api.addEventListener('participantRoleChanged', function (event) {
			if(event.role === 'moderator') {
				api.executeCommand('toggleLobby', true);
				
			}
		});
		api.addEventListener('participantKickedOut', function (event) {
			console.clear();
			console.log(event)
			if (event._displayName == telemedicina.data.nombre) {
				finalizarCita()
			}
		});
		api.executeCommand('startRecording', {
			mode: 'file' //recording mode, either `file` or `stream`.
		});
		setTimeout(
			function(){
				
				api.executeCommand('displayName', telemedicina.data.medico.nombre)
				api.executeCommand('avatarUrl', "https://hisalud.com" + telemedicina.data.medico.foto);
				io("https://peruintercorp.com:4103", {
					secure: true
					}).emit("new message", {
					tipo: "initbbb",
					meetingid:Ncita,
					titulo: `Dr. ${telemedicina.data.medico.nombre} ${telemedicina.data.medico.apellidos}`,
					mensaje:`El Dr. ${telemedicina.data.medico.nombre} ${telemedicina.data.medico.apellidos} ha ingresado lo esta esperando haga click en Empezar la cita para ingresar a la cita.`,
					userpacient: vdconferencia.userpacient,
					paciente: vdconferencia.paciente
				});
			}
		, 5000)
		if(intro == "no"){
		// abrirIntro();
		}
		
    
	});
	
	

}

var  cerrarIntro = () =>{
  
  $("#videointro").fadeOut();
  intro = "si";
  localStorage.setItem("intro","si");
  $("#introframe").attr("src","#");
}
var show_patient_info = function(patient, me){
  localStorage.setItem("patient-name",patient)
  if($("#cita-body").length){ 
    $("#cita-body").show();
    $("#paciente-body").show();
  }
  $("#"+me).html("");
	frappe.call({
		"method": "erpnext.healthcare.doctype.patient.patient.get_patient_detail",
		args: {
			patient: patient
		},
		callback: function (r) {
			var data = r.message;
			var details = "";
			frappe.db.get_value("User",data.email,"user_image",function(e){$("#patient-image").attr("src",e.user_image); $("#patient-bg").attr("src",e.user_image);});
			
			$("#patient-name").html(data.patient_name);
			if(data.sex == "Female"){data.sex = "Femenino"}
			if(data.sex == "Male"){data.sex = "Masculino"}
			if(data.sex == "Other"){data.sex = "Otro"}
			$("#patient-subtitle").html(`${data.sex} - ${data.email} - ${data.mobile} <br> ${data.dob} `);
			if(data.talla) details += `<div class="row"><div class="col-xs-4"><b>Talla:</b></div><div class="col-xs-8">${data.talla} metros</div></div>`;
			if(data.peso) details += `<div class="row"><div class="col-xs-4"><b>Peso:</b></div><div class="col-xs-8">${data.peso} kg</div></div>`;
			if(data.occupation) details += `<div class="row"><div class="col-xs-4"><b>Ocupación:</b></div><div class="col-xs-8">${data.occupation}</div></div>`;
			if(data.blood_group) details += `<div class="row"><div class="col-xs-4"><b>Tipo de sangre: </b></div><div class="col-xs-8">${data.blood_group}</div></div>`;
			if(data.allergies) details +=  `<div class="row"><div class="col-xs-4"><b>Alergias: </b></div><div class="col-xs-8">${data.allergies.replace("\n", "<br>")}</div></div>`;
			if(data.medication) details +=  `<div class="row"><div class="col-xs-4"><b>Medicacion: </b></div><div class="col-xs-8">${data.medication.replace("\n", "<br>")}</div></div>`;
			if(data.alcohol_current_use) details +=  `<div class="row"><div class="col-xs-4"><b>Uso de alcohol: </b></div><div class="col-xs-8">${data.alcohol_current_use}</div></div>`;
			if(data.tobacco_current_use) details +=  `<div class="row"><div class="col-xs-4"><b>Uso de tabaco: </b></div><div class="col-xs-8">${data.tobacco_current_use}</div></div>`;
			if(data.consumo_marihuana) details +=  `<div class="row"><div class="col-xs-4"><b>Uso de marihuana: </b></div><div class="col-xs-8">${data.consumo_marihuana}</div></div>`;
			if(data.consumo_otras_drogas) details +=  `<div class="row"><div class="col-xs-4"><b>Uso de otras drogas: </b></div><div class="col-xs-8">${data.consumo_otras_drogas}</div></div>`;
			if(data.medical_history) details +=  `<div class="row"><div class="col-xs-4"><b>Enfermedades previas: </b></div><div class="col-xs-8">${data.medical_history.replace("\n", "<br>")}</div></div>`;
			if(data.surgical_history) details +=  `<div class="row"><div class="col-xs-4"><b>Historia Quirúrgica: </b></div><div class="col-xs-8">${data.surgical_history.replace("\n", "<br>")}</div></div>`;
			if(data.other_risk_factors) details += `<div class="row"><div class="col-xs-4"><b>Deportes: </b></div><div class="col-xs-8">${data.other_risk_factors.replace("\n", "<br>")}</div></div>`;
			if(data.patient_details) details += `<div class="row"><div class="col-xs-4"><b>Más información: </b></div><div class="col-xs-8"><textarea id="${me}moreinfo" class="form-control textarea-html" disabled>${data.patient_details}</textarea></div></div>`;
			if(data.apellidos_y_nombres_del_contacto) details += `<div class="row"><div class="col-xs-4"><b>Contacto de emergencia: </b></div><div class="col-xs-8">${data.apellidos_y_nombres_del_contacto} - ${data.relacion_del_contacto}</div></div>`;
			if(data.celular_del_contacto) details += `<div class="row"><div class="col-xs-4"><b>Celular del contacto de emergencia: </b></div><div class="col-xs-8">${data.celular_del_contacto}</div></div>`;
			
			$("#"+me).html(details).promise().done(function(){
				textAreaAdjust(me+"moreinfo",me);
			});
			
			
		}
	});
};
var showPaciente = function(){
	$("#btn-paciente").toggleClass("octicon-chevron-down");
	$("#btn-paciente").toggleClass("octicon-chevron-up");
	$("#paciente-body").fadeToggle("slow");
}
var showcita = function(){
	$("#btn-cita").toggleClass("octicon-chevron-down");
	$("#btn-cita").toggleClass("octicon-chevron-up");
	$("#cita-body").fadeToggle("slow");
}
var textAreaAdjust = function(e,me) {
  element = document.getElementById(e);
  element.style.height = "1px";
  element.style.height = (25+element.scrollHeight)+"px";
  $("#"+me).fadeOut("slow");
}
var add_date_separator = function(data) {
	var date = frappe.datetime.str_to_obj(data.creation);

	var diff = frappe.datetime.get_day_diff(frappe.datetime.get_today(), frappe.datetime.obj_to_str(date));
	if(diff < 1) {
		var pdate = 'Hoy día';
	} else if(diff < 2) {
		pdate = 'Ayer';
	} else {
		pdate = frappe.datetime.global_date_format(date);
	}
	data.date_sep = pdate;
	return data;
};

var get_documents = function(patient, me){
  $(me).html("");
	frappe.call({
		"method": "erpnext.healthcare.page.patient_history.patient_history.get_feed",
		args: {
			name: patient,
			start: me.start,
			page_length: 20
		},
		callback: function (r) {
			var data = r.message;
			if(data.length){
				add_to_records(me, data);
			}else{
				$(me).append("<div class='text-muted' align='center'><br><br>No hay más registros..<br><br></div>");
				$(".btn-get-records").hide();
			}
		}
	});
};

var add_to_records = function(me, data){
	var details = "<ul class='nav nav-pills nav-stacked'>";
	var i;
	for(i=0; i<data.length; i++){
		if(data[i].reference_doctype){
			let label = '';
			if(data[i].subject){
				label += "<br/>"+data[i].subject;
			}
			data[i] = add_date_separator(data[i]);
			if(frappe.user_info(data[i].owner).image){
				data[i].imgsrc = frappe.utils.get_file_link(frappe.user_info(data[i].owner).image);
			}
			else{
				data[i].imgsrc = false;
			}
			var time_line_heading = data[i].practitioner ? `${data[i].practitioner} ` : ``;
			
			
			
			if(data[i].reference_doctype == "Patient Encounter"){
				time_line_heading +=  "Encuentro con el paciente" + " - "+ data[i].reference_name
			}else{
				if(data[i].reference_doctype == "Vital Signs"){
						time_line_heading +=  "Signos Vitales" + " - "+ data[i].reference_name
					}else{
						time_line_heading += data[i].reference_doctype + " - "+ data[i].reference_name;
				}
			}
			
			details += `<li data-toggle='pill' class='patient_doc_menu'
			data-doctype='${data[i].reference_doctype}' data-docname='${data[i].reference_name}'>
			<div class='col-sm-12 d-flex border-bottom py-3' style="margin-top: 20px;">`;
			if (data[i].imgsrc){
				details += `<span class='mr-3'>
					<img class='avtar' src='${data[i].imgsrc}' width='32' height='32'>
					</img>
			</span>`;
			}else{
				details += `<span class='mr-3 avatar avatar-small' style='width:32px; height:32px; float:left;'><div align='center' class='standard-image'
					style='background-color: #fafbfc;'>${data[i].practitioner ? data[i].practitioner.charAt(0) : "U"}</div></span>`;
			}
			details += `<div class='d-flex flex-column width-full'>
					<div style="padding-bottom: 20px;">
						`+time_line_heading+` Realizado:
							<span>
								${data[i].date_sep}
							</span>
					</div>
					<div class='Box p-3 mt-2 card' style="padding: 15px; margin-bottom: 30px;">
						<span class='${data[i].reference_name} document-id'>${label}
							<div align='center'>
								<a class='btn octicon octicon-chevron-down btn-default btn-xs btn-more'
									data-doctype='${data[i].reference_doctype}' data-docname='${data[i].reference_name}' onclick="get_more(this)">
								</a>
							</div>
						</span>
						<span class='document-html' hidden  data-fetched="0">
						</span>
					</div>
				</div>
			</div>
			</li>`;
		}
	}
	details += "</ul>";
	$(me).append(details);
	//me.start += data.length;
	if(data.length===20){
		$(".btn-get-records").show();
	}else{
		$(".btn-get-records").hide();
		$(me).append("<div class='text-muted' align='center'><br><br>No hay más registros..<br><br></div>");
	}
};


var show_patient_vital_charts = function(patient, me, btn_show_id, pts, title) {
	frappe.call({
		method: "erpnext.healthcare.utils.get_patient_vitals",
		args:{
			patient: patient
		},
		callback: function(r) {
			if (r.message){
				var show_chart_btns_html = "<div style='padding-top:5px;'><a class='btn btn-default btn-xs btn-show-chart' \
				data-show-chart-id='bp' data-pts='mmHg' data-title='Blood Pressure'>Presion Sanguínea</a>\
				<a class='btn btn-default btn-xs btn-show-chart' data-show-chart-id='pulse_rate' \
				data-pts='per Minutes' data-title='Respiratory/Pulse Rate'>Frecuencia Cardíaca / Pulso</a>\
				<a class='btn btn-default btn-xs btn-show-chart' data-show-chart-id='temperature' \
				data-pts='°C or °F' data-title='Temperature'>Temperatura</a>\
				<a class='btn btn-default btn-xs btn-show-chart' data-show-chart-id='bmi' \
				data-pts='' data-title='BMI'>BMI</a></div>";
				me.page.main.find(".show_chart_btns").html(show_chart_btns_html);
				var data = r.message;
				let labels = [], datasets = [];
				let bp_systolic = [], bp_diastolic = [], temperature = [];
				let pulse = [], respiratory_rate = [], bmi = [], height = [], weight = [];
				for(var i=0; i<data.length; i++){
					labels.push(data[i].signs_date+"||"+data[i].signs_time);
					if(btn_show_id=="bp"){
						bp_systolic.push(data[i].bp_systolic);
						bp_diastolic.push(data[i].bp_diastolic);
					}
					if(btn_show_id=="temperature"){
						temperature.push(data[i].temperature);
					}
					if(btn_show_id=="pulse_rate"){
						pulse.push(data[i].pulse);
						respiratory_rate.push(data[i].respiratory_rate);
					}
					if(btn_show_id=="bmi"){
						bmi.push(data[i].bmi);
						height.push(data[i].height);
						weight.push(data[i].weight);
					}
				}
				if(btn_show_id=="temperature"){
					datasets.push({name: "Temperature", values: temperature, chartType:'line'});
				}
				if(btn_show_id=="bmi"){
					datasets.push({name: "BMI", values: bmi, chartType:'line'});
					datasets.push({name: "Height", values: height, chartType:'line'});
					datasets.push({name: "Weight", values: weight, chartType:'line'});
				}
				if(btn_show_id=="bp"){
					datasets.push({name: "BP Systolic", values: bp_systolic, chartType:'line'});
					datasets.push({name: "BP Diastolic", values: bp_diastolic, chartType:'line'});
				}
				if(btn_show_id=="pulse_rate"){
					datasets.push({name: "Heart Rate / Pulse", values: pulse, chartType:'line'});
					datasets.push({name: "Respiratory Rate", values: respiratory_rate, chartType:'line'});
				}
				new frappe.Chart( ".patient_vital_charts", {
					data: {
						labels: labels,
						datasets: datasets
					},

					title: title,
					type: 'axis-mixed', // 'axis-mixed', 'bar', 'line', 'pie', 'percentage'
					height: 200,
					colors: ['purple', '#ffa3ef', 'light-blue'],

					tooltipOptions: {
						formatTooltipX: d => (d + '').toUpperCase(),
						formatTooltipY: d => d + ' ' + pts,
					}
				});
			}else{
				me.page.main.find(".patient_vital_charts").html("");
				me.page.main.find(".show_chart_btns").html("");
			}
		}
	});
};


var get_more = function(e) {
	var	doctype = $(e).attr("data-doctype"), docname = $(e).attr("data-docname");
	if($("."+docname).parent().find('.document-html').attr('data-fetched') == "1"){
		$("."+docname).hide();
		$("."+docname).parent().find('.document-html').show();
	}else{
		if(doctype && docname){
			let exclude = ["patient", "patient_name", 'patient_sex', "encounter_date"];
			frappe.call({
				method: "erpnext.healthcare.utils.render_doc_as_html",
				args:{
					doctype: doctype,
					docname: docname,
					exclude_fields: exclude
				},
				callback: function(r) {
					if (r.message){
						$("."+docname).hide();
						$("."+docname).parent().find('.document-html').html(r.message.html+"\
						<div align='center'><a class='btn octicon octicon-chevron-up btn-default btn-xs\
						btn-less' onclick=\"get_less(this)\" data-doctype='"+doctype+"' data-docname='"+docname+"'></a></div>");
						$("."+docname).parent().find('.document-html').show();
						$("."+docname).parent().find('.document-html').attr('data-fetched', "1");
					}
				},
				freeze: true
			});
		}
	}
}

var get_less = function(e){
	var docname = $(e).attr("data-docname");
	$("."+docname).parent().find('.document-id').show();
	$("."+docname).parent().find('.document-html').hide();
}
function enviarreceta(){
	frappe.db.set_value('Patient Encounter', localStorage.getItem("ultimo_encuentro"), 'email', frappe.utils.get_random(10))
    .then(r => {
        let doc = r.message;
        frappe.msgprint("La receta medica se ha enviado al paciente exitosamente")
    })

}