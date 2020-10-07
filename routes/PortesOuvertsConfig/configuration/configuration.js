var express = require('express');
var path = require('path');
var formidable = require('formidable'); 

var app =  express.Router();

app.post('/outGeneralConsult', function(request, response) {
	let connection = require('db_integration');
        connection.query('SELECT linkVirtualVisit, linkFAQ, endMessage, date, idUser FROM Configuration', (error, results) => { 
			if(error){
				response.json({
					error: error
				});
				return;
			}
			response.json(results);			
		});
	
});

app.post('/inGeneralConsult', function(request, response) {
	let connection = require('db_integration');
	console.log('Body %s', JSON.stringify(request.body));
	let virtualVisit = request.body.linkVirtualVisit;
    let faq = request.body.linkFAQ;
    let message = request.body.message;
	let username = request.session.username;
	
    var sql = "UPDATE  Configuration SET linkVirtualVisit = ?, linkFAQ = ?, endMessage = ? , date =now(), idUser = ?;";
    connection.query(sql, [virtualVisit, faq , message, username], function (err, result) {
        if (err){
			response.status(500).json(
				{
					"readyState":err.code,
					"status":err.sqlState,
					"statusText":err.sqlMessage
				}
			);
			return;
		}
		response.json({
			message: 'success'
		})			
	});
});

app.post('/inEvent', function(request, response) {
	let connection = require('db_integration');
    var dateStart = request.body.dateInitial;
    var dateEnd = request.body.dateEnd;
    let user = request.session.username;
    var sql = "INSERT INTO Event (startDate, endDate, idUser) VALUES (?,?,?);";
    connection.query(sql, [dateStart, dateEnd , message ,user], function (err, result) {
        if (err) throw err;
	    console.log('Result %s', results);
	    if (results && results.length > 0) {
		    request.session.loggedin = true;
		    request.session.username = username;
		    response.redirect('/static/configuration.html');
	    } else {
		    response.send('Incorrect Username and/or Password!');
	    }			
	});
});

app.post('/fileupload', function(request, response) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        res.write('File uploaded');
        res.end();
    });
});

app.post('/inSpeaker', function(request, response) {
	let connection = require('db_integration');
    var name = request.body.name;
    var description = request.body.description;
    let user = request.session.username;
    
    var sql = "INSERT INTO Speaker (name, description, photoLink, idUser) VALUES (?,?,?,?);";
    connection.query(sql, [name, description , photoLink ,user], function (err, result) {
        if (err) throw err;
	    console.log('Result %s', results);
	    if (results && results.length > 0) {
		    request.session.loggedin = true;
		    request.session.username = username;
		    response.redirect('/static/configuration.html');
	    } else {
		    response.send('Incorrect Username and/or Password!');
	    }			
	});
});

module.exports = app;