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
function selecthora(e,dia){
  var index =0;
  var bandera=1;
  if($(e).hasClass("selected")){
     $(e).removeClass("selected");
    bandera=0;
  }else{
     $(e).addClass("selected");
    bandera=1;
  }
  
  switch(dia){
    case 1:{
      if(bandera==1){
        horario_dias.lunes.push( $(e).text() )
      }else{
        index = horario_dias.lunes.indexOf($(e).text());
        if (index > -1) {
          horario_dias.lunes.splice(index, 1);
        }
      }
      break;
    }
    case 2:{
      if(bandera==1){
        horario_dias.martes.push( $(e).text() )
      }else{
        index = horario_dias.martes.indexOf($(e).text());
        if (index > -1) {
          horario_dias.martes.splice(index, 1);
        }
      }
      break;
    }
    case 3:{
      if(bandera==1){
        horario_dias.miercoles.push( $(e).text() )
      }else{
        index = horario_dias.miercoles.indexOf($(e).text());
        if (index > -1) {
          horario_dias.miercoles.splice(index, 1);
        }
      }
      break;
    }
    case 4:{
      if(bandera==1){
        horario_dias.jueves.push( $(e).text() )
      }else{
        index = horario_dias.jueves.indexOf($(e).text());
        if (index > -1) {
          horario_dias.jueves.splice(index, 1);
        }
      }
      break;
    }
    case 5:{
      if(bandera==1){
        horario_dias.viernes.push( $(e).text() )
      }else{
        index = horario_dias.viernes.indexOf($(e).text());
        if (index > -1) {
          horario_dias.viernes.splice(index, 1);
        }
      }
      break;
    }
    case 6:{
      if(bandera==1){
        horario_dias.sabado.push( $(e).text() )
      }else{
        index = horario_dias.sabado.indexOf($(e).text());
        if (index > -1) {
          horario_dias.sabado.splice(index, 1);
        }
      }
      break;
    }
    case 7:{
      if(bandera==1){
        horario_dias.domingo.push( $(e).text() )
      }else{
        index = horario_dias.domingo.indexOf($(e).text());
        if (index > -1) {
          horario_dias.domingo.splice(index, 1);
        }
      }
      break;
    }
    default: break;
  }
  localStorage.setItem("horario_del_medico",JSON.stringify(horario_dias))
}
function cambiarmenu(e){
  $(".vpanel").hide();
  $(".col-xs-2.menu").removeClass("active");
  var target = $(e).data("ref");
  $(".vpanel."+target).show();
  $(e).addClass("active");
}