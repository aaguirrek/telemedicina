var drug_count=0;
var labs_count=0;
function agregar_medicamento(){
  
}


function agregar_laboratorio(){
  
}
function eliminarLabs(a,b){
  telemedicina.tables.lab_test_prescription.splice(b, 1);
  //labs_count--;
  $("#"+a).remove();
  telemedicina.DocType.insert_patient_encounter();
}
function eliminarDrg(a,b){
  telemedicina.tables.drug_prescription.splice(b, 1);
  //drug_count--;
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
  if(target == "datosmedico"){
//    setTimeout(reloadheightframe($("iframe")[0]),150)
  }
}