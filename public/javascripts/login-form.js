$(document).ready(function (){
          $.ajax({
            "url": "/PortesOuverts/loginpublic",
            "method": "POST",
            "timeout": 0,
          }).done(function (response) {
            console.log("Response : " + JSON.stringify(response));
            if(!response[0]){
                $('#errorMesssge').html("Desole la journee des portes ouverts est deja fini. Veuiellez vous incrire a la prochain. ");
                $( '#errorAlert' ).show('fade');
                         
                $("#login1").hide();
            }
            else{
              $("#errorAlert").hide();
            }
          }); 
  } );