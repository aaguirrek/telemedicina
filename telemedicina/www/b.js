const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const page_type = urlParams.get('name');
frappe.ready(async () => {
  frappe.call(
  {
    method:"frappe.client.get",
    args:{
      doctype:'UrlShortener', 
      name: page_type
    },
    callback:function(e){
      var doc = e.message;
      location.href = doc.url;
    }
  });
});