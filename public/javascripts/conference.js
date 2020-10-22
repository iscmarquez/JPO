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

          events.append(`
          <div class="col">
            <div class="card" style="margin-bottom: 20px; border-color: crimson; border-radius: 0;">
              <img class="card-img-bottom" src="${item.photolink}" alt=${item.nameconference}>
              <div class="card-body">
                <h4 class="card-title" style="color: #162b65;">${item.nameconference}</h4>
                <p class="card-text" style="color: #162b65;">${item.name}</p>
                <p class="card-text" style="color: #162b65;">${item.description}</p>
                <p style="color: crimson; font-size:smaller;">${item.start} ${item.end}</p>
                <a href="${item.linkconference}" class="btn">Participer</a>
              </div>
            </div>
          </div>`);
      });
    }); 
} );
