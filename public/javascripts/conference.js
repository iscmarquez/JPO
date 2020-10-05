$(document).ready(function (){

    const getEvents = () => {
        var settings = {
            "url": "http://localhost:3000/event",
            "method": "GET",
            "timeout": 0,
          };
          
          $.ajax(settings).done(function (response) {
            console.log(response);
            const events = $('#events');
            response.forEach((item) => {
                events.append(`<li>${item.idEvent} - ${item.startDate} - ${item.endDate} - ${item.idUser}</li>`);
            });
          });
    }

    getEvents();

    const getOneEvents = (eventId) => {
        var settings = {
            "url": `http://localhost:3000/event/${eventId}`,
            "method": "GET",
            "timeout": 0,
          };
          
          $.ajax(settings).done(function (response) {
            console.log(response);
            const events = $('#cardsContainer');
            response.forEach((item) => {
                events.append(`<article class="col">
                <div class="card">
                  <div class="card-header">${item.nomconference}</div>
                  <div class="card-body">
                      <p>${formatDate(item.startdate)}</p>
                      <img class="card-img" src="${item.photolink}" alt="Conferencista: ${item.name}"/> 
                      <!--<img src="../../PortesOuvertes/Backend/images/garcon.png" alt="Conferencista: ${item.name}"/> -->
                    <p>${item.name}</p>
                    <a class="btn btn-warning" href="${item.linkconference}">Participer</a>
                  </div>
                </div>
              </article>`);
            });
          });
    }

    getOneEvents('202001');

    function formatDate(dateString){
        const options = { year: "numeric", month: "long", day: "numeric" }
        return new Date(dateString).toLocaleDateString(undefined, options)
      }

   

  
});


// function cargarUsuarios(){
//     fetch('http://localhost:3000/event/202002')
//     .then(respuesta=>respuesta.json())
//     .then(respuesta=>console.log(respuesta))
// }