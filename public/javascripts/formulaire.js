$(document).ready(function (){

    $.ajax({
      "url": "/PortesOuverts/formulaire",
      "method": "GET",
      "timeout": 0,
    }).done(function (response) {
        console.log(response);
        const events = $('#cardsContainer');
        response.forEach((item) => {
            console.log(JSON.stringify(item));
            events.append(`<input type="checkbox" value="' ${item.description} "' name = " ${item.idProgramme} " />`);
        });
      }); 
  } );
  