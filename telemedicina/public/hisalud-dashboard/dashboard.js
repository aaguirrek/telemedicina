var telemedicina = {};
telemedicina.Form = {};
telemedicina.doc = {};
telemedicina.doc.patient_encounter = {};
telemedicina.Form.signs = {};
telemedicina.doc.signs = {};
telemedicina.Form.addOther = {};

telemedicina.DocType = {
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
    telemedicina.doc.patient_encounter.doctype = "Patient Encounter";
    telemedicina.Form.patient_encounter.appointment = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Cita',
          fieldname: 'appointment',
          fieldtype: 'Link',
          options: 'Patient Appointment',
          read_only:1,
          hidden:1,
          change(){
            telemedicina.doc.patient_encounter.appointment = telemedicina.Form.patient_encounter.appointment.get_value();
          }
          
      },
      render_input: true
    });
    telemedicina.Form.patient_encounter.patient = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Paciente',
          fieldname: 'patient',
          fieldtype: 'Link',
          read_only:1,
          hidden:1,
          options: 'Patient',
          change(){
              telemedicina.doc.patient_encounter.patient = telemedicina.Form.patient_encounter.patient.get_value();
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
          fetch_from: 'patient.patient_name',
          change(){
            telemedicina.doc.patient_encounter.patient_name = telemedicina.Form.patient_encounter.patient_name.get_value();
          }
      },
      render_input: true
    });
    telemedicina.Form.patient_encounter.patient_age = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Edad del paciente',
          fieldname: 'patient_age',
          fieldtype: 'Read Only',
          change(){
            telemedicina.doc.patient_encounter.patient_age = telemedicina.Form.patient_encounter.patient_age.get_value();
          }
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
          read_only:1,
          hidden:1,
          change(){
            telemedicina.doc.patient_encounter.practitioner = telemedicina.Form.patient_encounter.practitioner.get_value();
          }
      },
      render_input: true
    });
    telemedicina.Form.patient_encounter.visit_department = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Cita para la especialidad',
          fieldname: 'visit_department',
          fieldtype: 'Link',
          options: 'Medical Department',
          read_only:1,
          change(){
            telemedicina.doc.patient_encounter.visit_department = telemedicina.Form.patient_encounter.visit_department.get_value();
          }
      },
      render_input: true
    });
    telemedicina.Form.patient_encounter.patient_sex = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Genero del paciente',
          fieldname: 'patient_sex',
          fieldtype: 'Read Only',
          change(){
            telemedicina.doc.patient_encounter.patient_sex = telemedicina.Form.patient_encounter.patient_sex.get_value();
            
          }
      },
      render_input: true
    });
    telemedicina.Form.patient_encounter.encounter_date = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Fecha de la cita',
          fieldname: 'encounter_date',
          fieldtype: 'Date',
          read_only:1,
          hidden:1,
          change(){
            telemedicina.doc.patient_encounter.encounter_date = telemedicina.Form.patient_encounter.encounter_date.get_value();
            
          }
      },
      render_input: true
    });
    telemedicina.Form.patient_encounter.encounter_time = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Hora de la cita',
          fieldname: 'encounter_time',
          fieldtype: 'Time',
          read_only:1,
          hidden:1,
          change(){
            telemedicina.doc.patient_encounter.encounter_time = telemedicina.Form.patient_encounter.encounter_time.get_value();
            
          }
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
          change(){
            if(telemedicina.Form.patient_encounter.symptoms_select.get_value() == ""){
              return;
            }
            let val = telemedicina.Form.patient_encounter.symptoms_select.get_value();
            let pass = "";
            let text="";
            
            if(telemedicina.Form.patient_encounter.symptoms.get_value()!== undefined){
              pass = telemedicina.Form.patient_encounter.symptoms.get_value();
              text = val+"\n"+pass;
            }else{
              text = val;
            }
            telemedicina.Form.patient_encounter.symptoms.set_value(text);
            telemedicina.Form.patient_encounter.symptoms_select.set_value("")
          }
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
          change(){
            telemedicina.doc.patient_encounter.symptoms = telemedicina.Form.patient_encounter.symptoms.get_value();
            telemedicina.DocType.insert_patient_encounter();
          }
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
          change(){
            if(telemedicina.Form.patient_encounter.diagnosis_select.get_value() == ""){
              return;
            }
            let val = telemedicina.Form.patient_encounter.diagnosis_select.get_value();
            let pass = "";
            let text="";
            if(telemedicina.Form.patient_encounter.diagnosis.get_value()!== undefined){
              pass = telemedicina.Form.patient_encounter.diagnosis.get_value();
              text = val+"\n"+pass;
            }else{
              text = val;
            }
            
            telemedicina.Form.patient_encounter.diagnosis.set_value(text);
            telemedicina.Form.patient_encounter.diagnosis_select.set_value("")
          
          }
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
          change(){
            telemedicina.doc.patient_encounter.diagnosis = telemedicina.Form.patient_encounter.diagnosis.get_value();
            telemedicina.DocType.insert_patient_encounter();
          }
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
          options: 'Medicamentos',
          change(){
            frappe.db.get_value("Medicamentos",telemedicina.Form.patient_encounter.drug_code.get_value(),"presentacion",function(e){
              telemedicina.Form.patient_encounter.drug_name.set_value(e.presentacion);
            });
          }
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
    parent = $('.medicamentos2');
    telemedicina.Form.patient_encounter.drug_name = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Presentacion del producto',
          fieldname: 'drug_name',
          fieldtype: 'Data',
          fetch_from:"drug_code.presentacion",
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
    
    parent = $('.laboratorio1');
    telemedicina.Form.patient_encounter.nombre_de_analisis = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Nombre del examen',
          fieldname: 'nombre_de_analisis',
          fieldtype: 'Data',
          change(){}
      },
      render_input: true
    });
    parent = $('.laboratorio2');
    telemedicina.Form.patient_encounter.descripcion_analisis = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Descripción',
          fieldname: 'descripcion_analisis',
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
    return fg;
	}
}
telemedicina.DocType.addOther = function(){
  var parent = $("#other-form");
  telemedicina.Form.addOther = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Nombre del medico a invitar',
          fieldname: 'medico',
          fieldtype: 'Data',
          change(){

          }
      },
      render_input: true
    });
};