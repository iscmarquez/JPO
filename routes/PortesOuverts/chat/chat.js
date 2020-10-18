var express = require('express');
var path = require('path');

var app =  express.Router();

app.get('/', function(request, response) {
    try{
	let connection = require('db_integration');
	connection.query("SELECT idSpeaker, name, description, REPLACE(photoLink, '#idSpeaker#', idSpeaker) as photoLink, chat, linkchat, idUser FROM Speaker WHERE chat= true;", function(error, results, fields) {
	console.log('Result %s', JSON.stringify(results));
        if(error)
                throw error;
    return response.json(results);;
    });
}
catch(Err){
    console.error(Err);
}
});

module.exports = app;