let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');
let setup = express();
const nodemailer = require('nodemailer');


let app =  express.Router();

// bodyParser Setup
setup.use(bodyParser.urlencoded({ extended: true }));
setup.use(bodyParser.json());
setup.use(cors());


app.post('/User', (req, res, next) => {
    const emailId = req.body;
    console.log(emailId);
    let connection = require('db_integration');
    try{
        connection.query(`select user.email, user.password from user where user.username = '${emailId.username}' and user.email = '${emailId.email}'`, (error, results, fields) => {
        console.log(JSON.stringify(results));
          if(error){
          throw error;
          return res.json({ 
              success: false,
              message: "Erreur : L'inscription n'a pas été insérée dans la base de données"
          });
        }
        else{
            if(Object.entries(results).length===0){
            return res.json({ 
                success: false,
                message: "Erreur : L'inscription n'a pas été insérée dans la base de données"
              });
          }
          else{
          var emailClient = results[0].email;
          var passwordClient = results[0].password;
  
          connection.query(`select * from nodemailer`, (error, results, fields) => {
            if(error){
              throw error;
              return res.json({ 
                  success: false,
                  message: "Erreur : L'inscription n'a pas été insérée dans la base de données"
              });
            }
            else{
                try{
                var service = results[0].service;
                var user = results[0].user;
                var pass = results[0].pass;
                var from = results[0].from;
                var subject= results[0].subject;
                var text = results[0].text;
                // nous créons l'objet de transport
                console.log(results);
                var transporter = nodemailer.createTransport({
                  service: service,
                  auth: {
                    user: user, 
                    pass: pass, 
                  }
                });
                var mailOptions = {
                  from: from, 
                  to: emailClient,
                  subject: subject, 
                  text: text + passwordClient
                };
                  transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('e-mail envoyé: ' + info.response);
                  }
                });       
                return res.json({        
                  success: true,
                  message: "Le succès : Le mot de passe a été envoyée avec succès à l'adresse électronique enregistrée."
              });}
              catch(Err){
                console.error(Err);
                return res.json({ 
                    success: false,
                    message: "Le succès : Le mot de passe a été envoyée avec succès à l'adresse électronique enregistrée."
                });}
            }
      });
      }
      }
    });
  }
  catch(Err){
      console.error(Err);
      res.status(500).json(
        {
        "readyState":Err.code,
        "status":Err.sqlState,
        "statusText":Err.sqlMessage
        }
      );
  } 
  });
  module.exports = app;