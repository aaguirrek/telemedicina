ImgCache.options.debug = true;
ImgCache.options.chromeQuota = 50*1024*1024;
var DateTime = luxon.DateTime;
var Interval = luxon.Interval;
luxon.Settings.defaultOuputCalendar = 'spanish';
ImgCache.init(function () {
    
}, function () {
});
var page;
var telemedicina = {};
telemedicina.Form = {};
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
		$.get("https://app.hisalud.com/api/bing",function(response){
      $(".cabecera-medico").css({"background": "url("+response.url+")",
			"background-size": "cover",
			"background-position-y": "center"});
      ImgCache.cacheBackground(target, function () {
        ImgCache.useCachedBackground(target, function () {
        }, function(){
        })
      });
      
			
		});
		var doctype = telemedicina.DocType.vital_sings();
		telemedicina.fieldgroup.make_fieldgroup(page.wrapper.find("#Vital-form"), doctype.fields );
    telemedicina.DocType.patient_encounter();
    
		
	});
}

telemedicina.DocType = {
    vital_sings: function(){
        let el = null;
        frappe.call({
            method: "frappe.client.get",
            args: {
                  doctype:"DocType",
                  name:"Vital Signs"
            },
            async: false,
            callback: function(r) {
                el = r.message;
            } 
        });
        return el;
    },
	labs: function(){
        let el = null;
        frappe.call({
            method: "frappe.client.get",
            args: {
                  doctype:"DocType",
                  name:"Lab Test"
            },
            async: false,
            callback: function(r) {
                el = r.message;
            } 
        });
        return el;
    },
	patient_encounter: function(){
    $("#medicacion").collapse();
    var parent = $('.form_patient_info');
    telemedicina.Form.patient_encounter = {};
    telemedicina.Form.patient_encounter.patient = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Paciente',
          fieldname: 'patient',
          fieldtype: 'Link',
          options: 'Patient',
          change(){
              frappe.db.get_value('Patient', telemedicina.Form.patient_encounter.patient.get_value(), ['patient_name','dob','sex'])
              .then(r => {
                  console.log(r);
                  var a = DateTime.fromISO(r.message.dob);
                  var dif = a.until((DateTime.local()));
                  var diff = dif.toDuration(['years', 'months', 'days']).toObject();
                  diff.label ="";
                  if (diff.years == 1){
                    diff.label += "1 Año ";
                  }else{
                   if (diff.years > 1){ 
                     diff.label += diff.years+" Años ";
                   }
                  }
                  if (diff.months == 1){
                    diff.label = "1 mes ";
                  }else{
                    if (diff.months > 1){
                      diff.label += diff.months+" meses ";
                    }
                    
                  }
                  diff.days = Math.floor(diff.days);
                  if (diff.days == 1){
                    diff.label = "1 día ";
                  }else{
                   if (diff.days > 1){
                      diff.label += diff.days+" días ";
                    } 
                  }
                  
                  telemedicina.Form.patient_encounter.patient_name.set_value(r.message.patient_name);
                  telemedicina.Form.patient_encounter.patient_age.set_value( diff.label );
                  telemedicina.Form.patient_encounter.patient_sex.set_value( r.message.sex );
              })
          }
      },
      render_input: true
    });
    telemedicina.Form.patient_encounter.patient_name = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Nombre del Paciente',
          fieldname: 'patient_name',
          fieldtype: 'Read Only',
          fetch_from: 'patient.patient_name'
      },
      render_input: true
    });
    telemedicina.Form.patient_encounter.patient_age = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Edad del paciente',
          fieldname: 'patient_age',
          fieldtype: 'Read Only',
      },
      render_input: true
    });
    telemedicina.Form.patient_encounter.patient_sex = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Genero del paciente',
          fieldname: 'patient_sex',
          fieldtype: 'Read Only',
      },
      render_input: true
    });
    parent = $('.form_practtioner_info');
    telemedicina.Form.patient_encounter.practitioner = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Profesional de la Salud',
          fieldname: 'practitioner',
          fieldtype: 'Link',
          options: 'Healthcare Practitioner',
          change(){}
      },
      render_input: true
    });
    telemedicina.Form.patient_encounter.visit_department = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Especialidad',
          fieldname: 'visit_department',
          fieldtype: 'Link',
          options: 'Medical Department',
          change(){}
      },
      render_input: true
    });
    telemedicina.Form.patient_encounter.encounter_date = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Fecha de la cita',
          fieldname: 'encounter_date',
          fieldtype: 'Date',
          change(){}
      },
      render_input: true
    });
    telemedicina.Form.patient_encounter.encounter_time = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Hora de la cita',
          fieldname: 'encounter_time',
          fieldtype: 'Time',
          change(){}
      },
      render_input: true
    });
    parent = $('.form_sintomas');
    telemedicina.Form.patient_encounter.symptoms_select = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Selección de síntomas',
          fieldname: 'symptoms_select',
          fieldtype: 'Link',
          options:"Complaint",
          change(){}
      },
      render_input: true
    });
    telemedicina.Form.patient_encounter.symptoms = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Lista de síntomas',
          fieldname: 'symptoms',
          fieldtype: 'Text',
          read_only:1,
          change(){}
      },
      render_input: true
    });
    parent = $('.form_diagnostico');
    telemedicina.Form.patient_encounter.diagnosis_select = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Selección de diagnóstico',
          fieldname: 'diagnosis_select',
          fieldtype: 'Link',
          options:"Diagnosis",
          change(){}
      },
      render_input: true
    });
    telemedicina.Form.patient_encounter.diagnosis = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Lista de diagnóstico',
          fieldname: 'diagnosis',
          fieldtype: 'Text',
          read_only:1,
          change(){}
      },
      render_input: true
    });
    parent = $('.medicamentos1');
    telemedicina.Form.patient_encounter.drug_code = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Nombre del medicamento',
          fieldname: 'drug_code',
          fieldtype: 'Link',
          options: 'Item',
          filters:{'item_group': 'Droga'},
          change(){}
      },
      render_input: true
    });
    telemedicina.Form.patient_encounter.dosage = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Dosificación',
          fieldname: 'dosage',
          fieldtype: 'Link',
          options: 'Prescription Dosage',
          change(){}
      },
      render_input: true
    });
    telemedicina.Form.patient_encounter.dosage_form = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Forma de dosificación',
          fieldname: 'dosage_form',
          fieldtype: 'Link',
          options: 'Dosage Form',
          change(){}
      },
      render_input: true
    });
    parent = $('.medicamentos2');
    telemedicina.Form.patient_encounter.drug_name = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'fuerza de la dosis',
          fieldname: 'drug_name',
          fieldtype: 'Data',
          change(){}
      },
      render_input: true
    });
    telemedicina.Form.patient_encounter.period = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Periodo',
          fieldname: 'period',
          fieldtype: 'Link',
          options: 'Prescription Duration',
          change(){}
      },
      render_input: true
    });
    telemedicina.Form.patient_encounter.comment = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Comentario',
          fieldname: 'comment',
          fieldtype: 'Text',
          change(){}
      },
      render_input: true
    });
    
    
	}
}
telemedicina.fieldgroup = {
		make_fieldgroup: function (parent, ddf_list) {
		
		let fg = new frappe.ui.FieldGroup({
			"fields": ddf_list,
			"parent": parent
		});
		fg.make();

/*		
		fg.set_df_property("theme","change",Pantallas.Theme.Change)
		fg.set_df_property("multimedia","change",Pantallas.UI.Change.Multimedia)*/
		//frm = fg;
		//frm.set_value("theme","PATE-2019-06-00001");
		/*$('#page-pantalla-publicidad [data-fieldname]').hide();
		$('#page-pantalla-publicidad [data-fieldname="theme"]').show();*/
	}
}
function initCalendar(){
	  var calendarEl = document.getElementById('calendario');
        var calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: 'dayGridMonth'
        });
        calendar.render();
      
}
var finalizarCita = function(){
	$('#pageprincipal').show();
	$('#pageprincipal2').show();
	$("#bigbluebutton").fadeOut("slow");
}
var iniciarCita = function(){
	$("#bigbluebutton").fadeIn("slow").promise().done(function(){
		show_patient_info("Whiny Guevara Merma","cita-body");
		get_documents("Whiny Guevara Merma",".registros-cita")
		//$("#cita-tabss").slimscroll({height:"auto"});
		$('#pageprincipal').hide();
		$('#pageprincipal2').hide();
	});
	
	

}

