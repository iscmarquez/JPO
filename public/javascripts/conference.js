$(document).ready(function (){

  $.ajax({
    "url": "/PortesOuverts/conference",
    "method": "GET",
    "timeout": 0,
  }).done(function (response) {
      console.log(response);
      const events = $('#cardsContainer');
      response.forEach((item) => {
          console.log(JSON.stringify(item));
          events.append(`<article class="col">
          <div class="card">
            <div class="card-header">${item.nameConference}</div>
            <div class="card-body">
                <p>${item.start} ${item.end} </p>
                <img class="card-img" src="${item.photolink}" alt="Conferencista: ${item.name}"/> 
                <p>${item.description}</p>
              <a class="btn btn-warning" href="${item.linkConference}">Participer</a>
            </div>
          </div>
        </article>`);
      });
    }); 
} );
