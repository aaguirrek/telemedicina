frappe.listview_settings['Patient Appointment'] = {
	filters: [["practitioner", "=", conferencia.medico ],["status", "=", "Open"]],
  onload:function(listview){
    frappe.call({
          method:"frappe.client.get_list",
          args:{"doctype": 'Healthcare Practitioner',filters:[["user_id","=",frappe.user.name] ] },
          callback: function(r) {
            if(r.message.length > 0){
              conferencia.medico = r.message[0].name;
              cur_list.page.fields_dict.practitioner.set_value(conferencia.medico);
            }
          }
      })
      if(conferencia.medico != ""){
        listview.page.fields_dict.practitioner.$input_area.hide();
      }else{
        listview.page.fields_dict.practitioner.$input_area.show();
      }
  },
  refresh:function(listview){
      if(conferencia.medico != ""){
        listview.page.fields_dict.practitioner.$input_area.hide();
      }else{
        listview.page.fields_dict.practitioner.$input_area.show();
      }
  },
  
};