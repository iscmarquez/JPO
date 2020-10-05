
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


app.get('/', (req, res, next) => {
    console.log(req.body);
    let conexion = require('@db_integration/db');
    conexion.query('select speaker.name, speaker.photolink, conference.linkconference, conference.nameconference, event.startdate from speaker left join conference on conference.idspeaker = speaker.idspeaker inner join event on conference.idevent = event.idevent and event.startdate >= NOW()', (error, results, fields) => {
        if(error)
            throw error;
    
        return res.json(results);

    });
});

app.get('/event', (req, res, next) => {
    // console.log(req.body);
    let conexion = require('@db_integration/db');
    conexion.query('select * from event', (error, results, fields) => {
        if(error)
            throw error;
        return res.json(results);
    });
});

app.get('/event/:eventId', (req, res, next) => {
    let conexion = require('@db_integration/db');
    const eventId = req.params.eventId; 
    //console.log(req.body);
    conexion.query(`select speaker.name, speaker.photolink, conference.linkconference,  conference.nameconference, event.startdate from speaker left join conference on conference.idspeaker = speaker.idspeaker inner join event on conference.idevent = event.idevent and event.idevent = ${eventId}`, (error, results, fields) => {
        if(error)
            throw error;
        return res.json(results);
    });
});

app.get('/event/eventId/:idspeaker', (req, res, next) => {
    const idspeaker = req.params.idspeaker;
    // console.log(req.body);
    let conexion = require('@db_integration/db');
    conexion.query(`select speaker.name from speaker left join conference on conference.idspeaker = speaker.idspeaker inner join event on conference.idevent = event.idevent and conference.idspeaker = ${idspeaker}`, (error, results, fields) => {
        if(error)
            throw error;
        return res.json(results);
    });
});

function CargarDatos(tempdateEvent){

    console.log(tempdateEvent);

    // for(const x in tempdateEvent){
    //     console.log(x);
    // }
    //console.log(tempdateNow);

}

module.exports = app;