$(document).ready(function(){
    $.fn.getGeneralConfig = function(){ 
        $.ajax({
            "url": "/PortesOuvertsConfig/configuration/outGeneralConsult",
            "method": "GET",
            "timeout": 0,
          }).done(function (response) {
            $("input[name='virtualVisit']").val(response[0].linkVirtualVisit);
            $("input[name='faq']").val(response[0].linkFAQ);
            $("input[name='message']").val(response[0].endMessage);
        }); 
   }

   $.fn.getSpeakers = function(){ 
        $.ajax({
                "url": "/PortesOuvertsConfig/configuration/inSpeaker",
                "method": "GET",
                "timeout": 0,
            }).done(function (response) {
                console.log("Result : ", JSON.stringify(response));
        }); 
    }

    $( "#tabs" ).tabs({
        activate: function(event ,ui){
            console.log("Tab Activated : " + ui.newTab.index());
            if(ui.newTab.index() == 0){   
                $.fn.getGeneralConfig();           
            }
            if(ui.newTab.index() == 2){
                $.fn.getSpeakers();           
            }             
        }
    });

    $( "button[name='saveGeneral']" ).click(function( event ) {
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
              if(response.message == "success"){
                $( "#successAlert" ).show("fade").fadeTo(500, 0).slideUp(500, function(){
                    $(this).remove(); 
                });
                setTimeout(function () { 
                    $("#successAlert").alert("close"); 
                }, 10000); 
              }
        }).fail(function(xhr, status, error) {
            console.log('Error - ' + JSON.stringify(xhr));
            $("#errorMesssge").html((xhr.responseJSON.status + ":" + xhr.responseJSON.statusText));
            $("#errorAlert").show("fade");
            setTimeout(function () { 
                $("#errorAlert").alert("close"); 
            }, 10000);
      });
    });

    $( "button[name='saveEvent']" ).click(function( event ) {
        event.preventDefault();
        console.log($("input[name='dateInitial']").val());
        $.ajax({
            "url": "/PortesOuvertsConfig/configuration/inEvent",
            "method": "POST",
            "timeout": 0,
            "data" : {
                dateInitial : $("input[name='dateInitial']").val(),
                dateEnd : $("input[name='dateEnd']").val(),
                eventName: $("input[name='name']").val()              
            }
          }).done(function (response) {
              if(response.message == "success"){
                $( "#successAlert" ).show("fade");
                setTimeout(function () { 
                    $("#successAlert").alert("close"); 
                }, 10000); 
              }
        }).fail(function(xhr, status, error) {
            console.log('Error - ' + JSON.stringify(xhr));
            $("#errorMesssge").html((xhr.responseJSON.status + ":" + xhr.responseJSON.statusText));
            $("#errorAlert").show("fade");
            setTimeout(function () { 
                $("#errorAlert").alert("close"); 
            }, 10000);
      });
    });

    $( "button[name='saveSpeaker']" ).click(function( event ) {
        event.preventDefault();
        var data = new FormData();
        var file = $('#inputFile')[0].files[0];
        data.append("file",file);
        data.append("description", $("input[name='speakerName']").val())
        data.append("name", $("input[name='speakerDescription']").val())
        $.ajax({
            "url": "/PortesOuvertsConfig/configuration/inSpeaker",
            "method": "POST",
            "enctype": 'multipart/form-data',
            "processData": false,  // Important!
            "contentType": false,
            "cache": false,
            "data" : data
          }).done(function (response) {
              if(response.message == "success"){
                $( "#successAlert" ).show("fade");
                setTimeout(function () { 
                    $("#successAlert").alert("close"); 
                }, 10000); 
              }
        }).fail(function(xhr, status, error) {
            console.log('Error - ' + JSON.stringify(xhr));
            $("#errorMesssge").html((xhr.responseJSON.status + ":" + xhr.responseJSON.statusText));
            $("#errorAlert").show("fade");
            setTimeout(function () { 
                $("#errorAlert").alert("close"); 
            }, 10000);
      });
    });

    $.fn.getGeneralConfig();
});