var show_patient_info = function(patient, me){
	frappe.call({
		"method": "erpnext.healthcare.doctype.patient.patient.get_patient_detail",
		args: {
			patient: patient
		},
		callback: function (r) {
			var data = r.message;
			var details = "";
			if(data.image){
				$("#patient-image").attr("src",data.image);
				$("#patient-bg").attr("src",data.image);
			}
			$("#patient-name").html(data.patient_name);
			if(data.sex == "Female"){data.sex = "Femenino"}
			if(data.sex == "Male"){data.sex = "Masculino"}
			if(data.sex == "Other"){data.sex = "Otro"}
			$("#patient-subtitle").html(`${data.sex} - ${data.email} - ${data.mobile} <br> ${data.dob} `);
			if(data.occupation) details += `<div class="row"><div class="col-xs-4"><b>Ocupación:</b></div><div class="col-xs-8">${data.occupation}</div></div>`;
			if(data.blood_group) details += `<div class="row"><div class="col-xs-4"><b>Tipo de sangre: </b></div><div class="col-xs-8">${data.blood_group}</div></div>`;
			if(data.allergies) details +=  `<div class="row"><div class="col-xs-4"><b>Alergias: </b></div><div class="col-xs-8">${data.allergies.replace("\n", "<br>")}</div></div>`;
			if(data.medication) details +=  `<div class="row"><div class="col-xs-4"><b>Medicacion: </b></div><div class="col-xs-8">${data.medication.replace("\n", "<br>")}</div></div>`;
			if(data.alcohol_current_use) details +=  `<div class="row"><div class="col-xs-4"><b>Uso de alcohol: </b></div><div class="col-xs-8">${data.alcohol_current_use}</div></div>`;
			if(data.alcohol_past_use) details +=  `<div class="row"><div class="col-xs-4"><b>Uso pasado de alcohol: </b></div><div class="col-xs-8">${data.alcohol_past_use}</div></div>`;
			if(data.tobacco_current_use) details +=  `<div class="row"><div class="col-xs-4"><b>Uso de tabaco: </b></div><div class="col-xs-8">${data.tobacco_current_use}</div></div>`;
			if(data.tobacco_past_use) details +=  `<div class="row"><div class="col-xs-4"><b>Uso de tabaco en el pasado: </b></div><div class="col-xs-8">${data.tobacco_past_use}</div></div>`;
			if(data.medical_history) details +=  `<div class="row"><div class="col-xs-4"><b>Historia médica: </b></div><div class="col-xs-8">${data.medical_history.replace("\n", "<br>")}</div></div>`;
			if(data.surgical_history) details +=  `<div class="row"><div class="col-xs-4"><b>Historia Quirúrgica: </b></div><div class="col-xs-8">${data.surgical_history.replace("\n", "<br>")}</div></div>`;
			if(data.surrounding_factors) details +=  `<div class="row"><div class="col-xs-4"><b>Factores de riesgo laborales: </b></div><div class="col-xs-8">${data.surrounding_factors.replace("\n", "<br>")}</div></div>`;
			if(data.other_risk_factors) details += `<div class="row"><div class="col-xs-4"><b>Otros factores de riego: </b></div><div class="col-xs-8">${data.other_risk_factors.replace("\n", "<br>")}</div></div>`;
			if(data.patient_details) details += `<div class="row"><div class="col-xs-4"><b>Más información: </b></div><div class="col-xs-8"><textarea id="${me}moreinfo" class="form-control textarea-html" disabled>${data.patient_details}</textarea></div></div>`;

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