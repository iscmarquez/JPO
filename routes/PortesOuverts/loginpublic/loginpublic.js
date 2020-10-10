const { Console } = require('console');
const { json } = require('express');
var express = require('express');
var path = require('path');

var app =  express.Router();

app.post('/', function(request, response) {
	let connection = require('db_integration');
		try{
		connection.query('SELECT idEvent FROM event where date_format(startDate,\'%Y-%m-%d\')  = date_format(now(),\'%Y-%m-%d\'); ', function(error, results, fields) {
			if (results && results.length > 0) {
				request.session.idEvent = results[0].idEvent;
				response.json(results);
			} else {
				request.session.idEvent = -1;
				connection.query('SELECT -1 "eventId" ,noEvent FROM configuration;', function(error, results, fields)  {
				response.json(results);
				});
			}			
		});
		
	}
	catch(Error ){
        console.error(Error);
    }
	
});

app.post('/loginpublic', function(request, response) {
	let connection = require('db_integration');
	var username = request.body.username;
	console.log(request.body.username);
	if (username ) {
		connection.query('SELECT * FROM inscription WHERE mail = ? ', [username], function(error, results, fields) {
			console.log('Result %s', results);
			if (results && results.length > 0) {
				request.session.loggedin = true;
				response.redirect('/PortesOuverts/conference.html');
			} else {
				response.send('Vous n etes pas inscrit');
			}			
		});
	} else {
		response.send('Veuillez donner l email avec vous avez s incrit!');
	}
});

module.exports = app;