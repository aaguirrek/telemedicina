var drug_count=0;
function agregar_medicamento(){
  
  let drugs={};
  drugs.drug_code = telemedicina.Form.patient_encounter.drug_code.get_value();
  drugs.drug_name = telemedicina.Form.patient_encounter.drug_name.get_value();
  drugs.dosage = telemedicina.Form.patient_encounter.dosage.get_value();
  drugs.period = telemedicina.Form.patient_encounter.period.get_value();
  drugs.dosage_form = telemedicina.Form.patient_encounter.dosage_form.get_value();
  drugs.comment = telemedicina.Form.patient_encounter.comment.get_value();
  telemedicina.tables.drug_prescription.push(drugs);
  telemedicina.doc.patient_encounter.drug_prescription = telemedicina.tables.drug_prescription;
  $("#drug_prescription").append(`<tr id="drug_count_${drug_count}">
    <td><a class="btn octicon octicon-trashcan btn-danger btn-xs btn-more" onclick="eliminarDrg('drug_count_${drug_count}','${drug_count}')"></a></td>
    <td>${ drugs.drug_code }</td>
    <td>${ drugs.drug_name }</td>
    <td>${ drugs.dosage }</td>
    <td>${ drugs.period }</td>
    <td><button class="btn btn-primary" type="button">Detalles</button></td>
  </tr>`);
  drug_count++;
  telemedicina.DocType.insert_patient_encounter();
}
function eliminarDrg(a,b){
  
  telemedicina.tables.drug_prescription.splice(b, 1);
  drug_count--;
  $("#"+a).remove();
  telemedicina.DocType.insert_patient_encounter();
}
function selecthora(e,day,inicio,fin){
  var index =0;
  var bandera=1;
  if($(e).hasClass("selected")){
     $(e).removeClass("selected");
    bandera=0;
  }else{
     $(e).addClass("selected");
    bandera=1;
  }
  if(bandera==1){
    horario_dias.push({ 
        day: day,
        from_time: inicio,
        to_time: fin
    });
  }else{
    horario_dias.forEach(element => {
      if(element.day == day && element.from_time == inicio){
        horario_dias.splice((element.idx - 1), 1);
      }
    });
  }
  frappe.db.set_value('Practitioner Schedule', 'horario '+telemedicina.user.name, {
    time_slots:horario_dias
  }).then(r => {
      let doc = r.message;
      console.log(doc);
  })
}
function cambiarmenu(e){
  $(".vpanel").hide();
  $(".col-xs-2.menu").removeClass("active");
  var target = $(e).data("ref");
  $(".vpanel."+target).show();
  $(e).addClass("active");
}