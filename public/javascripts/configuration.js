$(document).ready(function(){
    $.fn.getGeneralConfig = function(){ 
        $.ajax({
            "url": "/PortesOuvertsConfig/configuration/outGeneralConsult",
            "method": "POST",
            "timeout": 0,
          }).done(function (response) {
            $("input[name='virtualVisit']").val(response[0].linkVirtualVisit);
            $("input[name='faq']").val(response[0].linkFAQ);
            $("input[name='message']").val(response[0].endMessage);
        }); 
   }

    $( "#tabs" ).tabs({
        activate: function(event ,ui){
            if(ui.newTab.index()){   
                $.fn.getGeneralConfig();           
            }
        }
    });

    $( ".btn" ).click(function( event ) {
        event.preventDefault();
        $.ajax({
            "url": "/PortesOuvertsConfig/configuration/inGeneralConsult",
            "method": "POST",
            "timeout": 0,
            "data" : {
                linkVirtualVisit : $("input[name='virtualVisit']").val(),
                linkFAQ : $("input[name='faq']").val(),
                message: $("input[name='message']").val()              
            }
          }).done(function (response) {
              if(response.message == 'success'){
                $( '#successAlert' ).show('fade').fadeTo(500, 0).slideUp(500, function(){
                    $(this).remove(); 
                });
                setTimeout(function () { 
                    $('#successAlert').alert('close'); 
                }, 5000); 
              }
        }).fail(function(xhr, status, error) {
            console.log('Error - ' + JSON.stringify(xhr));
            $('#errorMesssge').html((xhr.responseJSON.status + ': ' + xhr.responseJSON.statusText));
            $( '#errorAlert' ).show('fade');
            setTimeout(function () { 
                $('#errorAlert').alert('close'); 
            }, 5000);
      });
    });

    $.fn.getGeneralConfig();
});