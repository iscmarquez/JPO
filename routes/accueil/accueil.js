const { Console } = require('console');
const { json } = require('express');
var express = require('express');

var app =  express.Router();

app.get('/', function(request, response) {
	try{
		let connection = require('db_integration');
		console.log("äccueil");
        connection.query('SELECT linkVirtualVisit, linkFAQ, endMessage, welcomeTitle, welcomeSubTitle, welcomeText FROM Configuration;', (error, results) => { 
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