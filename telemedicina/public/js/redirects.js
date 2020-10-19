$(document).ready(function(e) {
    window.addEventListener('popstate', function(e){
        if( window.location.href != "https://hisalud.com/me")
        {
            location.href="https://hisalud.com/"; 
        }
    });

      if( window.location.href != "https://hisalud.com/me" )
      {
        location.href="https://hisalud.com/"; 
      }
  
 })