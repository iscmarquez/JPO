$(document).ready(function (){
          $.ajax({
            "url": "/PortesOuverts/loginpublic",
            "method": "POST",
            "timeout": 0,
          }).done(function (response) {
            console.log("Response : " + JSON.stringify(response));
            if(response[0].eventId == -1){
                $('#errorMesssge').html(response[0].noevent);
                $("#login1").hide();
            }
            else{
              $("#errorAlert").hide();
            }
          }); 

                
  } );