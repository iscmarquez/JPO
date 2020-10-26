$(document).ready(function (){
  
  $.ajax({
    "url": "/PortesOuverts/brochures/docs",
    "method": "GET",
    "timeout": 0,
  }).done(function (response) {
      console.log(response);
      const doc = $('#fichiers');
      var i = 0;
      var $row = null;
      response.forEach((item) => {
          console.log("fichiers" + item.photolink);
          if(i % 4 == 0){
              $row = $('<div class="row" style="padding:20px;"></div>');
              doc.append($row);
          }

          $row.append(`
          <div class="col">
            <div class="card" style="margin-bottom: 20px; border-color: crimson;">
                <img class="card-img-top" src="${item.fileimage}" alt="Image": ${item.fileimage}>
                <div class="card-body">
                    <p class="card-text">${item.description}</p>
                    <center>
                    <button class="btn bouton-rouge-small" style=" margin-top: 15px;">
                    <a download  href="${item.filelink}" style="text-decoration: none;">
                      <p class="blanc" ><strong>télécharger</strong></p>
                    </a>
                    </center>
                    </button>
                </div>
            </div>
          </div>         
          `);

        if((i == response.length -1) && (response.length % 4 != 0)){
            for(let j = 0; j < (response.length % 4); j++){
                $row.append('<div class="col"></div>');
            }
        }
        i++;
      });
    });
});
