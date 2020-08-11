frappe.provide('frappe.utils');
frappe.provide('frappe.user');

var secret="OE4Od5DIpgdJpD9CPOTqtu3IdHTjBNUvDjvWWtICo";
var docs;
frappe.ready(async () => {
    
    frappe.call({
		method:"frappe.client.get_list",
		args:{"doctype": 'Video Conferencia', fields:"*",filters:[["userpacient","=",frappe.user_id] ], order_by:"time desc" },
		async:false,
        callback: function(r) {
            docs = r.message;
            let cont=0;
            let verahora="";
            let htmljoin="";
            let textwhite = "";
            let dat, ended,now;
            r.message.forEach(element => {
                verahora="";
                textwhite="";
                htmljoin="";
                now = new Date();
                dat = new Date(element.time);
                ended = new Date(element.time);
                ended = ended.setMinutes( ended.getMinutes() + 10 );
                console.log(ended);
                if(element.returncode  == "SUCCESS" && (now.getTime() >= dat.getTime() && now.getTime() < ended ))
                {
                    textwhite = "text-white";
                    verahora ="progress-banner";
                    htmljoin=`<button type="button" onclick="joindMeeting(${cont})" class="btn btn-outline-light mb-1">Unirse</button>`;
                }

                if(element.returncode  == "SUCCESS" && now.getTime() > ended )
                {
                    htmljoin=`<button type="button" onclick="records(${cont})" class="btn btn-primary mb-1">Reproducir Grabacion</button>`;
                }
            

                $("#conferencias").append(`<div class="col-xl-4 col-lg-4" style="padding-left: 0;padding-right: 0;">
                    <div class="card mb-4 ${verahora}">
                        <div class="card-body justify-content-between d-flex flex-row align-items-center">
                            <div>
                                <p class="lead ${textwhite}">${element.medico}</p>
                                <p class="text-small ${textwhite}">${element.time}</p>
                                ${htmljoin}
                            </div>
                        </div>
                    </div>
                </div>`);
                cont++;
            });

        }
    });
})


function joindMeeting(e){
    var urljoin  = 'https://meet.hisalud.com/bigbluebutton/api/join?';
    var join     = 'meetingID='+docs[e].meetingid;
        join    += '&fullName='+frappe.user_id;
        join    += '&createTime='+docs[e].createtime;
        join    += '&password='+docs[e].attendeepw;
        join    += '&checksum='+sha1('join'+join+secret);
        window.open(urljoin+join);
}

function records(e){
    var url      = 'https://meet.hisalud.com/bigbluebutton/api/getRecordings?';
    var txt      = 'meetingID='+docs[e].meetingid;
        txt     += '&checksum='+sha1('getRecordings'+txt+secret);
	frappe.call( {method:"telemedicina.api.create",args:{"url": url+txt},async: true,callback: function(r) {var xml, parser;parser = new DOMParser();xml = parser.parseFromString(r.message,"text/xml"); if($(xml).find("url").length){url = $(xml).find("url").text();}else{frappe.msgprint("la grabacion está siendo procesada");}if(url==undefined){frappe.msgprint("la grabacion está siendo procesada");}window.open(url);}} )
}