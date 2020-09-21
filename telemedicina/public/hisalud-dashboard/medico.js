telemedicina.user = {};
telemedicina.user.name=frappe.user.name;
telemedicina.medico= {};
telemedicina.pacientes = {};
telemedicina.tables={};
telemedicina.tables.drug_prescription = [];
telemedicina.data={};

telemedicina.saldos={};
telemedicina.saldos.init=()=>{
  $(".saldo-acumulado").html(0);
  $("#tbod-saldos").html("");
  $("#sinoperaciones").show();
  $("#las20citas").hide();
  $("#tienesacomulado").hide();
  $("#saldosyotros").hide();
  frappe.call({
    method:"frappe.client.get_list",
    args:{
      doctype: 'Saldos y Pagos',
      fields:["*"],
      filters:[[ "medico","=", "Ficha-"+frappe.user.name ],["estado","=","Por Retirar"]] ,
      order_by:"fecha_y_hora desc"
    },
    callback: function(r) {
      if(r.message.length > 0){
        $(".saldo-acumulado").html(r.message[0].monto);
        $("#saldosyotros").show();
        $("#sinoperaciones").hide();
        $("#tienesacomulado").show();
        $("#las20citas").show();
        $(".saldos-acumulado").html("S/. "+r.message[0].monto);
        r.message.forEach(e => {
          $("#tbod-saldos").append(`
          <tr>
            <td>
              ${r.message[0].cita}
            </td>
            <td>
              ${r.message[0].paciente}
            </td>
            <td>
            ${r.message[0].monto}
            </td>
            <td>
            ${r.message[0].fecha_y_hora}
            </td>
            <td>
            ${r.message[0].estado}
            </td>
          </tr>
          `)
        });
      
      }
    }
  })
}

telemedicina.medico.init = () => {
    frappe.call({
        method:"frappe.client.get",
        args:{
          doctype: 'Ficha de Registro de Medicos',
          name: 'Ficha-'+telemedicina.user.name,
        },
      freeze:1,
        callback: function(r) {
          telemedicina.data.medico = r.message;
          localStorage.setItem("medico-name",telemedicina.data.medico.dni);
          $(".medico-full-name").html(telemedicina.data.medico.nombre);
          $(".laespecialidad").html(telemedicina.data.medico.especialidad);
          $(".img-profile").attr('src',telemedicina.data.medico.foto);
          telemedicina.pacientes.init();
        }
    })
    
}
telemedicina.pacientes.init = () => {
  var  dat = DateTime.local();
  var dat2 = dat.minus({minutes:20});
  var txt = dat2.toISODate() +" "+ dat2.toISOTime().split(".")[0];
  telemedicina.data.citas = [];
  frappe.call({
        method:"frappe.client.get_list",
        args:{
          doctype: 'Patient Appointment',
          fields:["*"],
          filters:[[ "practitioner","=", telemedicina.data.medico.name ],["appointment_datetime",">",txt]],
          order_by:"appointment_datetime desc"
        },
      freeze:1, 
        callback: function(r) {
          telemedicina.data.citas = telemedicina.data.citas.concat(r.message);
          if(r.message.length > 0 ){ 
            $(".nocitas").hide(); $(".concitas").show();
            
          }else{
            $("#pacienteslista").append(`
              <div class="card pacientes" style="border-top-color: #999!important;">
                  <div class="card-body">   
                      <div class="person-card">
                          <div class="card-content">
                              <span class="full-name" style="color: #ccc;" >No cuenta con citas</span>
                              <p  style="color: #ccc;" >No cuenta con citas por el momento</p>
                          </div>
                      </div>
                  </div>
              </div>
            `);
          }
          r.message.forEach(function(value, index){
            
            $("#pacienteslista").append(`
              <div class="card pacientes" onclick="open_patient('${value.patient}','${index}');">
                  <div class="card-body">   
                      <div class="person-card">
                          <div class="card-content">
                              <span class="full-name">${value.patient_name}</span>
                              <p>${value.appointment_date} - ${value.appointment_time}</p>
                          </div>
                      </div>
                  </div>
              </div>
            `);
          })
        }
    })
  frappe.call({
        method:"frappe.client.get_list",
        args:{
          doctype: 'Patient Appointment',
          fields:["*"],
          filters:[[ "practitioner","=", telemedicina.data.medico.name ],["appointment_datetime","<",txt]] ,
          order_by:"appointment_datetime desc"
        },
      freeze:1, 
        callback: function(r) {
          telemedicina.data.citas = telemedicina.data.citas.concat(r.message);
          if(r.message.length > 0 ){ 
            $(".nocitas").hide(); $(".concitas").show()
          }else{
            $("#pacienteslistaAnt").append(`
              <div class="card pacientes pacientesAnt" style="border-top-color: #999!important;">
                  <div class="card-body">   
                      <div class="person-card">
                          <div class="card-content">
                              <span class="full-name" style="color: #ccc;" >No cuenta con citas</span>
                              <p style="color: #ccc;" >No cuenta con citas por el momento</p>
                          </div>
                      </div>
                  </div>
              </div>
            `);
          }
          r.message.forEach(function(value, index){
            
            $("#pacienteslistaAnt").append(`
              <div class="card pacientes pacientesAnt" onclick="open_patient('${value.patient}','${index}');">
                  <div class="card-body">   
                      <div class="person-card">
                          <div class="card-content">
                              <span class="full-name">${value.patient_name}</span>
                              <p>${value.appointment_date} - ${value.appointment_time}</p>
                          </div>
                      </div>
                  </div>
              </div>
            `);
          })
        }
    })
    
 }



telemedicina.medico.init();
