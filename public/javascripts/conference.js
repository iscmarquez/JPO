$(document).ready(function (){

  $.ajax({
    "url": "/PortesOuverts/conference",
    "method": "GET",
    "timeout": 0,
  }).done(function (response) {
      console.log(response);
      const events = $('#cardsContainer');
      let i = 0;
      let $row = null;
      response.forEach((item) => {
          if(i%2 == 0){
            $row = $('<div class="row" style="padding-left: 50px; padding-top: 20; padding-right: 50px;"></div>');
            events.append($row);
          }
          $row.append(`
          <div class="col">
            <div class="card" style="margin-bottom: 20px; border-color: crimson; border-radius: 0;">
              <img class="card-img-bottom" src="${item.photolink}" alt=${item.nameconference}>
              <div class="card-body">
                <h4 class="card-title" style="color: #162b65;">${item.nameconference}</h4>
                <p class="card-text" style="color: #162b65;">${item.name}</p>
                <p class="card-text" style="color: #162b65;">${item.description}</p>
                <p style="color: crimson; font-size:smaller;">${item.start} - ${item.end}</p>
                <center>
                <button class="btn bouton-rouge-small" style=" margin-top: 15px;">
                <a href="${item.linkconference}" class="btn" target="_blank">
                  <p class="blanc"><strong>Participer</strong></p>
                </a>
                </button>
                </center>
              </div>
            </div>
          </div>`);
          if((i == (response.length - 1)) && response.length%2 != 0){
            for(let j = 0 ; j < response.length % 2; j++)
              $row.append('<div class="col"></div>');
          }
          i++;
      });
    }); 
} );
