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
          var des = item.description;
          
          if(i % 4 == 0){
              $row = $('<div class="row" style="padding:20px; margin: 10px;"></div> ');
              doc.append($row);
          }

          $row.append(`
          <div class="col">
            <div class="card" style="margin-bottom: 20px; border-top: solid 4px crimson ; border-bottom: 0; border-left: 0; border-right:0;">
                <img class="card-img-top" src="${item.fileimage}" alt="Image": ${item.fileimage}>
                <div class="card-body">
                
                 <center>
                    <button class="btn bouton-rouge-small" style=" margin-top: 10px; ">
                    <a download  href="${item.filelink}" style="text-decoration: none;">
                      <p class="blanc" ><strong>télécharger</strong></p>
                    </a>
                    </button>
                    <br>
                    <p class="card-text" style="padding-top:15px">${des}</p>
                    </center> 
                    
                </div>
            </div>
          </div>         
          `);

        if((i == response.length -1) && (response.length % 4 != 0)){
          for(let j = response.length % 4; j < 4; j++){
                $row.append('<div class="col"></div>');
            }
        }
        i++;
      });
    });
});
