var confere = null;
var cita = null;
var boton = null;
var conferencia = {};
conferencia.returnCode="";
conferencia.internalMeetingID="";
conferencia.parentMeetingID="";
conferencia.attendeePW="";
conferencia.moderatorPW="";
conferencia.createTime="";
conferencia.meetingID="";
conferencia.duration="";
conferencia.hasUserJoined = "";
conferencia.medico="";
conferencia.secret="OE4Od5DIpgdJpD9CPOTqtu3IdHTjBNUvDjvWWtICo";
conferencia.crear =function() {
    var d = new Date();
    var n = d.getTime();

    frappe.call({
		method:"frappe.client.get_list",
		args:{"doctype": 'Video Conferencia', fields:"*",filters:[
            ["usuario_medico","=",frappe.user.name],
            ["paciente","=",confere.get_value()], 
            ["fecha","=", d.getUTCDate ],
            ["hora","=",cita.get_value() ]  
        ] },
		async:false,
        callback: function(r) {
            console.log(r);
            if(r.message.length > 0){
                doc = r.message[0];
            }
        }
    });

    if(doc == null){
        return;
    }

    var url = 'https://meet.hisalud.com/bigbluebutton/api/create?';
    var txt = 'name='+frappe.user.name;
        txt += '&allowStartStopRecording=false';
        txt += '&attendeePW='+frappe.utils.get_random(10);
        txt += '&autoStartRecording=true';
        txt += '&record=true';
        txt += '&meetingID='+"room-"+n;
        //txt += '&duration=30';
        txt += "guestPolicy=ASK_MODERATOR";
        txt += '&moderatorPW='+frappe.utils.get_random(12);
        txt += '&checksum='+sha1('create'+txt+conferencia.secret);
    
    frappe.call({
		method:"telemedicina.api.create",
		args:{"url": url+txt},
		async: true,
		callback: function(r) {
            console.log(r.message)
            var xml, parser;
            parser = new DOMParser();

            xml = parser.parseFromString(r.message,"text/xml"); 
            conferencia.returnCode = $(xml).find("returncode").text();
            console.log(conferencia.returnCode)
            if( conferencia.returnCode == "SUCCESS"){
                conferencia.createTime = $(xml).find("createTime").text();
                conferencia.internalMeetingID = $(xml).find("internalMeetingID").text();
                conferencia.meetingID = $(xml).find("meetingID").text();
                conferencia.attendeePW = $(xml).find('attendeePW').text();
                conferencia.moderatorPW = $(xml).find('moderatorPW').text();
                conferencia.duration = $(xml).find('duration').text();
                conferencia.parentMeetingID = $(xml).find('parentMeetingID').text();
                conferencia.hasUserJoined = $(xml).find('hasUserJoined').text();
                console.log(doc)
                doc.returncode = $(xml).find("returncode").text();
                doc.createtime = $(xml).find("createTime").text();
                doc.internalmeetingid = $(xml).find("internalMeetingID").text();
                doc.meetingid = $(xml).find("meetingID").text();
                doc.attendeepw = $(xml).find('attendeePW').text();
                doc.moderatorpw = $(xml).find('moderatorPW').text();
                doc.duration = $(xml).find('duration').text();
                doc.parentmeetingid = $(xml).find('parentMeetingID').text();
                doc.hasuserjoined = $(xml).find('hasUserJoined').text();

                
                var urljoin = 'https://meet.hisalud.com/bigbluebutton/api/join?';
                var join = 'meetingID='+conferencia.meetingID;
                    join +='&fullName='+frappe.user.name;
                    join +='&createTime='+conferencia.createTime;
                    join +='&password='+conferencia.moderatorPW;
                    join +='&checksum='+sha1('join'+join+conferencia.secret);

                    $('#bbb-client').attr('src',urljoin+join); 
                    $('#bbb-container').removeClass('hide'); 
                    $('#bbb-no-container').addClass('hide'); 
                    
                frappe.db.set_value('Video Conferencia', doc.name, doc ).then(r => {
                    let doc = r.message;
                    console.log(doc);
                })
            }
        }})
}
conferencia.Patient_Encounter_create = function() {
    var d = new Date();
    var n = d.getTime();

    frappe.call({
		method:"frappe.client.get_list",
        args:{ 
            doctype     : 'Video Conferencia', 
            fields      : "*", 
            filters     : [ ["cita","=", cur_frm.doc.appointment] ] 
        },
		async:false,
        callback: function(r) {
            console.log(r);
            if(r.message.length > 0){
                doc = r.message[0];
            }
        }
    });

    if(doc == null){
        return;
    }

    var url = 'https://meet.hisalud.com/bigbluebutton/api/create?';
    var txt = 'name='+frappe.user.name;
        txt += '&allowStartStopRecording=false';
        txt += '&attendeePW='+frappe.utils.get_random(10);
        txt += '&autoStartRecording=true';
        txt += '&record=true';
        txt += '&meetingID='+"room-"+n;
        txt += '&duration=30';
        txt += '&moderatorPW='+frappe.utils.get_random(12);
        txt += '&checksum='+sha1('create'+txt+conferencia.secret);
    
    frappe.call({
		method:"telemedicina.api.create",
		args:{"url": url+txt},
		async: true,
		callback: function(r) {
            var xml, parser;
            parser = new DOMParser();
            xml = parser.parseFromString(r.message,"text/xml"); 
            conferencia.returnCode = $(xml).find("returncode").text();
            if( conferencia.returnCode == "SUCCESS"){
                conferencia.createTime = $(xml).find("createTime").text();
                conferencia.internalMeetingID = $(xml).find("internalMeetingID").text();
                conferencia.meetingID = $(xml).find("meetingID").text();
                conferencia.attendeePW = $(xml).find('attendeePW').text();
                conferencia.moderatorPW = $(xml).find('moderatorPW').text();
                conferencia.duration = $(xml).find('duration').text();
                conferencia.parentMeetingID = $(xml).find('parentMeetingID').text();
                conferencia.hasUserJoined = $(xml).find('hasUserJoined').text();

                doc.returncode = $(xml).find("returncode").text();
                doc.createtime = $(xml).find("createTime").text();
                doc.internalmeetingid = $(xml).find("internalMeetingID").text();
                doc.meetingid = $(xml).find("meetingID").text();
                doc.attendeepw = $(xml).find('attendeePW').text();
                doc.moderatorpw = $(xml).find('moderatorPW').text();
                doc.duration = $(xml).find('duration').text();
                doc.parentmeetingid = $(xml).find('parentMeetingID').text();
                doc.hasuserjoined = $(xml).find('hasUserJoined').text();

                
                var urljoin = 'https://meet.hisalud.com/bigbluebutton/api/join?';
                var join = 'meetingID='+conferencia.meetingID;
                    join +='&fullName='+frappe.user.name;
                    join +='&createTime='+conferencia.createTime;
                    join +='&password='+conferencia.moderatorPW;
                    join +='&checksum='+sha1('join'+join+conferencia.secret);
                window. open(urljoin+join, '_blank');
                    
                frappe.db.set_value('Video Conferencia', doc.name, doc ).then(r => {
                    let doc = r.message;
                    frm.add_custom_button("Invitar a una persona", function() {
                      conferencia.addOther();
                  });
                })
            }
        }})
}

