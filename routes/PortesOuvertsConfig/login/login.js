var express = require('express');
var path = require('path');

var app =  express.Router();

app.post('/auth', function(request, response) {
	let connection = require('db_integration');
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM user WHERE email = ? AND password = ?', [username, password], function(error, results, fields) {
			console.log('Result %s', results);
			if (results && results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/PortesOuvertsConfig/configuration.html');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
		});
	} else {
		response.send('Please enter Username and Password!');
	}
});

module.exports = app;