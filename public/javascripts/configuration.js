var speakerMethod;
var speakerData;
var eventMethod;
var eventData;

$(document).ready(function(){

    
    $( "#tabs" ).tabs({
        activate: function(event ,ui){
            if(ui.newTab.index() == 0){   
                $.fn.getGeneralConfig();           
            }
            if(ui.newTab.index() == 1){   
                $.fn.getAllEvents();           
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

// Events methods 

var $tableEvent = $("#eventList").DataTable({
    'columnDefs': [{
        'targets': 0,
        'searchable':false,
        'orderable':false,
        'width':'1%',
        'selected': true,
        'render': function (data, type, full, meta){
            return '<input type="radio" value="' + data + '" name="idEvent">';
        } 
     }]
}); 

$tableEvent.on('click', 'tr', function () {
    eventData = $tableEvent.row( this ).data();
    console.log("eventData : " + JSON.stringify(eventData));
    let $radio = $('input[type="radio"]', $(this));
    $radio.prop("checked", true);
} );



$.fn.getAllEvents = function(){ 
    $.ajax({
            "url": "/PortesOuvertsConfig/configuration/inEvent",
            "method": "GET",
            "timeout": 0,
        }).done(function (response) {
            $tableEvent.clear();
            for(let i = 0; i < response.length; i++){
                console.log(response[i]);
                 $tableEvent.row.add([response[i].idEvent, response[i].startDate, response[i].nomEvent]);
            }
            $tableEvent.draw();
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

    $("#eventModal").on("hidden.bs.modal", function () {
        $("#eventForm")[0].reset();
    })

    $("#eventModal").on("show.bs.modal", function (event) {
        var button = $(event.relatedTarget)
        if(button.attr("name") === "addEvent")
            eventMethod="POST";
        else if(button.attr("name") === "updateEvent"){
            eventMethod="PUT";
            $("#dateEvent").val(eventData[1]);
            $("#nameEvent").val(eventData[2]);

            
        }  
    }) 

   $( "button[name='saveEvent']" ).click(function( event ) {
    event.preventDefault();
    console.log($("input[name='idEvent']:checked").val());      
    $.ajax({
        "url": "/PortesOuvertsConfig/configuration/inEvent",
        "method": eventMethod,
        "timeout": 0,
        "data" : {
            dateInitial : $("input[name='dateInitial']").val(),
            eventName: $("input[name='name']").val(),
            idEventUpdate : eventMethod === "PUT" ? $("input[name='idEvent']:checked").val(): null               
        }
      }).done(function (response) {
          if(response.message == "success"){
            $.fn.getAllEvents();
            $('#eventModal').modal('hide');
            $( "#successAlert" ).show("fade");
            setTimeout(function () { 
                $("#successAlert").alert("close"); 
            }, 10000); 
          }
         
    }).fail(function(xhr, status, error) {
        console.log('Error - ' + JSON.stringify(xhr));
       // $("#errorMesssge").html((xhr.responseJSON.status + ":" + xhr.responseJSON.statusText));
       $("#errorMesssge").html("Les informations ne peuvent pas être enregistrées");
        $("#errorAlert").show("fade");
        setTimeout(function () { 
            $("#errorAlert").alert("close"); 
        }, 10000);
  });
});


$( "button[name='removeEvent']" ).click(function( event ) {
    event.preventDefault();
    $.ajax({
        "url": "/PortesOuvertsConfig/configuration/inEvent",
        "method": "DELETE",
        "timeout": 0,
        "data" : {
            idEventUpdate : eventData[0],             
        }
      }).done(function (response) {
          if(response.message == "success"){
              console.log("status");
            $.fn.getAllEvents();
            $( "#successAlert" ).show("Les informations ont été effacés");
            setTimeout(function () { 
                $("#successAlert").alert("close"); 
            }, 10000); 
          }
    }).fail(function(xhr, status, error) {
        console.log('Error - ' + JSON.stringify(xhr));
       // $("#errorMesssge").html((xhr.responseJSON.status + ":" + xhr.responseJSON.statusText));
       $("#errorMesssge").html("L'événement ne peut pas être effacé car des conférences sont programmées");
        $("#errorAlert").show("fade");
        setTimeout(function () { 
            $("#errorAlert").alert("close"); 
        }, 10000);
  });
});


//Events Speaker
    var $tableBody = $("#speakerList").DataTable({
        'columnDefs': [{
            'targets': 0,
            'searchable':false,
            'orderable':false,
            'width':'1%',
            'selected': true,
            'render': function (data, type, full, meta){
                return '<input type="radio" value="' + data + '" name="idSpeaker"> ' ;
            } 
         },{
            'targets': 1,
            'searchable':false,
            'orderable':false,
            'width':'20%',
            'selected': true,
            'render': function (data, type, full, meta){
                return '<img class="card-img" src="' + data + '" width="30" height="80"/>' ;
            } 
         }]
    });    


    $tableBody.on('click', 'tr', function () {
        speakerData = $tableBody.row( this ).data();
        console.log("speakerData : " + JSON.stringify(speakerData));
        let $radio = $('input[type="radio"]', $(this));
        $radio.prop("checked", true);
    } );

      $.fn.getSpeakers = function(){ 
        $.ajax({
                "url": "/PortesOuvertsConfig/configuration/inSpeaker",
                "method": "GET",
                "timeout": 0,
            }).done(function (response) {
                $tableBody.clear();
                for(let i = 0; i < response.length; i++){
                     $tableBody.row.add([response[i].idSpeaker, response[i].photoLink, response[i].name, response[i].description,response[i].chat] );
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

    $( "button[name='saveSpeaker']" ).click(function( event ) {
        event.preventDefault();
        var data = new FormData();
        var file = $('#inputFile')[0].files[0];
        data.append("file",file);
        data.append("name", $("input[name='speakerName']").val());
        data.append("description", $("input[name='speakerDescription']").val());
        if ($('#chat').is(":checked"))
        {
            data.append("chat","1");
        }else 
            data.append("chat","0");
        console.log($("input[name='chat']:checked").val());
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
                $( "#successAlert" ).show("Les informations ont été effacés");
                setTimeout(function () { 
                    $("#successAlert").alert("close"); 
                }, 10000); 
              }
        }).fail(function(xhr, status, error) {
            console.log('Error - ' + JSON.stringify(xhr));
            $("#errorMesssge").html("Les informations ne peuvent pas être effacées");
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