conferencia.Patient_Encounter_Playback = function (){
    
    frappe.call({
		method:"frappe.client.get_list",
        args:{ 
            doctype     : 'Video Conferencia', 
            fields      : "*", 
            filters     : [ ["cita","=", cur_frm.doc.appointment] ] 
        },
		async:false,
        callback: function(r) {
            console.log(r);
            if(r.message.length > 0){
                doc = r.message[0];
            }
        }
    });

	var url = 'https://meet.hisalud.com/bigbluebutton/api/getRecordings?';
	var txt = '&meetingID='+doc.meetingid;
	txt += '&checksum='+sha1('getRecordings'+txt+conferencia.secret);
	frappe.call({
		method:"telemedicina.api.create",
		args:{"url": url+txt},
		async: true,
		callback: function(r) {
			var xml, parser;
			parser = new DOMParser();
            xml = parser.parseFromString(r.message,"text/xml"); 
            if($(xml).find("url").length){
                url = $(xml).find("url").text();
            }else{
                frappe.msgprint("la grabacion está siendo procesada");
            }
            if(url==undefined){
                frappe.msgprint("la grabacion está siendo procesada");
            }
            
            window.open(url);
            window. open(url, '_blank');
		}})
}

conferencia.playback = function (){
	var url = 'https://meet.hisalud.com/bigbluebutton/api/getRecordings?';
	var txt = '&meetingID='+cur_frm.doc.meetingid;
	txt += '&checksum='+sha1('getRecordings'+txt+conferencia.secret);
	frappe.call({
		method:"telemedicina.api.create",
		args:{"url": url+txt},
		async: true,
		callback: function(r) {
			var xml, parser;
			parser = new DOMParser();
            xml = parser.parseFromString(r.message,"text/xml"); 
            if($(xml).find("url").length){
                url = $(xml).find("url").text();
            }else{
                frappe.msgprint("la grabacion está siendo procesada");
            }
            if(url==undefined){
                frappe.msgprint("la grabacion está siendo procesada");
            }
            
            window.open(url);
            
		}})
}

conferencia.addOther = function (){
  
  let d = new frappe.ui.Dialog({
    title: 'Ingrese el nombre del medico',
    fields: [
        {
            label: 'Nombre del medico',
            fieldname: 'medico',
            fieldtype: 'Data'
        }
    ],
    primary_action_label: 'Invitar',
    primary_action(values) {
        var med = values.medico;
        var url = 'https://meet.hisalud.com/bigbluebutton/api/join?';
        var txt = '&meetingID='+conferencia.meetingID;
            txt += '&fullName='+values.medico;
            txt += '&password='+conferencia.attendeePW;
        txt += '&checksum='+sha1('getRecordings'+txt+conferencia.secret);
        frappe.db.insert({
            doctype: 'UrlShortener',
            url: url+txt,
            acortador:"Meet Hisalud"
        }).then(doc => {
            d.hide();
            var r = frappe.msgprint({
                title: __(`Enlace creado`),
                message: __(`envía el siguiente vinculo a ${med} para que pueda unirse a la cita clínica: \n https://${window.location.hostname}/b?name=${doc.name}`),
                primary_action_label: 'Copiar',
                primary_action:{
                    action(values) {
                        copiarAlPortapapeles(`https://${window.location.hostname}/b?name=${doc.name}`);                        
                        r.hide();
                    }
                }
            });
        });

      }
  });

  d.show();
}

function copiarAlPortapapeles(text) {
  var aux = document.createElement("input");
  aux.setAttribute("value", text);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
}