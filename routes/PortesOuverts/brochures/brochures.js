var express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');
let setup = express();

let app =  express.Router();

setup.use(bodyParser.urlencoded({ extended: true }));
setup.use(bodyParser.json());
setup.use(cors());

app.get('/docs', function(request, response) {
    try{
        let connection = require('db_integration');
        //connection.query("select replace(fileimage, '#idFile#', iddownloadable) as fileimage, replace(filelink, '#idFile#', iddownloadable) as filelink, if(length(description)>=50, substring(downloadable.description,1,50), rpad(description, 50, '  ')) description from downloadable ", function(error, results, fields) {
        
	    connection.query("select replace(fileimage, '#idFile#', iddownloadable) as fileimage, replace(filelink, '#idFile#', iddownloadable) as filelink, downloadable.description description from downloadable ", function(error, results, fields) {
        console.log('Result %s', JSON.stringify(results));
        if(error)
            throw error;
        return response.json(results);
        });
    }
    catch(Err){
        console.error(Err);
   }
});

module.exports = app;