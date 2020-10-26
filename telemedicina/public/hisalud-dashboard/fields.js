var drug_count=0;
var labs_count=0;

//selecthora(this,`Monday`, `09:30:00`,`10:30:00`)
function selecthora(e,day,inicio){
  var index =0;
  var bandera=1;
  var hasdiaso=0;
  var inicio_fin = inicio.split(":")
  if(inicio_fin[1] == '30'){
    inicio_fin[1]="00"
  }else{
    inicio_fin[1]="30"
  }
  if($(e).hasClass("selected")){
     $(e).removeClass("selected");
    bandera=0;
  }else{
     $(e).addClass("selected");
     if($("#ah"+day).hasClass("diaocupado")){}else{
        $("#ah"+day).addClass("diaocupado")
      }
    bandera=1;
  }
  
  if(bandera==1){
    horario_dias.push({ 
        day: day,
        from_time: inicio,
        to_time: inicio_fin[0]+":"+inicio_fin[1]+":"+inicio_fin[2]
    });
    hasdiaso++;
  }else{
    horario_dias.forEach( element => {
      if(element.from_time.length == 7){
        element.from_time = "0"+element.from_time
      }
      if(element.day == day && element.from_time == inicio ){
        horario_dias.splice((element.idx - 1), 1);
        hasdiaso--;
      }else{
        if(element.day == day){
          hasdiaso++;
        }
      }
    });
  }
  frappe.db.set_value('Practitioner Schedule', 'horario '+telemedicina.user.name, {
    time_slots:horario_dias
  }).then(r => {
      let doc = r.message;
  })
  if(hasdiaso<1){
    if($("#ah"+day).hasClass("diaocupado")){
      $("#ah"+day).removeClass("diaocupado")
    }
  }
  
}
function cambiarmenu(e){
  $(".vpanel").hide();
  $(".row.menu > .menu").removeClass("active");
  var target = $(e).data("ref");
  $(".vpanel."+target).show();
  $(e).addClass("active");
  if(target == "datosmedico"){
  }
}
function limpiarhorario(){
  horario_dias=[]
  frappe.db.set_value('Practitioner Schedule', 'horario '+telemedicina.user.name, {
    time_slots:horario_dias
  }).then(r => {
      let doc = r.message
      initHorario()
  })
}
function addhorarioDash(){
  telemedicina.horario={}
  
  telemedicina.horario.lapso = frappe.ui.form.make_control({
    parent: $("#addDiasLapso"),
    df: {
        label: 'Seleccione los días',
        fieldname: 'dias',
        fieldtype: 'MultiSelect',
        options:[
          {value:'Monday', label:__('Lunes')},
          {value:'Tuesday', label:__('Martes')},
          {value:'Wednesday', label:__('Miércoles')},
          {value:'Thursday', label:__('Jueves')},
          {value:'Friday', label:__('Viernes')},
          {value:'Saturday', label:__('Sábado')},
          {value:'Sunday', label:__('Domingo')},
        ], 
        change(){
        }
    },
    render_input: true
  });
  telemedicina.horario.desde = frappe.ui.form.make_control({
    parent: $("#addDesde"),
    df: {
        label: 'Desde',
        fieldname: 'desde',
        fieldtype: 'Select',
        options:[
          {value:"06:00:00",label:"06:00 am"},
          {value:"06:30:00",label:"06:30 am"},
          {value:"07:00:00",label:"07:00 am"},
          {value:"07:30:00",label:"07:30 am"},
          {value:"08:00:00",label:"08:00 am"},
          {value:"08:30:00",label:"08:30 am"},
          {value:"09:00:00",label:"09:00 am"},
          {value:"09:30:00",label:"09:30 am"},
          {value:"10:00:00",label:"10:00 am"},
          {value:"10:30:00",label:"10:30 am"},
          {value:"11:00:00",label:"11:00 am"},
          {value:"11:30:00",label:"11:30 am"},
          {value:"12:00:00",label:"12:00 pm"},
          {value:"12:30:00",label:"12:30 pm"},
          {value:"13:00:00",label:"01:00 pm"},
          {value:"13:30:00",label:"01:30 pm"},
          {value:"14:00:00",label:"02:00 pm"},
          {value:"14:30:00",label:"02:30 pm"},
          {value:"15:00:00",label:"03:00 pm"},
          {value:"15:30:00",label:"03:30 pm"},
          {value:"16:00:00",label:"04:00 pm"},
          {value:"16:30:00",label:"04:30 pm"},
          {value:"17:00:00",label:"05:00 pm"},
          {value:"17:30:00",label:"05:30 pm"},
          {value:"18:00:00",label:"06:00 pm"},
          {value:"18:30:00",label:"06:30 pm"},
          {value:"19:00:00",label:"07:00 pm"},
          {value:"19:30:00",label:"07:30 pm"},
          {value:"20:00:00",label:"08:00 pm"},
          {value:"20:30:00",label:"08:30 pm"},
          {value:"21:00:00",label:"09:00 pm"},
          {value:"21:30:00",label:"09:30 pm"},
          {value:"22:00:00",label:"10:00 pm"},
          {value:"22:30:00",label:"10:30 pm"},
          {value:"23:00:00",label:"11:00 pm"},
        ],
        change(){
        }
    },
    render_input: true
  });
  telemedicina.horario.desde.set_value("06:00:00")
  telemedicina.horario.hasta = frappe.ui.form.make_control({
    parent: $("#addHasta"),
    df: {
        label: 'Hasta',
        fieldname: 'hasta',
        fieldtype: 'Select',
        options:[
          {value:"06:30:00",label:"06:30 am"},
          {value:"07:00:00",label:"07:00 am"},
          {value:"07:30:00",label:"07:30 am"},
          {value:"08:00:00",label:"08:00 am"},
          {value:"08:30:00",label:"08:30 am"},
          {value:"09:00:00",label:"09:00 am"},
          {value:"09:30:00",label:"09:30 am"},
          {value:"10:00:00",label:"10:00 am"},
          {value:"10:30:00",label:"10:30 am"},
          {value:"11:00:00",label:"11:00 am"},
          {value:"11:30:00",label:"11:30 am"},
          {value:"12:00:00",label:"12:00 pm"},
          {value:"12:30:00",label:"12:30 pm"},
          {value:"13:00:00",label:"01:00 pm"},
          {value:"13:30:00",label:"01:30 pm"},
          {value:"14:00:00",label:"02:00 pm"},
          {value:"14:30:00",label:"02:30 pm"},
          {value:"15:00:00",label:"03:00 pm"},
          {value:"15:30:00",label:"03:30 pm"},
          {value:"16:00:00",label:"04:00 pm"},
          {value:"16:30:00",label:"04:30 pm"},
          {value:"17:00:00",label:"05:00 pm"},
          {value:"17:30:00",label:"05:30 pm"},
          {value:"18:00:00",label:"06:00 pm"},
          {value:"18:30:00",label:"06:30 pm"},
          {value:"19:00:00",label:"07:00 pm"},
          {value:"19:30:00",label:"07:30 pm"},
          {value:"20:00:00",label:"08:00 pm"},
          {value:"20:30:00",label:"08:30 pm"},
          {value:"21:00:00",label:"09:00 pm"},
          {value:"21:30:00",label:"09:30 pm"},
          {value:"22:00:00",label:"10:00 pm"},
          {value:"22:30:00",label:"10:30 pm"},
          {value:"23:00:00",label:"11:00 pm"},
          {value:"23:30:00",label:"11:30 pm"},
        ],
        change(){
        }
    },
    render_input: true
  });
  telemedicina.horario.hasta.set_value("23:30:00")
  
  frappe.call({
		method:"frappe.client.get_list",
		args:{ 
			doctype     : 'HorariosTableTem', 
			fields      : "*", 
			filters     : [ ["medico","=", telemedicina.user.name ] ] 
		},
		async:false,
		callback: function(r) {
      $("#ListaHorarios").html("");
      r.message.forEach(element => {
          $("#ListaHorarios").append(
          `<button class="btn btn-danger btn-xs pull-right grid-delete-row">
            <i class="octicon octicon-trashcan" style="padding-bottom: 2px; margin-top: 1px;"></i>
          </button>`+
          (element.name).replace(telemedicina.user.name + "-","")
        );
        
      });
		}
  });
  //{medico}-{dias} desde:{desde} hasta:{hasta}
}
function selecthoraLapso(){
  lapso = telemedicina.horario.lapso.get_value();
  lapso= lapso.split(", ");
  
  for (var key in lapso) {
    day = lapso[key];
    if(day == "" || day === undefined){
      return;
    }  
    
    var minutos = telemedicina.horario.desde.get_value()
    var fmonitos = telemedicina.horario.hasta.get_value()
        minutos = minutos.split(":")
        fmonitos = fmonitos.split(":")

    var inicio = minutos[0] + ":" + minutos[1]+":00";
    var fin = fmonitos[0] + ":" + fmonitos[1]+":00";
    var inicioT = (parseInt(minutos[0]))*100 + parseInt(minutos[1]);
    var finT = (parseInt(fmonitos[0]))*100 + parseInt(fmonitos[1]);
    var id="";
    var mins = parseInt(minutos[1]);

    var hora= parseInt(minutos[0]);
    var finm= minutos[1];
    var finh= minutos[0];

    
    while( inicioT < finT ){
      inicio = finh + ":" + finm+":00";
      id= ""+finh + finm+"00";
      if( mins > 29){
        mins=0;
      }else{
        mins = 30;
      }
      if(  mins == 0 ){
        hora++;
      }
      if(  hora > 23 ){
        hora = 0;
      }
      inicioT = (hora*100)+ mins;
      if(mins<10){
        finm="0"+mins.toString();
      }else{
        finm=""+mins.toString();
      }
      if(hora<10){
        finh="0"+hora.toString();
      }else{
        finh=""+hora.toString();
      }
      fin = finh + ":" + finm+":00";
      
      if( $(`#${day}_${id}`).hasClass("selected") ){
      }else{
        if($("#ah"+day).hasClass("diaocupado")){}else{
          $("#ah"+day).addClass("diaocupado")
        }
        $(`#${day}_${id}`).addClass("selected");
        horario_dias.push({
            day: day,
            from_time: inicio,
            to_time: fin
        });
      }
         
    }
  }
  frappe.db.set_value('Practitioner Schedule', 'horario '+telemedicina.user.name, {
    time_slots:horario_dias
  }).then(r => {
      let doc = r.message;
  })


}

