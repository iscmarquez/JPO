var express = require('express');
var path = require('path');

var app =  express.Router();

app.post('/', function(request, response) {
	
try{
    let connection = require('db_integration');
    var username = request.body.username;
    var email = request.body.email;
    var pwd = request.body.pwd;
    console.log(username);
    console.log(email);
    console.log(pwd);
    var sql = "update user set  password = ? where email = ? and username = ? ;";

    var query = connection.query(sql, [pwd, email,username], function (err, result) {
        if (err){
            throw(err);
        } 
        
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
    console.log(query.sql);
	return response.status(200).json({
        status : "success"
        
	});

});

module.exports = app;