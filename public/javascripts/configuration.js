var speakerMethod;
var speakerData;
var eventMethod;
var eventData;
var filesData;

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
                $.fn.getAllConferences();
               
            }
            if(ui.newTab.index() == 4){
                $.fn.getFiles();
               
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
            $("input[name='virtualVisit']").val(response[0].linkvirtualvisit);
            $("input[name='faq']").val(response[0].linkfaq);
            $("input[name='welcomeTitle']").val(response[0].welcometitle);
            $("input[name='welcomeSubTitle']").val(response[0].welcomesubtitle);
            $("#welcomeText").text (response[0].welcometext);
            $("#welcomeText2").text(response[0].welcomtext2);
            $("#welcomeText3").text(response[0].welcomtext3);
            $("input[name='video1']").val(response[0].video1);
           
        }); 
   }

   $( "button[name='saveGeneral']" ).click(function( event ) {
    event.preventDefault();

    let form = $('#general');
    
    if(form[0].checkValidity() == false) {
        form.addClass('was-validated');
        e.stopPropagation();
        return;
    }

    $.ajax({
        "url": "/PortesOuvertsConfig/configuration/inGeneralConsult",
        "method": "POST",
        "timeout": 0,
        "data" : {
            linkVirtualVisit : $("input[name='virtualVisit']").val(),
            linkFAQ : $("input[name='faq']").val(),
            message: $("#message").val(),
            welcomeTexte: $("#welcomeText").val(),
            welcomeText2:  $("#welcomeText2").val(),
            welcomeText3:  $("#welcomeText3").val(),
            video1: $("input[name='video1']").val(),    
            video2: $("input[name='video2']").val() ,
            welcomeTitle: $("input[name='welcomeTitle']").val(),    
            welcomeSubTitle: $("input[name='welcomeSubTitle']").val()                      
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
                 $tableEvent.row.add([response[i].idevent, response[i].startdate, response[i].nomevent]);
            }
            $tableEvent.draw();
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
       $("#errorMesssge").html("Les informations ne peuvent pas être enregistrées/ mettre à jour");
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
                    $tableBody.row.add([response[i].idspeaker, response[i].photolink, response[i].name, response[i].description,(response[i].chat ? "oui" : "non"),response[i].linkchat ] );

                }
                $tableBody.draw();
        }); 
    }

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
            if(speakerData[4]== "oui")
                $("input[name='chat']").prop("checked", true); 
            else
                $("input[name='chat']").prop("checked", false);
            $("input[name='linkchat']").val(speakerData[5]);

        }  
      })   


    $( "button[name='saveSpeaker']" ).click(function( event ) {
        event.preventDefault();
        var data = new FormData();
        var file = $('#inputFile')[0].files[0];
        data.append("file",file);
        data.append("name", $("input[name='speakerName']").val());
        data.append("description", $("input[name='speakerDescription']").val());
        data.append("chat", ($("input[name='chat']").is(":checked") ? true : false));
        data.append("linkchat",$("input[name='linkchat']").val());

        if(speakerMethod === "PUT")
            data.append("idSpeaker", $("input[name='idSpeaker']:checked").val());    
        console.log("tipo de post" +speakerMethod );
            $.ajax({
            "url": "/PortesOuvertsConfig/configuration/inSpeaker",
            "method": speakerMethod,
            "enctype": 'multipart/form-data',
            "processData": false,  // Important!
            "contentType": false,
            "cache": false,
            "data" : data
          }).done(function (response) {
              if(response.status == "success"){
                $.fn.getSpeakers();
                $('#eventModal').modal('hide');
                $( "#successAlert" ).show("fade");
                setTimeout(function () { 
                    $("#successAlert").alert("close"); 
                }, 10000); 
              }
        }).fail(function(xhr, status, error) {
            console.log('Error - ' + JSON.stringify(xhr));
            $('#eventModal').modal('hide');
           // $("#errorMesssge").html((xhr.responseJSON.status + ":" + xhr.responseJSON.statusText));
           $("#errorMesssge").html("Les informations ne peuvent pas être enregistrées/ mettre à jour");
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

    // Conferences


    var $tableConference = $("#conferenceList").DataTable({
        'columnDefs': [{
            'targets': 0,
            'searchable':false,
            'orderable':false,
            'width':'1%',
            'selected': true,
            'render': function (data, type, full, meta){
                return '<input type="radio" value="' + data + '" name="idConference">';
            } 
         },
         {
            'targets': 6,
            "visible": false
         },
         {
            'targets': 7,
            "visible": false
         }
        ]
    }); 
    
    $tableConference.on('click', 'tr', function () {
        conferenceData = $tableConference.row( this ).data();
        console.log("conferenceData : " + JSON.stringify(conferenceData));
        let $radio = $('input[type="radio"]', $(this));
        $radio.prop("checked", true);
    } );
    
    
    $.fn.getSpeakersConference = function(){ 
        $.ajax({
                "url": "/PortesOuvertsConfig/configuration/outSpeakerDdl",
                "method": "GET",
                "timeout": 0,
            }).done(function (response) {
                $('#idSpeaker').empty();
                response.forEach((item) => {
                 $("#idSpeaker").append('<option value="'+item.idSpeaker+'">'+item.name+'</option>');
                });
            });
    }
  
    $.fn.getAllConferences = function(){ 
        $.ajax({
                "url": "/PortesOuvertsConfig/configuration/inConference",
                "method": "GET",
                "timeout": 0,
            }).done(function (response) {
                $tableConference.clear();
                for(let i = 0; i < response.length; i++){
                    console.log(response[i]);
                     $tableConference.row.add([response[i].idconference,
                        response[i].nameconference, 
                        response[i].start, 
                        response[i].end, 
                        response[i].name, 
                        response[i].linkconference,
                        response[i].idspeaker,
                        response[i].idevent]);
                }
               
                $tableConference.draw();
        }); 
    }
    

    $.fn.getEventsConferences = function(){ 
        $.ajax({
                "url": "/PortesOuvertsConfig/configuration/Events",
                "method": "GET",
                "timeout": 0,
            }).done(function (response) {
                $('#idEventConference').empty();
                console.log(response);
                response.forEach((item) => {
                 $("#idEventConference").append('<option value="'+item.idevent+'">'+item.date+'</option>');
                });
            });
    }

    $("#conferenceModal").on("hidden.bs.modal", function () {
        $("#conferenceForm")[0].reset();
    })

    $("#conferenceModal").on("show.bs.modal", function (event) {
        $.fn.getSpeakersConference();  
        $.fn.getEventsConferences(); 
        var button = $(event.relatedTarget)
        if(button.attr("name") === "addConference")
            conferenceMethod="POST";
        else if(button.attr("name") === "updateConference"){
            conferenceMethod="PUT";
            $("#conferenceName").val(conferenceData[1]);
            $("#commence").val(conferenceData[2]);
            $("#end").val(conferenceData[3]);
            $("#idSpeaker").val(conferenceData[6]);
            $("#idEventConference").val(conferenceData[7]);
            $("#linkConference").val(conferenceData[5]);
            
        }  
    }) 


    $( "button[name='saveConference']" ).click(function( event ) {
        event.preventDefault();
       
        $.ajax({
            "url": "/PortesOuvertsConfig/configuration/inConference",
            "method": conferenceMethod,
            "timeout": 0,
            "data" : {
                nameConference : $("input[name='conferenceName']").val(),
                event : $("#idEventConference").val(),
                init : $("input[name='commence']").val(),
                end : $("input[name='end']").val(),
                link: $("input[name='linkConference']").val(),
                speaker: $("#idSpeaker").val(),
                idConference : conferenceMethod === "PUT" ? $("input[name='idConference']:checked").val(): null   
                               
            }
          }).done(function (response) {
                if(response.message == "success"){
                    $.fn.getAllConferences();
                    $('#conferenceModal').modal('hide');
                $( "#successAlert" ).show("fade").fadeTo(500, 0).slideUp(500, function(){
                    $(this).remove(); 
                });
                setTimeout(function () { 
                    $("#successAlert").alert("close"); 
                }, 10000); 
              }
        }).fail(function(xhr, status, error) {
            console.log('Error - ' + JSON.stringify(xhr));
           // $("#errorMesssge").html((xhr.responseJSON.status + ":" + xhr.responseJSON.statusText));
           $("#errorMesssge").html("Les informations ne peuvent pas être enregistrées/ mettre à jour");
            $("#errorAlert").show("fade");
            setTimeout(function () { 
                $("#errorAlert").alert("close"); 
            }, 10000);
      });
    });

  
    
$( "button[name='removeConference']" ).click(function( event ) {
    event.preventDefault();
    $.ajax({
        "url": "/PortesOuvertsConfig/configuration/inConference",
        "method": "DELETE",
        "timeout": 0,
        "data" : {
            idConference : conferenceData[0],             
        }
      }).done(function (response) {
          if(response.message == "success"){
            $.fn.getAllConferences();
            $('#conferenceModal').modal('hide');
            $( "#successAlert" ).show("Les informations ont été effacés");
            setTimeout(function () { 
                $("#successAlert").alert("close"); 
            }, 10000); 
          }
    }).fail(function(xhr, status, error) {
        console.log('Error - ' + JSON.stringify(xhr));
       // $("#errorMesssge").html((xhr.responseJSON.status + ":" + xhr.responseJSON.statusText));
       $("#errorMesssge").html("La conférence ne peut pas être effacé ");
        $("#errorAlert").show("fade");
        setTimeout(function () { 
            $("#errorAlert").alert("close"); 
        }, 10000);
  });
});


//Downloadable

var $tableFiles = $("#fileList").DataTable({
    'columnDefs': [{
        'targets': 0,
        'searchable':false,
        'orderable':false,
        'width':'1%',
        'selected': true,
        'render': function (data, type, full, meta){
            return '<input type="radio" value="' + data + '" name="idFile"> ' ;
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


$tableFiles.on('click', 'tr', function () {
    filesData = $tableFiles.row( this ).data();
    console.log("filesData : " + JSON.stringify(filesData));
    let $radio = $('input[type="radio"]', $(this));
    $radio.prop("checked", true);
} );

  $.fn.getFiles = function(){ 
    $.ajax({
            "url": "/PortesOuvertsConfig/configuration/File",
            "method": "GET",
            "timeout": 0,
        }).done(function (response) {
            $tableFiles.clear();
            for(let i = 0; i < response.length; i++){
                $tableFiles.row.add([response[i].iddownloadable, response[i].fileimage, response[i].description,response[i].filelink] );

            }
            $tableFiles.draw();
    }); 
}

$("#fileModal").on("hidden.bs.modal", function () {
    $("#fileForm")[0].reset();
})

$("#fileModal").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget)
    if(button.attr("name") === "addFile")
        fileMethod="POST";
    else if(button.attr("name") === "updateFile"){
        fileMethod="PUT";
        $("input[name='fileDescription']").val(filesData[2]);
    }  
  }) 

$( "button[name='saveFile']" ).click(function( event ) {
    event.preventDefault();
    var data = new FormData();
    var file = $('#inputFileDocument')[0].files[0];
    data.append("file",file);
    var image = $('#inputFileImage')[0].files[0];
    data.append("image",image);
    data.append("description", $("input[name='fileDescription']").val());

    if (fileMethod === "PUT") {
        data.append("idFile", $("input[name='idFile']:checked").val())
    }
    $.ajax({
        "url": "/PortesOuvertsConfig/configuration/File",
        "method": fileMethod,
        "enctype": 'multipart/form-data',
        "processData": false,  // Important!
        "contentType": false,
        "cache": false,
        "data" : data
      }).done(function (response) {
          if(response.status == "success"){
            $.fn.getFiles();
            $('#fileModal').modal('hide');
            $( "#successAlert" ).show("fade");
            setTimeout(function () { 
                $("#successAlert").alert("close"); 
            }, 10000); 
          }
    }).fail(function(xhr, status, error) {
        console.log('Error - ' + JSON.stringify(xhr));
        $('#fileModal').modal('hide');
       // $("#errorMesssge").html((xhr.responseJSON.status + ":" + xhr.responseJSON.statusText));
       $("#errorMesssge").html("Les informations ne peuvent pas être enregistrées/ mettre à jour");
        $("#errorAlert").show("fade");
        setTimeout(function () { 
            $("#errorAlert").alert("close"); 
        }, 10000);
  });
  $('#fileForm')[0].reset();
});


$( "button[name='removeFiles']" ).click(function( event ) {
    event.preventDefault();
    $.ajax({
        "url": "/PortesOuvertsConfig/configuration/File",
        "method": "DELETE",
        "timeout": 0,
        "data" : {
            idFile : filesData[0]
        }
      }).done(function (response) {
          if(response.status == "success"){
            $.fn.getFiles();
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

$( "button[name='inscriptions']" ).click(function( event ) {
    event.preventDefault();
     
    $.ajax({
        "url": "/PortesOuvertsConfig/configuration/reportIns",
        "method": "POST",
        "timeout": 0,
        "data" : {
            dateInitialIns : $("input[name='dateInitialIns']").val(),
            dateFinIns : $("input[name='dateFinIns']").val()               
        }
    }).done(function (response, status, xhr) {
        console.log(response);
        // check for a filename
        var filename = "";
        var disposition = xhr.getResponseHeader('Content-Disposition');
        if (disposition && disposition.indexOf('attachment') !== -1) {
            var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            var matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
        }

        var type = xhr.getResponseHeader('Content-Type');
        var blob = new Blob([response], { type: type });

        if (typeof window.navigator.msSaveBlob !== 'undefined') {
            // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
            window.navigator.msSaveBlob(blob, filename);
        } else {
            var URL = window.URL || window.webkitURL;
            var downloadUrl = URL.createObjectURL(blob);

            if (filename) {
                // use HTML5 a[download] attribute to specify filename
                var a = document.createElement("a");
                // safari doesn't support this yet
                if (typeof a.download === 'undefined') {
                    window.location = downloadUrl;
                } else {
                    a.href = downloadUrl;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                }
            } else {
                window.location = downloadUrl;
            }

            setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
        }
    }).fail(function(xhr, status, error) {
        
  });
});

$( "button[name='program']" ).click(function( event ) {
    event.preventDefault();
     
    $.ajax({
        "url": "/PortesOuvertsConfig/configuration/reportProg",
        "method": "POST",
        "timeout": 0,
        "data" : {
            dateInitialIns : $("input[name='dateInitialProg']").val(),
            dateFinIns : $("input[name='dateFinProg']").val()               
        }
      }).done(function (response) {

    }).fail(function(xhr, status, error) {
        
  });
});


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