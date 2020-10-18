
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
  
            events.append(`<article class="col">
            <div class="card">
                <div class="card-header">${item.name}</div>
                <div class="card-body">
                    <img class="card-img" src= "${item.photoLink}" alt="Conferencista: ${item.name}" width="200" height="250"/>
                  <p>${item.description}</p>
                  <a class="btn btn-warning" href="chat.html?linkchat=${item.linkchat}">Chat</a>
                </div>
              </div>
          </article>`);
        });
      }); 
  } );