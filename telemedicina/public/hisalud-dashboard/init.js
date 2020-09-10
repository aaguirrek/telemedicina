/*ImgCache.options.debug = true;
ImgCache.options.chromeQuota = 50*1024*1024;
ImgCache.init(function () {}, function () {});*/
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
var open_patient = (e,i) => {
  show_patient_info(e,"paciente-body");
  get_documents(e,".registros-paciente");
  show_patient_info(e,"cita-body");
  get_documents(e,".registros-cita");
  Ncita = telemedicina.data.citas[i].name;
  telemedicina.Form.patient_encounter.patient.set_value(e);
  telemedicina.Form.patient_encounter.practitioner.set_value( telemedicina.data.medico.name  );
  telemedicina.Form.patient_encounter.appointment.set_value( telemedicina.data.citas[i].name);
  telemedicina.Form.patient_encounter.encounter_date.set_value( telemedicina.data.citas[i].appointment_date);
  telemedicina.Form.patient_encounter.encounter_time.set_value(telemedicina.data.citas[i].appointment_time);
  telemedicina.Form.patient_encounter.visit_department.set_value( telemedicina.data.citas[i].department);
  
  telemedicina.Form.signs.patient.set_value(e);
  telemedicina.Form.signs.appointment.set_value( telemedicina.data.citas[i].name);
  telemedicina.Form.signs.signs_date.set_value( telemedicina.data.citas[i].appointment_date);
  telemedicina.Form.signs.signs_time.set_value(telemedicina.data.citas[i].appointment_time);
  var dat = DateTime.fromISO(telemedicina.data.citas[i].appointment_datetime.replace(" ","T"));
  $("#citaprogramada").html( `La cita esta programada ${dat.toRelative()}`);
  $("#bag-especialidad").html(telemedicina.data.citas[i].department);
  $(".seleccionado1").show();
  $(".noseleccionados").hide();
}