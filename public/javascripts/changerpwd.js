$(document).ready(function (){


    $( "button[name='envoyer']" ).click(function( event ) {
        event.preventDefault();   
        $.ajax({
            "url": "/PortesOuvertsConfig/changerpwd",
            "method": "POST",
            "timeout": 0,
            "data" : {
                username : $("input[name='username']").val(),
                email : $("input[name='courriel']").val(),
                pwd : $("input[name='password']").val()
                
            }
          }).done(function (response) {
            if (response.status == 'success'){
                alert("Mot de pass a mis à jour");
                document.getElementById('formulaire').reset();
            }
            else
                alert("Données non valides")
            }).fail(function(xhr, status, error) {
                console.log('Error - ' + JSON.stringify(xhr));
                // $("#errorMesssge").html((xhr.responseJSON.status + ":" + xhr.responseJSON.statusText));
                alert("Données non valide")
            });
    });
    

});