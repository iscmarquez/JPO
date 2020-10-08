let express = require('express');
let formidable = require('formidable');
let fs = require('fs');

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
	let dateStart = request.body.dateInitial;
	let dateEnd = request.body.dateEnd;
	let eventName = request.body.eventName;
	let user = request.session.username;
	let sql = "INSERT INTO Event (startDate, endDate, idUser) VALUES (?,?,?);";
	connection.query(sql, [dateStart, dateEnd ,user], function (err, result) {
		if (err){
			console.error(err);
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

app.post('/inSpeaker', function(request, response) {
	try{
		if(!request.files){
			response.status(500).json({
				status : "Error",
				error: {
					"readyState" : 500,
						"status" : -1,
					"statusText" : "Invalid File"
				}
			})
			return;
		}
	
		let connection = require('db_integration'); 
		let name = request.body.name;
		let description = request.body.description;
		let user = request.session.username;
		var photoLink = request.path + '/' + request.files.file.name;
		
		var sql = "INSERT INTO Speaker (name, description, photoLink, idUser) VALUES (?,?,?,?);";
		connection.query(sql, [name, description , photoLink ,user], function (err, result) {
			if (err){
				response.status(500).json({
					status : "Error",
					error : {
						"readyState":err.code,
						"status":err.sqlState,
						"statusText":err.sqlMessage
					}
				});
				return;
			} 
			console.log('Result %s', result);
			request.files.file.mv(imagesPath + "/" + request.files.file.name, function(err){
				that.data.status = "Error";
				that.data.error = {
					"readyState":err.code,
					"status": -1,
					"statusText":err.errorMessage
				}
				return;	
			});
			response.status(200).json(data);
	
		});
		
	}catch(error){
		console.error(error);
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