telemedicina.frm={};
telemedicina.frm_c={};
telemedicina.frm_c.signs = 0;
telemedicina.frm_c.patient_encounter = 0;

telemedicina.DocType.insert_sign = () => {
  if(telemedicina.frm_c.signs == 0 ){
     frappe.db.insert( telemedicina.doc.signs ).then( doc => {
      telemedicina.doc.signs.name = doc.name;
      telemedicina.frm.signs = doc;
      telemedicina.frm_c.signs = 1;
    });
  }else{
    frappe.db.set_value('Vital Signs', telemedicina.doc.signs.name, telemedicina.doc.signs)
  }
}

telemedicina.DocType.insert_patient_encounter = () => {
  if(telemedicina.frm_c.patient_encounter == 0 ){
    frappe.db.insert( telemedicina.doc.patient_encounter ).then( doc => {
      telemedicina.doc.patient_encounter.name = doc.name;
      
      telemedicina.doc.signs.encounter = doc.name;
      telemedicina.frm.patient_encounter = doc;
      telemedicina.frm_c.patient_encounter = 1;
    });
  }else{
    frappe.db.set_value('Patient Encounter', telemedicina.doc.patient_encounter.name, telemedicina.doc.patient_encounter)
  }
}

telemedicina.DocType.vital_sings = () => {
  var parent = $(".vital1");
  telemedicina.doc.signs.doctype = "Vital Signs";
  telemedicina.Form.signs.appointment = frappe.ui.form.make_control({
  parent: parent,
  df: {
      label: 'Cita',
      fieldname: 'appointment',
      fieldtype: 'Link',
      options: 'Patient Appointment',
      read_only:1,
      hidden:1,
      change(){
        telemedicina.doc.signs.appointment = telemedicina.Form.signs.appointment.get_value();
      }
  },
  render_input: true
  });
  telemedicina.Form.signs.encounter = frappe.ui.form.make_control({
  parent: parent,
  df: {
      label: 'Encuentro con el paciente',
      fieldname: 'encounter',
      fieldtype: 'Link',
      options: 'Patient Appointment',
      read_only:1,
      hidden:1,
      change(){
        telemedicina.doc.signs.encounter = telemedicina.Form.signs.encounter.get_value();
      }

  },
  render_input: true
  });
  telemedicina.Form.signs.patient = frappe.ui.form.make_control({
  parent: parent,
  df: {
      label: 'Paciente',
      fieldname: 'patient',
      fieldtype: 'Link',
      read_only:1,
      hidden:1,
      options: 'Patient',
      change(){
          telemedicina.doc.signs.patient = telemedicina.Form.signs.patient.get_value();
          frappe.db.get_value('Patient', telemedicina.Form.signs.patient.get_value(), 'patient_name')
          .then(r => {
              telemedicina.Form.signs.patient_name.set_value(r.message.patient_name);
          })
      }
  },
  render_input: true
  });
  telemedicina.Form.signs.patient_name = frappe.ui.form.make_control({
  parent: parent,
  df: {
      label: 'Nombre del Paciente',
      fieldname: 'patient_name',
      fieldtype: 'Read Only',
      fetch_from: 'patient.patient_name',
      change(){
        telemedicina.doc.signs.patient_name = telemedicina.Form.signs.patient_name.get_value();
      }
  },
  render_input: true
  });
  telemedicina.Form.signs.signs_date = frappe.ui.form.make_control({
  parent: parent,
  df: {
      label: 'Fecha de la cita',
      fieldname: 'signs_date',
      fieldtype: 'Date',
      read_only:1,
      hidden:1,
      change(){
        telemedicina.doc.signs.signs_date = telemedicina.Form.signs.signs_date.get_value();

      }
  },
  render_input: true
  });
  telemedicina.Form.signs.signs_time = frappe.ui.form.make_control({
  parent: parent,
  df: {
      label: 'Hora de la cita',
      fieldname: 'signs_time',
      fieldtype: 'Time',
      read_only:1,
      hidden:1,
      change(){
        telemedicina.doc.signs.signs_time = telemedicina.Form.signs.signs_time.get_value();

      }
  },
  render_input: true
  });
  telemedicina.Form.signs.temperature = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Temperatura Corporal',
        fieldname: 'temperature',
        fieldtype: 'Data',
        change(){
          telemedicina.doc.signs.temperature = telemedicina.Form.signs.temperature.get_value();
          telemedicina.DocType.insert_sign();            
        }
    },
    render_input: true
  });
  telemedicina.Form.signs.pulse = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Frecuencia Cardiaca/Pulso',
        fieldname: 'pulse',
        fieldtype: 'Data',
        change(){
          telemedicina.doc.signs.pulse = telemedicina.Form.signs.pulse.get_value();
          telemedicina.DocType.insert_sign();
        }
    },
    render_input: true
  });
  telemedicina.Form.signs.respiratory_rate = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Frecuencia Respiratoria',
        fieldname: 'respiratory_rate',
        fieldtype: 'Data',
        change(){
          telemedicina.doc.signs.respiratory_rate = telemedicina.Form.signs.respiratory_rate.get_value();
          telemedicina.DocType.insert_sign();
        }
    },
    render_input: true
  });
  telemedicina.Form.signs.tongue = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Cabidad Oral',
        fieldname: 'tongue',
        fieldtype: 'Select',
        options:[
          {"label":"Saburral","value":"Coated"},
          {"label":"Muy Saburral","value":"Very Coated"},
          {"label":"Normal","value":"Normal"},
          {"label":"Peluda","value":"Furry"},
          {"label":"Cortes","value":"Cuts"},
        ],
        change(){
          telemedicina.doc.signs.tongue = telemedicina.Form.signs.tongue.get_value();
          telemedicina.DocType.insert_sign();
        }
    },
    render_input: true
  });
  telemedicina.Form.signs.abdomen = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Abdomen',
        fieldname: 'abdomen',
        fieldtype: 'Select',
        options:[
          {"label":"Normal","value":"Normal"},
          {"label":"Hinchado","value":"Bloated"},
          {"label":"Completo","value":"Full"},
          {"label":"Fluida","value":"Fluid"},
          {"label":"Estreñido","value":"Constipated"}
        ],
        change(){
          telemedicina.doc.signs.abdomen = telemedicina.Form.signs.abdomen.get_value();
          telemedicina.DocType.insert_sign();   
        }
    },
    render_input: true
  });
  parent = $(".vital2");
  telemedicina.Form.signs.reflexes = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Reflejos',
        fieldname: 'reflexes',
        fieldtype: 'Select',
        options:[
          {"label":"Normal", "value":"Normal"},
          {"value":"Hyper", "label":"Hiper"},
          {"value":"Very Hyper","label":"Muy Hyper"},
          {"value":"One Sided", "label":"Unilateral"}
        ],
        change(){
          telemedicina.doc.signs.reflexes = telemedicina.Form.signs.reflexes.get_value();
          telemedicina.DocType.insert_sign();
        }
    },
    render_input: true
  });
  telemedicina.Form.signs.bp_systolic = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Presión Arterial (sistólica)',
        fieldname: 'bp_systolic',
        fieldtype: 'Data',
        change(){
          if( telemedicina.Form.signs.bp_systolic.get_value() == ""){
            telemedicina.Form.signs.bp.set_value("");
            return;
          }
          telemedicina.doc.signs.bp_systolic = telemedicina.Form.signs.bp_systolic.get_value();
          if( telemedicina.Form.signs.bp_diastolic.get_value() !== undefined ){
            if(telemedicina.Form.signs.bp_diastolic.get_value() != null && telemedicina.Form.signs.bp_diastolic.get_value() != "" ){
                telemedicina.Form.signs.bp.set_value( 
                  telemedicina.Form.signs.bp_systolic.get_value()+
                  "/"+ 
                  telemedicina.Form.signs.bp_diastolic.get_value()+
                  " mmHg" );
            }
          }
        }
    },
    render_input: true
  });
  telemedicina.Form.signs.bp_diastolic = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Presión Arterial (diastólica)',
        fieldname: 'bp_diastolic',
        fieldtype: 'Data',
        change(){
          if( telemedicina.Form.signs.bp_systolic.get_value() == ""){
            telemedicina.Form.signs.bp.set_value("");
            return;
          }
          telemedicina.doc.signs.bp_diastolic = telemedicina.Form.signs.bp_diastolic.get_value();
          if( telemedicina.Form.signs.bp_systolic.get_value() !== undefined ){
            if(telemedicina.Form.signs.bp_systolic.get_value() != null && telemedicina.Form.signs.bp_systolic.get_value() != "" ){
                telemedicina.Form.signs.bp.set_value(
                  telemedicina.Form.signs.bp_systolic.get_value()+
                  "/"+ 
                  telemedicina.Form.signs.bp_diastolic.get_value()+
                  " mmHg" );
            }
          }
        }
    },
    render_input: true
  });
  telemedicina.Form.signs.bp = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Presión Sanguínea',
        fieldname: 'bp',
        fieldtype: 'Data',
        read_only: 1,
        change(){
          telemedicina.doc.signs.bp = telemedicina.Form.signs.bp.get_value();
          telemedicina.DocType.insert_sign();
        }
    },
    render_input: true
  });
  telemedicina.Form.signs.vital_signs_note = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Notas',
        fieldname: 'vital_signs_note',
        fieldtype: 'Text',
        change(){
          telemedicina.doc.signs.vital_signs_note = telemedicina.Form.signs.vital_signs_note.get_value();
          telemedicina.DocType.insert_sign();
        }
    },
    render_input: true
  });
  parent = $(".vital3")
  telemedicina.Form.signs.height = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Altura (en metros)',
        fieldname: 'height',
        fieldtype: 'Data',
        change(){
          telemedicina.doc.signs.height = telemedicina.Form.signs.height.get_value();
          telemedicina.DocType.insert_sign();
          
          
          if( telemedicina.Form.signs.height.get_value() == ""){
            telemedicina.Form.signs.bmi.set_value("");
            return;
          }
          
          if( telemedicina.Form.signs.weight.get_value() !== undefined ){
            if(telemedicina.Form.signs.weight.get_value() != null && telemedicina.Form.signs.weight.get_value() != "" ){
              let weight = parseFloat( telemedicina.Form.signs.weight.get_value() );
              let height = parseFloat( telemedicina.Form.signs.height.get_value() );
              let IMC = (weight)/(height*height);
              telemedicina.Form.signs.bmi.set_value(IMC);
            }
          }
          
        }
    },
    render_input: true
  });
  telemedicina.Form.signs.weight = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Peso (en metros)',
        fieldname: 'weight',
        fieldtype: 'Data',
        change(){
          telemedicina.doc.signs.weight = telemedicina.Form.signs.weight.get_value();
          telemedicina.DocType.insert_sign();
          
          if( telemedicina.Form.signs.height.get_value() == ""){
            telemedicina.Form.signs.bmi.set_value("");
            return;
          }
          
          if( telemedicina.Form.signs.height.get_value() !== undefined ){
            if(telemedicina.Form.signs.height.get_value() != null && telemedicina.Form.signs.height.get_value() != "" ){
              let weight = parseFloat( telemedicina.Form.signs.weight.get_value() );
              let height = parseFloat( telemedicina.Form.signs.height.get_value() );
              let IMC = (weight)/(height*height);
              IMC = IMC.toFixed(2);
              telemedicina.Form.signs.bmi.set_value(IMC);
            }
          }
          
        }
    },
    render_input: true
  });
  telemedicina.Form.signs.bmi = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'IMC',
        fieldname: 'bmi',
        fieldtype: 'Read Only',
        change(){
          telemedicina.doc.signs.bmi = telemedicina.Form.signs.bmi.get_value();
          telemedicina.DocType.insert_sign();
        }
    },
    render_input: true
  });
  parent = $(".vital4")
  telemedicina.Form.signs.nutrition_note = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Notas',
        fieldname: 'nutrition_note',
        fieldtype: 'Text',
        change(){
          telemedicina.doc.signs.nutrition_note = telemedicina.Form.signs.nutrition_note.get_value();
          telemedicina.DocType.insert_sign();
        }
    },
    render_input: true
  });
}