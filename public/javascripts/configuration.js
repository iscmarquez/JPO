var speakerMethod;
var speakerData;
$(document).ready(function(){
    $.fn.getGeneralConfig = function(){ 
        $.ajax({
            "url": "/PortesOuvertsConfig/configuration/outGeneralConsult",
            "method": "GET",
            "timeout": 0,
          }).done(function (response) {
              console.log(response );
            $("input[name='virtualVisit']").val(response[0].linkVirtualVisit);
            $("input[name='faq']").val(response[0].linkFAQ);
            $("input[name='message']").val(response[0].endMessage);
            $("input[name='noEvent']").val(response[0].noEvent);
            $("input[name='video1']").val(response[0].video1);
            $("input[name='video2']").val(response[0].video2);
        }); 
   }

   $.fn.getSpeakers = function(){ 
        $.ajax({
                "url": "/PortesOuvertsConfig/configuration/inSpeaker",
                "method": "GET",
                "timeout": 0,
            }).done(function (response) {
                $tableBody.clear();
                for(let i = 0; i < response.length; i++){
                     $tableBody.row.add([response[i].idSpeaker, response[i].photoLink, response[i].name, response[i].description]);
                }
                $tableBody.draw();
        }); 
    }

    $.fn.getSpeakersConference = function(){ 
        $.ajax({
                "url": "/PortesOuvertsConfig/configuration/outSpeakerDdl",
                "method": "GET",
                "timeout": 0,
            }).done(function (response) {
                response.forEach((item) => {
                 $("#idSpeaker").append('<option value="'+item.idSpeaker+'">'+item.name+'</option>');
                });
            });
    }

    $.fn.getEvents = function(){ 
        $.ajax({
                "url": "/PortesOuvertsConfig/configuration/outEvents",
                "method": "GET",
                "timeout": 0,
            }).done(function (response) {
                console.log(response);
                response.forEach((item) => {
                 $("#idEvent").append('<option value="'+item.idEvent+'">'+item.date+'</option>');
                });
            });
    }

    $( "#tabs" ).tabs({
        activate: function(event ,ui){
            if(ui.newTab.index() == 0){   
                $.fn.getGeneralConfig();           
            }
            if(ui.newTab.index() == 2){
                $.fn.getSpeakers();           
            }
            if(ui.newTab.index() == 3){
                $.fn.getSpeakersConference();  
                $.fn.getEvents(); 
            }             
        }
    });

    var $tableBody = $("#speakerList").DataTable({
        'columnDefs': [{
            'targets': 0,
            'searchable':false,
            'orderable':false,
            'width':'1%',
            'selected': true,
            'render': function (data, type, full, meta){
                return '<input type="radio" value="' + data + '" name="idSpeaker">';
            } 
         }]
    });    

    $tableBody.on('click', 'tr', function () {
        speakerData = $tableBody.row( this ).data();
        console.log("speakerData : " + JSON.stringify(speakerData));
        let $radio = $('input[type="radio"]', $(this));
        $radio.prop("checked", true);
    } );

    $( "button[name='saveGeneral']" ).click(function( event ) {
        event.preventDefault();
        $.ajax({
            "url": "/PortesOuvertsConfig/configuration/inGeneralConsult",
            "method": "POST",
            "timeout": 0,
            "data" : {
                linkVirtualVisit : $("input[name='virtualVisit']").val(),
                linkFAQ : $("input[name='faq']").val(),
                message: $("input[name='message']").val(),
                noEvent: $("input[name='noEvent']").val(),
                video1: $("input[name='video1']").val(),    
                video2: $("input[name='video2']").val()                     
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
        data.append("description", $("input[name='speakerName']").val());
        data.append("name", $("input[name='speakerDescription']").val());
        if(speakerMethod === "PUT")
            data.append("idSpeaker", $("input[name='idSpeaker']:checked").val());    
        $.ajax({
            "url": "/PortesOuvertsConfig/configuration/inSpeaker",
            "method": "POST",
            "enctype": 'multipart/form-data',
            "processData": false,  // Important!
            "contentType": false,
            "cache": false,
            "data" : data
          }).done(function (response) {
              if(response.status == "success"){
                $.fn.getSpeakers();
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
      $('#speakerForm')[0].reset();
    });

    $( "button[name='removeSpeaker']" ).click(function( event ) {
        event.preventDefault();
        $.ajax({
            "url": "/PortesOuvertsConfig/configuration/inSpeaker",
            "method": "DELETE",
            "timeout": 0,
            "data" : {
                idSpeaker : speakerData[0]              
            }
          }).done(function (response) {
              if(response.status == "success"){
                $.fn.getSpeakers();
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

    $( "button[name='saveConference']" ).click(function( event ) {
        event.preventDefault();
        $.ajax({
            "url": "/PortesOuvertsConfig/configuration/inConference",
            "method": "POST",
            "timeout": 0,
            "data" : {
                nameConference : $("input[name='conferenceName']").val(),
                event : $("#idEvent").val(),
                init : $("input[name='commence']").val(),
                end : $("input[name='end']").val(),
                link: $("input[name='linkConference']").val(),
                speaker: $("#idSpeaker").val()
                               
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

    $("#speakerModal").on("hidden.bs.modal", function () {
        $("#speakerForm")[0].reset();
    })

    $("#speakerModal").on("show.bs.modal", function (event) {
        var button = $(event.relatedTarget)
        if(button.attr("name") === "addSpeaker")
            speakerMethod="POST";
        else if(button.attr("name") === "updateSpeaker"){
            speakerMethod="PUT";
            $("input[name='speakerName']").val(speakerData[2]);
            $("input[name='speakerDescription']").val(speakerData[3]);
        }  
      })   

    $.fn.getGeneralConfig();
});
$(document).ajaxStart(function(){
    console.log("Ajaxz Start");
    $("#overlay").fadeIn();
  }).ajaxComplete(function(){
    console.log("Ajaxz Complete");
    $("#overlay").fadeOut();
  }).ajaxError(function(event, jqxhr, settings, thrownError) {
    console.log("Ajaxz Error");
    $("#overlay").fadeOut();
  });;