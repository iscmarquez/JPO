$(document).ready(function (){
    $.ajax({
      "url": "/PortesOuverts/accueil",
      "method": "GET",
      "timeout": 0,
    }).done(function (response) {
      console.log("Response : " + JSON.stringify(response));
     
          $("#visitevirtuelle").attr('href',response[0].linkvirtualvisit);
          $("#faq").attr('href',response[0].linkfaq);
          $("#welcomeText").append(response[0].welcometext);
          $("#welcomeText2").append(response[0].endmessage);
          $("#title").append(response[0].welcometitle);
          $("#subtitle").append(response[0].welcomesubtitle);
          $("#video1").attr('src',response[0].video1);
          $("#video2").attr('src',response[0].video2);
         
      
    }); 
} );