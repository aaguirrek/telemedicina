
var DateTime = luxon.DateTime;
var Interval = luxon.Interval;
var intro ="no";
if(localStorage.getItem("intro")){
  intro = localStorage.getItem("intro");
}else{
  intro = "no";
  localStorage.setItem("intro","no");
}
luxon.Settings.defaultOuputCalendar = 'spanish';
var Ncita="";
var open_patient = (e,i,b=true, num_cita) => {
  if(b){
    $(".iniciar-conferencia").show();
    $(".enviar-receta").hide();
  }else{
    $(".iniciar-conferencia").hide();
    $(".enviar-receta").show();
      frappe.db.get_list('Patient Encounter', {
        fields: ['name'],
        filters: {
            patient: localStorage.getItem("patient-name"),
            practitioner: telemedicina.data.medico.dni
        },
    }).then(records => {
        localStorage.setItem("ultimo_encuentro",records[0].name);
    })
   }
  show_patient_info(e,"paciente-body");
  get_documents(e,".registros-paciente");
  show_patient_info(e,"cita-body");
  get_documents(e,".registros-cita");
  
  Ncita = num_cita;
  var dat = DateTime.fromISO(telemedicina.data.citas[i].appointment_datetime.replace(" ","T"));
  $("#citaprogramada").html( `La cita esta programada ${dat.toRelative()}`);
  $("#bag-especialidad").html(telemedicina.data.citas[i].department);
  
  $(".seleccionado1").show();
  $(".noseleccionados").hide();
  if(window.innerWidth < 992){
    $("#sellascitas").hide()
  }
}
function volverLisadoCitas(){
  if(window.innerWidth < 992){
      $("#sellascitas").show()
      $(".seleccionado1").hide();
    }
  }