function initHorario(){
  var horario_id ="";
  
  if($("#ahMonday").hasClass("diaocupado")){
    $("#ahMonday").removeClass("diaocupado")
  }
  if($("#ahTuesday").hasClass("diaocupado")){
    $("#ahTuesday").removeClass("diaocupado")
  }
  if($("#ahWednesday").hasClass("diaocupado")){
    $("#ahWednesday").removeClass("diaocupado")
  }
  if($("#ahThursday").hasClass("diaocupado")){
    $("#ahThursday").removeClass("diaocupado")
  }
  if($("#ahFriday").hasClass("diaocupado")){
    $("#ahFriday").removeClass("diaocupado")
  }
  if($("#ahSaturday").hasClass("diaocupado")){
    $("#ahSaturday").removeClass("diaocupado")
  }
  if($("#ahSunday").hasClass("diaocupado")){
    $("#ahSunday").removeClass("diaocupado")
  }
	$("#hMonday").html( frappe.render_template("horario",{"dia":"Monday" } ));
	$("#hTuesday").html( frappe.render_template("horario",{"dia":"Tuesday" } ));
	$("#hWednesday").html( frappe.render_template("horario",{"dia":"Wednesday" } ));
	$("#hThursday").html( frappe.render_template("horario",{"dia":"Thursday" } ));
	$("#hFriday").html( frappe.render_template("horario",{"dia":"Friday" } ));
	$("#hSaturday").html( frappe.render_template("horario",{"dia":"Saturday" } ));
  	$("#hSunday").html( frappe.render_template("horario",{"dia":"Sunday" } )).promise().done(function(){
		frappe.db.get_doc('Practitioner Schedule', 'horario '+telemedicina.user.name).then(doc => {
			doc_horario = doc;
			horario_dias = doc_horario.time_slots;
			horario_dias.forEach(function(value,item){
        if((value.from_time).length ==7 ){
          horario_id = value.day+"_0"+value.from_time.replace(/:/g,"");
        }else{

          horario_id = value.day+"_"+value.from_time.replace(/:/g,"");
        }
        if($("#ah"+value.day).hasClass("diaocupado")){}else{
          $("#ah"+value.day).addClass("diaocupado")
        }
				$("#"+horario_id).addClass("selected");
			})
		});
	});
}