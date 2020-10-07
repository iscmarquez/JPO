const { json } = require("express");

$( function() {
    $( ".login-form input[type=submit]" ).button();
    $( ".login-form input[type=submit]").click( function( event ) {
      event.preventDefault();
      $.ajax({
        type: POST,
        url: "/PortesOuvertsConfig/login/auth",
        data: {
            username: $( ".login-form input[name=username]").text(),
            password: $( ".login-form input[name=password]").text()
        },
        success: function(result){
            console.log(JSON.stringify);
        },
        dataType: 'json'
      });
    } );
  } );