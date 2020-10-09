
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
    try{console.log("pprueba" + request.session.id);
    let conexion = require('db_integration');
    conexion.query('select c.nameConference, c.linkConference, c.start, c.end, s.name, s.description, s.photoLink from conference  c inner join  speaker s  on c.idSpeaker = s.idSpeaker where c.idEvent = ?', [request.session.idEvent], (error, results, fields) => { // and event.startdate >= NOW()
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
/*
app.get('/', (req, res, next) => {
    console.log(req.body);
    let conexion = require('db_integration');
    conexion.query('select speaker.name, speaker.photolink, conference.linkconference, conference.nameconference, event.startdate from speaker left join conference on conference.idspeaker = speaker.idspeaker inner join event on conference.idevent = event.idevent', (error, results, fields) => { // and event.startdate >= NOW()
        if(error){
            console.error(error);
            throw error;
        }
        console.log('Results : %s', JSON.stringify(results))
        return res.json(results);

    });
});*/

app.get('/event', (req, res, next) => {
    console.log(req.body);
    let conexion = require('db_integration');
    conexion.query('select * from event', (error, results, fields) => {
        if(error)
            throw error;
        return res.json(results);
    });
});

app.get('/event/:eventId', (req, res, next) => {
    let conexion = require('db_integration');
    const eventId = req.params.eventId; 
    console.log(req.body);
    conexion.query(`select speaker.name, speaker.photolink, conference.linkconference,  conference.nameconference, event.startdate from speaker left join conference on conference.idspeaker = speaker.idspeaker inner join event on conference.idevent = event.idevent and event.idevent = ${eventId}`, (error, results, fields) => {
        if(error)
            throw error;
        return res.json(results);
    });
});

app.get('/event/eventId/:idspeaker', (req, res, next) => {
    const idspeaker = req.params.idspeaker;
    console.log(req.body);
    let conexion = require('db_integration');
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