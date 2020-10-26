
  $(document).ready(function (){

    $.ajax({
      "url": "/PortesOuverts/chat",
      "method": "GET",
      "timeout": 0,
    }).done(function (response) {
        console.log(response);
        const events = $('#cardsContainer');
        var i = 0;
        var $row = null;        
        response.forEach((item) => {
            console.log("linkphoyto" + item.photolink);
            if(i % 3 == 0){
              $row = $('<div class="row" style="padding:20px;"></div>');
              events.append($row);
          }

          $row.append(`
                <div class="col">
                  <div class="card" style="margin-bottom: 20px; border-color: crimson;">
                      <img class="card-img-top" src="${item.photolink}" alt="${item.name}">
                      <div class="card-body">
                          <h4 class="card-title">${item.name}</h4>
                          <p class="card-text">${item.description}
                            <br>
                            <br>
                          </p>
                          <center>
                          <button class="btn bouton-rouge-small" style=" margin-top: 15px;">
                          <a href="chat.html?linkchat=${item.linkchat}" class="btn">
                            <p class="blanc"><strong>Clavarder</strong></p>
                          </a>
                          </button>                          
                          </center>
                      </div>
                  </div>
                </div>          
          `);

          if((i == response.length -1) && (response.length % 3 != 0)){
            for(let j = 0; j < (response.length % 3); j++){
                $row.append('<div class="col"></div>');
            }
        }
        i++;          
        });
      }); 
  } );
