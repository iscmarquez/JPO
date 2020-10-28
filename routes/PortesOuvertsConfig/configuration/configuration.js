let express = require('express');
let fs = require('fs');
let path = require('path');
let excel = require('exceljs')

var app =  express.Router();

app.get('/outGeneralConsult', function(request, response) {
	let connection = require('db_integration');
        connection.query("SELECT linkvirtualvisit, linkfaq, welcometitle, welcomesubtitle,welcometext, endmessage 'welcomtext2', noevent , video1, video2 'welcomtext3', date FROM configuration", (error, results) => { 
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
	let welcomeText3 = request.body.welcomeText3;//sera stockeé en video2
	console.log(JSON.stringify(request.body));
	let video1 = request.body.video1;
	
	console.log("welcomeTitle" + welcomeTitle);
	console.log("welcomeSubTitle" + welcomeSubTitle);
    var sql = "update  configuration set linkvirtualvisit = ?, linkfaq = ?, endmessage = ? , welcometitle = ?,  welcomesubtitle = ?, welcometext = ?,  video1 = ?, video2= ? , date =now() ;";
   
	var query = connection.query(sql, [virtualVisit, faq , welcomeText2, welcomeTitle, welcomeSubTitle, welcomeText, video1, welcomeText3 ], function (err, result) {
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
        connection.query("select iddownloadable, replace(fileimage, '#idFile#', iddownloadable) as fileimage, replace(filelink, '#idFile#', iddownloadable) as filelink, description from downloadable;", (error, results) => { 
			if(error){
				throw(error);
			}
			return response.status(200).json(results);			
		});
		
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
		
		
		let fileLink = '/documents/#idFile#/files/' + fileName;
		let imageLink = '/documents/#idFile#/filesImages/' + fileImage;

		
		
		let sql = "insert into downloadable (description, fileImage, fileLink, date) values (?,?,?,now());";
		
		connection.query(sql, [description, imageLink , fileLink], function (err, result) {
			if (err){
				console.error(err);
				throw (err);
			}

			fs.mkdirSync(documentsPath + "/" +  result.insertId);
			fs.mkdirSync(documentsPath + "/" +  result.insertId + "/files/");
			fs.mkdirSync(documentsPath + "/" +  result.insertId + "/filesImages/");
			
			request.files.file.mv(documentsPath + "/" +  result.insertId + "/files/" + fileName, function(err){
				if(err){
					console.error(err);
					throw (err);
				}
			});

			request.files.image.mv(documentsPath+ "/" +  result.insertId + "/filesImages/" + fileImage, function(err){
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

app.put('/File', function(request, response) {
	
	try{
		let connection = require('db_integration'); 
		let description = request.body.description;
		let idFile = request.body.idFile;
		let user = request.session.username;

		let isFileLinkUpdated = request.files && request.files.file ;
		let isImageUpdated = request.files && request.files.image ;
		
		let sql = "UPDATE downloadable SET " + (isFileLinkUpdated ? " filelink = '" + '/documents/#idFile#/files/' +  request.files.file.name + "', " : "") + (isImageUpdated? " fileimage = '" + '/documents/#idFile#/filesImages/' + request.files.image.name + "'," : "") + " description = ?, date =now() WHERE iddownloadable = ?;";
		
		connection.query(sql, [description , idFile], function (err, result) {
			if (err){
				console.error(err);
				throw (err);
			}
			console.log('Result %s', JSON.stringify(result));
			
			if(!fs.existsSync(documentsPath + "/" +  idFile))
				fs.mkdirSync(documentsPath + "/" +  idFile);

			if(isFileLinkUpdated){
				if (!fs.existsSync(documentsPath + "/" +  idFile + "/files/"))
					fs.mkdirSync(documentsPath + "/" +  idFile + "/files/");
				request.files.file.mv(documentsPath + "/" +  idFile + "/files/" + request.files.file.name, function(err){
					if(err){
						console.error(err);
						throw (err);
					}
				});			
			}
				
			if(isImageUpdated ){
				if(!fs.existsSync(documentsPath + "/" +  idFile + "/filesImages/"))
					fs.mkdirSync(documentsPath + "/" +  idFile + "/filesImages/");
				request.files.image.mv(documentsPath+ "/" +  idFile + "/filesImages/" + request.files.image.name, function(err){
					if(err){
						console.error(err);
						throw (err);
					}
				});
			}

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

			fs.rmdirSync(documentsPath + "/" +  request.body.idFile, { recursive: true });
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


app.post('/reportIns', (request, response) => {
	let connection = require('db_integration');
    const dateReport = request.body;
    const debut = request.body.dateInitialIns;
    console.log(debut)
    const fin = request.body.dateFinIns;
    console.log(fin)
  
    let resultsQry1;
    let query = connection.query(`select inscription.date, inscription.lastname, inscription.firstname, inscription.phone, inscription.mail, inscription.country, inscription.state, program.programdescription , inscription.moyencommunication from inscription left join interestingprogrammes on inscription.mail = interestingprogrammes.mail inner join program on interestingprogrammes.idprogram = program.idprogram where inscription.date >= '${debut}' and inscription.date <= '${fin}'`, (error, results, fields) => {

        if(error){
            throw error;
            return response.json({
                success: false,
                message: "Erreur : erreur dans le serveur!!!"
            });
        }
        else{
            if(Object.entries(results).length===0){
                return response.json({ 
                    success: false,
                    message: "Erreur : il n'y a pas d'informations relatives aux dates saisies."
                  });
              }
              else{
            resultsQry1 = results;
            console.log(resultsQry1);

            connection.query(`select count(idguests) as nombre from guests where dateadmission >= '${dateReport.debut}' and dateadmission <= '${dateReport.fin}'`, (error, results, fields) => {
                if(error){
                    throw error;
                    return response.json({ 
                        success: false,
                        message: "Erreur : "
                    });
                 }
                 else{
					let workbook = new excel.Workbook(); // pour creer un nouveaux fichier excel 

                    if (typeof debut !== 'undefined' && debut !== null && debut !=="M-DD-YY-Y-"&&
                            	typeof fin !== 'undefined' && fin !== null && fin !=="M-DD-YY-Y-") {
                                
                                let worksheet = workbook.addWorksheet('inscription') // pour creer une nouvelle page 
                                worksheet.columns = [                                // creer les titres et les colomnes 
                                  {header: 'date', key: 'date'},                     // donner un nom aux titres 
                                  {header: 'Nom', key: 'lastname'},
                                  {header: 'Prenom', key: 'firstname'},
                                  {header: 'Telephone', key: 'phone'},
                                  {header: 'Mail', key: 'mail'},
                                  {header: 'Pays', key: 'country'},
                                  {header: 'Province', key: 'state'},
                                  {header: 'Programme', key: 'programdescription'},
                                  {header: 'Moyen de Communication', key: 'moyencommunication'}
                                ];
                                worksheet.columns.forEach(column => {            //gerer la taille des colonnes
                                    column.width = column.header.length < 12 ? 12 : column.header.length //si la taille du titre est plus grand que 12 on lui donne la taille de la colonne
                                });
                                worksheet.getColumn("E").width = 25;    // changer manuellement la taille de la colonne
                                worksheet.getColumn("H").width = 50;   // pareil
                                const cell2 = worksheet.getCell('K1');   // mettre une cellule dans une variable par exemple ici la cellule K1
                                cell2.value = "Nombre d'invités";        // change la valeur de la cellule 
                                worksheet.getRow(1).font = {bold: true}; // modifie le style de caracthere de toute la rangee 1
                                // Dump all the data into Excel
                                resultsQry1.forEach((e, index) => {       //place les information de la base de donnee dans le classeur
                                // row 1 is the header.
                                    const rowIndex = index + 2
                                    worksheet.addRow({
                                        ...e,
                                      });
                                });                                  // fin du placement des donnees
                                const cell = worksheet.getCell('K2');
                                cell.value = results[0].nombre; //ici nombre vaut le nombre de guests 
                                //workbook.xlsx.writeFile('Rapport Inscription '+debut+' à '+fin+'.xlsx'); // ecrit le classeur avec la date de debut et de fin dans le nom
                            }
    
							response.setHeader(
								"Content-Type",
								"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
								);
							response.setHeader(
								"Content-Disposition",
								"attachment; filename=report_inscriptions.xlsx"
								);
							  
							return workbook.xlsx.write(response).then(function () {
								response.status(200).end();
								});
                 }
         });
        }
    }
	});
	console.log('QUERY : %s', query.sql);
});


module.exports = app;