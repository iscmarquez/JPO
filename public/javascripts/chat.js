
  $(document).ready(function (){

    $.ajax({
      "url": "/PortesOuverts/chat",
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
              <img class="card-img-bottom" src="${item.photolink}" alt=${item.name}>
              <div class="card-body">
                <p class="card-text" style="color: #162b65;">${item.name}</p>
                <p class="card-text" style="color: #162b65;">${item.description}</p>                
                <a href="chat.html?linkchat=${item.linkchat}" class="btn">Chat</a>
              </div>
            </div>
          </div>`);
        });
      }); 
  } );
