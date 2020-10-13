$(document).ready(function (){

  $.ajax({
    "url": "/PortesOuverts/conference",
    "method": "GET",
    "timeout": 0,
  }).done(function (response) {
      console.log(response);
      const events = $('#cardsContainer');
      response.forEach((item) => {
          console.log("linkphoyto" + item.photolink);

          events.append(`<article class="col">
          <div class="card" with="400">
            <div class="card-header">${item.nameConference}</div>
            <div class="card-body" >
                <p>${item.start} ${item.end} </p>
                <img class="card-img" src="${item.photoLink}" alt="Conferencista: ${item.name}" width="200" height="250"/> 
                <p>${item.description}</p>
              <a class="btn btn-warning" href="${item.linkConference}" target="_blank">Participer</a>
            </div>
          </div>
        </article>`);
      });
    }); 
} );
