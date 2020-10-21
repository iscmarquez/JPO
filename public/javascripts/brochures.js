$(document).ready(function (){
  
  $.ajax({
    "url": "/PortesOuverts/brochures/docs",
    "method": "GET",
    "timeout": 0,
  }).done(function (response) {
      console.log(response);
      const doc = $('#fichiers');
      response.forEach((item) => {
          console.log("fichiers" + item.photolink);

          doc.append(`<div class="col">
          <div class="card" style="margin-bottom: 20px; border-color: crimson; border-radius: 0;" >
          <img class="card-img-top" src="${item.fileImage}" alt="Image": ${item.fileImage} width="100" height="100"/>    
            <div class="card-body" >
              <p class="card-text" style="color: #162b65;">${item.description} 
              <br>
              <br>
              </p>              
              <a download class="btn" href="${item.fileLink}" >Télècharger</a>
            </div>
          </div>
        </div>`);
      });
    });
});
