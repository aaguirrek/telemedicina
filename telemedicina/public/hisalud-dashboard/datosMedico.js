telemedicina.datosmedico={};
telemedicina.Form.datosmedico={};
telemedicina.doc.datosmedico={};
telemedicina.datosmedico.init = () => {
  var form={}
  var doc={}
  var parent = $(".datosbase");
  form.hospital = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Indique sus centros de labores',
          fieldname: 'hospital',
          fieldtype: 'Data',
          change(){
            doc.hospital = form.hospital.get_value();
          }
      },
      render_input: true
    });
  form.departament = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Especialidad Principal',
          fieldname: 'departament',
          fieldtype: 'Link',
          options:'Medical Department',
          change(){
            doc.departament = form.departament.get_value();
          }
      },
      render_input: true
    });
  parent = $(".datosbase2");
  form.mobile_phone = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Celular',
        fieldname: 'mobile_phone',
        fieldtype: 'Data',
        change(){
          doc.mobile_phone = form.mobile_phone.get_value();
        }
    },
    render_input: true
  });
  form.op_consulting_charge = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Costo por la cita',
        fieldname: 'op_consulting_charge',
        fieldtype: 'Currency',
        change(){
          doc.op_consulting_charge = form.op_consulting_charge.get_value();
        }
    },
    render_input: true
  });
  parent = $(".curriculumVitae");
  form.biografia = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Biografía',
        fieldname: 'biografia',
        fieldtype: 'Text Editor',
        change(){
          doc.biografia = form.biografia.get_value();
        }
    },
    render_input: true
  });
  form.historial_trabajo = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Lugares donde ha trabajado',
        fieldname: 'historial_trabajo',
        fieldtype: 'Text Editor',
        change(){
          doc.historial_trabajo = form.historial_trabajo.get_value();
        }
    },
    render_input: true
  });
  form.estudios = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Estudios',
        fieldname: 'estudios',
        fieldtype: 'Text Editor',
        change(){
          doc.estudios = form.estudios.get_value();
        }
    },
    render_input: true
  });
  form.cursos = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Cursos y Otros',
        fieldname: 'cursos',
        fieldtype: 'Text Editor',
        change(){
          doc.cursos = form.cursos.get_value();
        }
    },
    render_input: true
  });
  telemedicina.Form.datosmedico = form;
  telemedicina.doc.datosmedico  = doc;
  
};
