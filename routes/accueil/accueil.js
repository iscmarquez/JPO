const { Console } = require('console');
const { json } = require('express');
var express = require('express');

var app =  express.Router();

app.get('/', function(request, response) {
	try{
		let connection = require('db_integration');
		console.log("äccueil");
		//SELECT linkvirtualvisit, linkfaq, welcometitle, welcomesubtitle,welcometext, endmessage 'welcomtext2', noevent , video1, video2 'welcomtext3', date FROM configuration"
        connection.query("select linkvirtualvisit, linkfaq, endmessage, welcometitle, welcomesubtitle, welcometext, endmessage 'welcomtext2', noevent , video1, video2 'welcomtext3' from configuration;", (error, results) => { 
			console.log(results);
			if(error){
				response.json({
					error: error
				});
				return;
			}
			response.json(results);			
		});
					
	}catch(error){
		
		response.status(500).json(
			{
				"readyState":error.code,
				"status":error.sqlState,
				"statusText":error.sqlMessage
			}
		);		
	}
});


module.exports = app;