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
            $row = $('<div class="row" style="padding:20px; margin: 10px; "></div>');
            events.append($row);
          }
          $row.append(`
          <div class="col">
            <div class="card" style="margin-bottom: 20px;border-top: solid 4px crimson ; border-bottom: 0; border-left: 0; border-right:0;">
              <img class="card-img-bottom" src="${item.photolink}" alt=${item.nameconference}>
              <center>
              <button class="btn bouton-rouge-small" style=" margin-top: 20px;">
                <a href="${item.linkconference}" class="btn" target="_blank">
                  <p class="blanc"><strong>Participer</strong></p>
                </a>
                </button>
               
              <div class="card-body">
                <h4 class="card-title" style="color: #162b65;">${item.nameconference}</h4>
                <p class="card-text" style="color: #162b65;">${item.name}</p>
                <p class="card-text" style="color: #162b65;">${item.description}</p>
                <p style="color: crimson; font-size:smaller;">${item.start} - ${item.end}</p>
                </div> 
              </center> 
                
              
              
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
