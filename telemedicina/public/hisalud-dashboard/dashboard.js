var telemedicina = {};
telemedicina.Form = {};
telemedicina.doc = {};
telemedicina.doc.patient_encounter = {};
telemedicina.Form.signs = {};
telemedicina.doc.signs = {};
telemedicina.Form.addOther = {};

telemedicina.DocType = {}
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