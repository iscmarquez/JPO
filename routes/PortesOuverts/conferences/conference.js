
let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');
let setup = express();

var conferences = [];
var queryconf=[];
var tempdateNow="";
var tempdateEvent="";

let app =  express.Router();

// bodyParser Setup
setup.use(bodyParser.urlencoded({ extended: true }));
setup.use(bodyParser.json());
setup.use(cors());

app.get('/', (request, res) => {
    
    console.log("entrat" );
    console.log("pprueba" + request.session.idEvent);
    try{
        console.log("pprueba" + request.session.idEvent);
    let conexion = require('db_integration');
    conexion.query("select c.nameconference, c.linkconference, c.start, c.end, s.name, s.description,replace(photoLink, '#idSpeaker#', s.idSpeaker) as photoLink from conference  c inner join  speaker s  on c.idSpeaker = s.idSpeaker where c.idEvent = ?", [request.session.idEvent], (error, results, fields) => { // and event.startdate >= NOW()
        console.log(results);
        if(error){
            console.error(error);
            throw error;
        }
        console.log('Results : %s', JSON.stringify(results))
        return res.json(results);

    });}
    catch(Error ){
        console.error(Error);
    }
});



module.exports = app;