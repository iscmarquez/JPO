var express = require('express');
var path = require('path');

var app =  express.Router();

app.get('/', function(request, response) {
    try{
	let connection = require('db_integration');
	let chatquery=connection.query("select idspeaker, name, description, replace(photolink, '#idSpeaker#', idspeaker) as photolink, chat, linkchat from speaker where chat= true;", function(error, results, fields) {
	console.log('Result %s', JSON.stringify(results));
        if(error)
                throw error;
    return response.json(results);;
    });
    console.log(chatquery.sql);
}
catch(Err){
    console.error(Err);
}
});

module.exports = app;