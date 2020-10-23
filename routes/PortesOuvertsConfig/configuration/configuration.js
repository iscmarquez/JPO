let express = require('express');
let fs = require('fs');
let path = require('path');

var app =  express.Router();

app.get('/outGeneralConsult', function(request, response) {
	let connection = require('db_integration');
        connection.query('SELECT linkvirtualvisit, linkfaq, welcometitle, welcomesubtitle,welcometext, endmessage, noevent , video1, video2, date FROM configuration', (error, results) => { 
			console.log(results);
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
	let welcomeTitle = request.body.welcomeTitle;
	let welcomeSubTitle = request.body.welcomeSubTitle;
	let welcomeText = request.body.welcomeTexte;
	let welcomeText2 = request.body.welcomeText2;//sera stockeé en endmessage
	console.log(JSON.stringify(request.body));
	let video1 = request.body.video1;
	let video2 = request.body.video2;
	console.log("welcomeTitle" + welcomeTitle);
	console.log("welcomeSubTitle" + welcomeSubTitle);
    var sql = "update  configuration set linkvirtualvisit = ?, linkfaq = ?, endmessage = ? , welcometitle = ?,  welcomesubtitle = ?, welcometext = ?,  video1 = ?, video2= ? , date =now() ;";
   
	var query = connection.query(sql, [virtualVisit, faq , welcomeText2, welcomeTitle, welcomeSubTitle, welcomeText, video1, video2 ], function (err, result) {
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
	console.log(query.sql);
});

app.post('/inEvent', function(request, response) {
	let connection = require('db_integration');
	let dateStart = request.body.dateInitial;
	let eventName = request.body.eventName;
	let user = request.session.username;
	let sql = "insert into event (startdate, nomevent, date) VALUES (?,?,now());";
	connection.query(sql, [dateStart, eventName ], function (err, result) {
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


app.get('/inEvent', function(request, response) {
	try{
		let connection = require('db_integration');
		
        connection.query('select idevent, date_format(startdate,\'%Y-%m-%d\') startdate , nomevent from event order by startdate desc', (error, results) => { 
			
			if(error){
				response.status(500).json({
					"readyState":error.code,
					"status":error.sqlState,
					"statusText":error.sqlMessage
				});
				return;
			}
			response.status(200).json(results);			
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

app.put('/inEvent', function(request, response) {
	console.log("put in event  %s" , JSON.stringify(request.body));
	let connection = require('db_integration');
	let eventId = request.body.idEventUpdate;
	let dateStart = request.body.dateInitial;
	let eventName = request.body.eventName;
	let user = request.session.username;
	console.log(eventId);
	let sql = "update event set startdate = date_format(?,\'%Y-%m-%d\'), nomevent = ?, date = now() where idevent = ? ;";
	let query = connection.query(sql, [dateStart, eventName , eventId ], function (err, result) {
		console.log(result);
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
	console.log(query.sql);
});

app.delete('/inEvent', function(request, response) {
	console.log("delete in event");
	let connection = require('db_integration');
	let eventId = request.body.idEventUpdate;	
	console.log("delete in event" + eventId);
	let sql = "delete from event where idevent = ? ;";
	connection.query(sql, [eventId ], function (err, result) {
		
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

//Methods speaker

app.get('/inSpeaker', function(request, response) {
	try{
		let connection = require('db_integration');
        connection.query("select idspeaker, name, description, replace(photoLink, '#idSpeaker#', idspeaker) as photolink, chat, linkchat, date from speaker", (error, results) => { 
			if(error){
				response.json({
					error: error
				});
				return;
			}
			response.json(results);			
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
		let chat = request.body.chat;
		let user = request.session.username;
		let linkchat = request.body.linkchat;
		let fileName = request.files.file.name;
		
		let imageName = "photo." + fileName.substr(fileName.indexOf(".") + 1);
		let photoLink = '/images/speaker/#idSpeaker#/' + imageName;
		
		let sql = "insert into speaker (name, description, photoLink, chat, linkchat, date) VALUES (?,?,?,?,?,now());";
		
		connection.query(sql, [name, description , photoLink , JSON.parse(chat), linkchat], function (err, result) {
			if (err){
				console.error(err);
				throw (err);
			}
			console.log('Result %s', JSON.stringify(result));

			let pathDir = path.resolve(imagesPath + "/speaker/"+ result.insertId + "/");
			if(!fs.existsSync(pathDir)){
				fs.mkdirSync(pathDir);
			}

			request.files.file.mv(imagesPath + "/speaker/"+ result.insertId + "/" + imageName, function(err){
				if(err){
					console.error(err);
					throw (err);
				}
			});
		});

	}catch(error){
		console.log("ERROR => ");
		console.error(error);
		return response.status(500).json(
			{
				"readyState":error.code,
				"status":error.sqlState,
				"statusText":error.sqlMessage
			}
		);		
	}

	return 	response.status(200).json({
		status : "success"
	});
});

app.put('/inSpeaker', function(request, response) {
	try{
		let connection = require('db_integration'); 
		let idSpeaker = request.body.idSpeaker;
		let name = request.body.name;
		let description = request.body.description;
		let chat = request.body.chat;
		let linkchat = request.body.linkchat;
		let user = request.session.username;


		let fileName = request.files != null ? request.files.file.name : null;
		let imageName = fileName != null ? "photo." + fileName.substr(fileName.indexOf(".") + 1) : null;
		const photoLink = request.files ? '/images/speaker/#idSpeaker#/' + imageName : null;
		var sql = "update speaker set name = ?, description = ?," + (request.files ? " photoLink = '" + photoLink + "' ," : "")  + "chat = " + chat + ",  linkchat = ?, date = now() where idspeaker = ? ;";

		var query = connection.query(sql, [name, description ,   linkchat, idSpeaker], function (err, result) {
			if (err){
				throw(err);
			} 
			if(request.files){
				request.files.file.mv(imagesPath + "/speaker/"+ idSpeaker + "/" + imageName, function(err){
					if(err){
						throw (err);
					}
				});
			}
		});
		console.log(query.sql);
	}catch(error){
		console.error(error);
		return response.status(500).json(
			{
				"readyState":error.code,
				"status":error.sqlState,
				"statusText":error.sqlMessage
			}
		);		
	}
	return response.status(200).json({
		status : "success"
	});
});

app.delete('/inSpeaker', function(request, response) {
	
		let connection = require('db_integration');
		console.log("ID Speaker to delete : %s", request.body.idSpeaker);
        connection.query('delete from speaker where idspeaker = ?', [request.body.idSpeaker], (error, results) => { 
			console.log(results);
			if(error){
				response.status(500).json({
					"readyState":error.code,
					"status":error.sqlState,
					"statusText":error.sqlMessage
				});
				return;
			}
			response.status(200).json({
				status : "success"
			});			
		});
		
	
});


app.get('/outSpeakerDdl', function(request, response) {
	try{
		let connection = require('db_integration');
        connection.query('select idSpeaker, name from speaker', (error, results) => { 
			console.log("ddl" + JSON.stringify(results));
			if(error){
				response.json({
					error: error
				});
				return;
			}
			response.json(results);			
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

app.get('/outEvents', function(request, response) {
	try{
		let connection = require('db_integration');
		console.log("outEvents- eventos disponibles");
        connection.query('select idevent, date_format(startdate,\'%Y-%m-%d\') date from event	where  date_format(startdate,\'%Y-%m-%d\') >= date_format(now(),\'%Y-%m-%d\') ;', (error, results) => { 
			if(error){
				response.json({
					error: error
				});
				return;
			}
			response.json(results);			
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

app.get('/Events', function(request, response) {
	try{
		let connection = require('db_integration');
		console.log("Events- eventos disponibles");
        connection.query('select idevent, date_format(startDate,\'%Y-%m-%d\') date from event	 ;', (error, results) => { 
			if(error){
				response.json({
					error: error
				});
				return;
			}
			response.json(results);			
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


app.post('/inConference', function(request, response) {
	try{
	let connection = require('db_integration');
	let nameConference = request.body.nameConference;
	let event = request.body.event;
    let init = request.body.init;
	let end = request.body.end;
	let link = request.body.link;
	let speaker = request.body.speaker;
	let username = request.session.username;
	
	

    var sql = "insert into  conference(nameconference, idevent, idspeaker, start, end, linkconference, date) values(?,?,?,?,?,?,now()) ;";
    connection.query(sql, [nameConference,event,speaker, init , end, link ], function (err, result) {
		console.log("response " + result);
		if (err){
			console.log("error " + err);
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
	}
	catch(Err)
	{
		console.error(Err);
	}

});


app.get('/inConference', function(request, response) {
	try{
		let connection = require('db_integration');
		
        connection.query('select idconference,  nameconference, speaker.name, start, end, linkconference, conference.idspeaker , conference.idevent from conference inner join speaker on conference.idspeaker = speaker.idspeaker order by conference.start asc  ;		', (error, results) => { 
			
			if(error){
				response.status(500).json({
					"readyState":error.code,
					"status":error.sqlState,
					"statusText":error.sqlMessage
				});
				return;
			}
			response.status(200).json(results);			
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


app.delete('/inConference', function(request, response) {
	
	let connection = require('db_integration');
	console.log("ID conference to delete : %s", request.body.idConference);
	connection.query('delete from conference where idconference = ?', [request.body.idConference], (error, results) => { 
		console.log(results);
		if(error){
			response.status(500).json({
				"readyState":error.code,
				"status":error.sqlState,
				"statusText":error.sqlMessage
			});
			return;
		}
		response.json({
			message: 'success'
		})			
	});
	

});

app.put('/inConference', function(request, response) {
	try{
	let connection = require('db_integration');
	let idConference = request.body.idConference;
	let nameConference = request.body.nameConference;
	let event = request.body.event;
    let init = request.body.init;
	let end = request.body.end;
	let link = request.body.link;
	let speaker = request.body.speaker;
	let username = request.session.username;
	
	console.log("idConference "+ nameConference);
	
    var sql = "update  conference set nameconference=?, idevent=?, idspeaker=?, start=?, end=?, linkconference=?, date=now() where idconference=? ;";
    let con = connection.query(sql, [nameConference,event,speaker, init , end, link, idConference ], function (err, result) {
		if (err){
			console.log("error " + err);
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
	console.log("update "+ con);

	}
	catch(Err)
	{
		console.error(Err);
	}

});


app.get('/File', function(request, response) {
	try{
		console.log("file get");
		let connection = require('db_integration');
        connection.query("select iddownloadable, fileimage, filelink, description from downloadable;", (error, results) => { 
			if(error){
				response.json({
					error: error
				});
				return;
			}
			response.json(results);			
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

app.post('/File', function(request, response) {
	
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
		let description = request.body.description;
		let fileName = request.files.file.name;
		let fileImage = request.files.image.name;
		let user = request.session.username;
		
		
		let fileLink = '/documents/files/' + fileName;
		let imageLink = '/documents/filesImages/' + fileImage;
		
		let sql = "insert into downloadable (description, fileImage, fileLink, date) values (?,?,?,now());";
		
		connection.query(sql, [description, imageLink , fileLink], function (err, result) {
			if (err){
				console.error(err);
				throw (err);
			}
			console.log('Result %s', JSON.stringify(result));



			request.files.file.mv(documentsPath + "/files/" + fileName, function(err){
				if(err){
					console.error(err);
					throw (err);
				}
			});

			request.files.image.mv(documentsPath + "/filesImages/" + fileImage, function(err){
				if(err){
					console.error(err);
					throw (err);
				}
			});

		});

	}catch(error){
		console.log("ERROR => ");
		console.error(error);
		return response.status(500).json(
			{
				"readyState":error.code,
				"status":error.sqlState,
				"statusText":error.sqlMessage
			}
		);		
	}

	return 	response.status(200).json({
		status : "success"
	});
});


app.delete('/File', function(request, response) {
	try{
		let connection = require('db_integration');
		console.log("ID Speaker to delete : %s", request.body.idFile);
        connection.query('delete from downloadable where iddownloadable = ?', [request.body.idFile], (error, results) => { 
			console.log(results);
			if(error){
				throw(error);
			}
		});
	}catch(err){
		return response.status(500).json({
			"readyState":error.code,
			"status":error.sqlState,
			"statusText":error.sqlMessage
		});

	}
		
	return response.status(200).json({status : "success"});			

});


module.exports = app;