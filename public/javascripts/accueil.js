$(document).ready(function (){
    $.ajax({
      "url": "/PortesOuverts/accueil",
      "method": "GET",
      "timeout": 0,
    }).done(function (response) {
      console.log("Response : " + JSON.stringify(response));
          
          $("#title").append(response[0].welcometitle);
          $("#subtitle").append(response[0].welcomesubtitle);
          $("#welcomeText").append(response[0].welcometext);
          $("#welcomeText2").append(response[0].welcomtext2);
          $("#welcomeText3").append(response[0].welcomtext3);
          $("#video1").attr('src',response[0].video1);
          
          $("#visitevirtuelle").attr('href',response[0].linkvirtualvisit);
          $("#faq").attr('href',response[0].linkfaq);
          
          
         
         
          
          $("#video2").attr('src',response[0].video2);
         
      
    }); 
} );