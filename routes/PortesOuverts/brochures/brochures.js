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
	    connection.query("SELECT Downloadable.fileImage, Downloadable.fileLink, Downloadable.description FROM `Downloadable`", function(error, results, fields) {
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