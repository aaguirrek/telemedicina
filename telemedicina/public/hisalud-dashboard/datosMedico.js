telemedicina.datosmedico={};
telemedicina.Form.datosmedico={};
telemedicina.doc.datosmedico={};

telemedicina.datosmedico.init = () => {
 
  var form={}
  var doc={}
  var parent = $(".datosbase");
  form.foto = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Foto de perfil',
        fieldname: 'foto',
        fieldtype: 'Attach Image',
        change(){
          doc.foto = form.foto.get_value();
        }
    },
    render_input: true
  });
  form.colegio_profesional = frappe.ui.form.make_control({
      parent: parent,
      df: {
          label: 'Colegio Profesional',
          fieldname: 'colegio_profesional',
          fieldtype: 'Data',
          change(){
            doc.colegio_profesional = form.colegio_profesional.get_value();
          }
      },
      render_input: true
    });
  parent = $(".datosbase2");
  form.firma = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Firma',
        fieldname: 'firma',
        fieldtype: 'Attach Image',
        change(){
          doc.firma = form.firma.get_value();
        }
    },
    render_input: true
  });
  form.numero_de_colegiatura = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Número de colegiatura',
        fieldname: 'numero_de_colegiatura',
        fieldtype: 'Data',
        change(){
          doc.numero_de_colegiatura = form.numero_de_colegiatura.get_value();
        }
    },
    render_input: true
  });
  form.fecha_de_colegiatura = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Fecha de colegiatura',
        fieldname: 'fecha_de_colegiatura',
        fieldtype: 'Date',
        change(){
          doc.fecha_de_colegiatura = form.fecha_de_colegiatura.get_value();
        }
    },
    render_input: true
  });
  form.especialidad = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Especialidad',
        fieldname: 'especialidad',
        fieldtype: 'Link',
        options: 'Medical Department',
        change(){
          doc.especialidad = form.especialidad.get_value();
        }
    },
    render_input: true
  });
  parent = $(".datosespecialidad");
  form.segunda_especialidad = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Segunda Especialidad',
        fieldname: 'segunda_especialidad',
        fieldtype: 'Link',
        options: 'Medical Department',
        change(){
          doc.segunda_especialidad = form.segunda_especialidad.get_value();
        }
    },
    render_input: true
  });
  parent = $(".datosespecialidad2");
  form.tercera_especialidad = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Tercera Especialidad',
        fieldname: 'tercera_especialidad',
        fieldtype: 'Link',
        options: 'Medical Department',
        change(){
          doc.tercera_especialidad = form.tercera_especialidad.get_value();
        }
    },
    render_input: true
  });
  
  /*form.cuarta_especialidad = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Cuarta Especialidad',
        fieldname: 'cuarta_especialidad',
        fieldtype: 'Link',
        options: 'Medical Department',
        change(){
          doc.cuarta_especialidad = form.cuarta_especialidad.get_value();
        }
    },
    render_input: true
  });
  form.quinta_especialidad = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Quinta Especialidad',
        fieldname: 'quinta_especialidad',
        fieldtype: 'Link',
        options: 'Medical Department',
        change(){
          doc.quinta_especialidad = form.quinta_especialidad.get_value();
        }
    },
    render_input: true
  });*/
  parent = $(".datoslabores");
  form.centro_de_labores_1 = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Centro de labores 1',
        fieldname: 'centro_de_labores_1',
        fieldtype: 'Data',
        change(){
          doc.centro_de_labores_1 = form.centro_de_labores_1.get_value();
        }
    },
    render_input: true
  });
  form.centro_de_labores_2 = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Centro de labores 2',
        fieldname: 'centro_de_labores_2',
        fieldtype: 'Data',
        change(){
          doc.centro_de_labores_2 = form.centro_de_labores_2.get_value();
        }
    },
    render_input: true
  });
  parent = $(".datoslabores2");
  form.ubicacion_1 = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Ubicación 1',
        fieldname: 'ubicacion_1',
        fieldtype: 'Data',
        change(){
          doc.ubicacion_1 = form.ubicacion_1.get_value();
        }
    },
    render_input: true
  });
  form.ubicacion_2 = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Ubicación 2',
        fieldname: 'ubicacion_2',
        fieldtype: 'Data',
        change(){
          doc.ubicacion_2 = form.ubicacion_2.get_value();
        }
    },
    render_input: true
  });
  parent = $(".datoscobros");
  form.precio = frappe.ui.form.make_control({
    parent: parent,
    df: {
        label: 'Precio de la consulta virtual',
        fieldname: 'precio',
        fieldtype: 'Currency',
        change(){
          doc.precio = form.precio.get_value();
        }
    },
    render_input: true
  });
  
  telemedicina.Form.datosmedico = form;
  telemedicina.doc.datosmedico  = doc;
  telemedicina.datosmedico.populate();
};
telemedicina.datosmedico.populate = () =>{
  var medico=null;
  frappe.call({
    method:"frappe.client.get",
    args:{
      doctype: 'Ficha de Registro de Medicos',
      name: 'Ficha-'+frappe.user.name,
    },
    callback: function(r) {
      medico = r.message;
      telemedicina.Form.datosmedico.foto.set_value(medico.foto);
      telemedicina.Form.datosmedico.colegio_profesional.set_value(medico.colegio_profesional);
      telemedicina.Form.datosmedico.firma.set_value(medico.firma);
      telemedicina.Form.datosmedico.numero_de_colegiatura.set_value(medico.numero_de_colegiatura);
      telemedicina.Form.datosmedico.fecha_de_colegiatura.set_value(medico.fecha_de_colegiatura);
      telemedicina.Form.datosmedico.especialidad.set_value(medico.especialidad);
      telemedicina.Form.datosmedico.segunda_especialidad.set_value(medico.segunda_especialidad);
      telemedicina.Form.datosmedico.centro_de_labores_1.set_value(medico.centro_de_labores_1);
      telemedicina.Form.datosmedico.centro_de_labores_2.set_value(medico.centro_de_labores_2);
      telemedicina.Form.datosmedico.ubicacion_1.set_value(medico.ubicacion_1);
      telemedicina.Form.datosmedico.precio.set_value(medico.precio);
    }
  })

}
telemedicina.datosmedico.save = () =>{
  frappe.db.set_value('Ficha de Registro de Medicos', 'Ficha-'+frappe.user.name, telemedicina.doc.datosmedico).then(r => {
      frappe.msgprint(
        msg='Sus datos han sido actualizados',
        title='Guardado'
    )
  })
  frappe.call({
    method:"telemedicina.api.edit_medico",
    args:{
      user_id: telemedicina.data.medico.dni,
      campo: telemedicina.doc.datosmedico.especialidad,
      value:telemedicina.doc.datosmedico.precio,
      hospital: telemedicina.doc.datosmedico.centro_de_labores_1,
      image: telemedicina.doc.datosmedico.foto
    },
    callback: function(r) {

    }
  })
}