// Copyright (c) 2020, Alejandro Aguirre and contributors
// For license information, please see license.txt

frappe.ui.form.on('Video Conferencia', {
	setup: function(frm) {
		if(cur_frm.doc.meetingid !== undefined ){
		}else{
			cur_frm.set_df_property("grabacion","hidden",1);
		}
	}
});
 
frappe.ui.form.on("Video Conferencia", "grabacion", function(frm) {
    conferencia.playback();
});
