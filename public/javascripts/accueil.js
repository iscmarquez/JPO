$(document).ready(function (){
    $.ajax({
      "url": "/PortesOuverts/accueil",
      "method": "GET",
      "timeout": 0,
    }).done(function (response) {
      console.log("Response : " + JSON.stringify(response));
     
          $("#visitevirtuelle").attr('href',response[0].linkVirtualVisit);
          $("#faq").attr('href',response[0].linkFAQ);
          $("#welcomeText").append(response[0].welcomeText);
          $("#title").append(response[0].welcomeTitle);
          $("#subtitle").append(response[0].welcomeSubTitle);
         
      
    }); 
} );