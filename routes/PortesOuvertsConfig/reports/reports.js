let express = require('express'); //EMM
var http = require('http');
var formidable = require('formidable');
//var mysql = require('mysql'); EMM
var fs = require('fs');
var excel = require('exceljs');
const { Console } = require('console');
//var express = require('express') EMM
//const app = express() emm
var page;
var page2;
var debut;
var fin;
var donnee;
var donnee1;


let app =  express.Router();

app.post('/myaction', (req, res) => {
    try{
        var form = new formidable.IncomingForm();
    
        fs.readFile("rapportInscription.html", function (err, data) {
          page2 = "<script>";
          form.parse(req, function (err, fields1, files) {
             
              let connection = require('db_integration');
              console.log(fields1.debut);
                  console.log(fields1.fin);
                  var sql = "Select Inscription.date, Inscription.lastName, Inscription.firstName, Inscription.phone, Inscription.mail, Inscription.country, Inscription.state, Program.programDescription , Inscription.moyenCommunication from inscription LEFT JOIN InterestingProgrammes ON Inscription.mail = InterestingProgrammes.mail INNER JOIN Program ON InterestingProgrammes.idProgram = Program.idProgram where Inscription.date >= ? and Inscription.date <= ?";
                  console.log(sql);
              connection.query(sql, [fields1.debut,fields1.fin], function (err, result1,fields) {
                if (err) throw err;
                donnee1 = result1;
                             console.log('Database connection closed.');
                      page2 += ' </script>';
                      page2 +='<a class="button" href="http://localhost:8080/download" target="_blank">Telecharger</a>';
                      debut = fields1.debut;
                      fin = fields1.fin;
                      console.log(fields1.debut + ' ' + fields1.fin + ' data saved again');
                      console.log(donnee1);
                      let workbook = new excel.Workbook();
                      let worksheet = workbook.addWorksheet('inscription')
                      worksheet.columns = [
                        {header: 'date', key: 'date'},
                        {header: 'Nom', key: 'lastName'},
                        {header: 'Prenom', key: 'firstName'},
                        {header: 'Telephone', key: 'phone'},
                        {header: 'Mail', key: 'mail'},
                        {header: 'Pays', key: 'country'},
                        {header: 'Province', key: 'etat'},
                        {header: 'Programme', key: 'programDescription'},
                        {header: 'Moyen de Communication', key: 'moyenCommunication'}
                      ];
                      worksheet.columns.forEach(column => {
                          column.width = column.header.length < 12 ? 12 : column.header.length
                      });
                      worksheet.getColumn("E").width = 25;
                      worksheet.getColumn("H").width = 50;
                      worksheet.getRow(1).font = {bold: true};
                      // Dump all the data into Excel
                      donnee1.forEach((e, index) => {
                      // row 1 is the header.
                          const rowIndex = index + 2
                          worksheet.addRow({
                              ...e,
                            });
                      });
                      workbook.xlsx.writeFile('Rapport Inscription '+fields1.debut+' à '+fields1.fin+'.xlsx');
                      res.writeHead(200, { 'Content-Type': 'text/html' });
                      res.write(page);
                      res.write(page2);
                      res.write('<script> document.getElementById("rp").innerHTML = "Données sauvegardés avec succès à <br> "+Date(); </script>');
                      res.end();
                //  });
              });
       
        
            });
        });


    }
    catch(Err)
    {
        Console.error(Err);
    }
    
});

app.get('/myaction1', (req, res) => {
    var form = new formidable.IncomingForm();
        fs.readFile("rapportProgramme.html", function (err, data) {
          page2 = "<script>";
          form.parse(req, function (err, fields1, files) {
              var con = mysql.createConnection({
                  host: "localhost",
                  user: "root",
                  password: "",
                  database: "PortesOuvertsGrasset",
                  multipleStatements: true    
              });
              con.connect(function (err) {
                  if (err) throw err;
                  console.log("Connected");
                  console.log(fields1.debut);
                  console.log(fields1.fin);
                  var sql = "Select COUNT(InterestingProgrammes.mail)as NombreDePersonnesInscrites, Program.programDescription "
                  		  + "FROM `InterestingProgrammes` LEFT JOIN Inscription " 
                  		  + "ON Inscription.mail = InterestingProgrammes.mail " 
                  		  + "INNER JOIN Program ON InterestingProgrammes.idProgram = Program.idProgram "
                  		  + "WHERE Inscription.date >= ? AND Inscription.date <= ? "
                  		  + "GROUP BY(Program.programDescription)";
                  console.log(sql);
                  con.query(sql, [fields1.debut,fields1.fin], function (err, result1,fields) {
                      if (err) throw err;
                      donnee1 = result1;
                      con.end(function (err) {
                            if (err) {
                                return console.log('error:' + err.message);
                            }
                            console.log('Database connection closed.');
                            page2 += ' </script>';
                            page2 +='<a class="button" href="http://localhost:8080/download1" target="_blank">Telecharger</a>';
                            debut = fields1.debut;
                            fin = fields1.fin;
                            console.log(fields1.debut + ' ' + fields1.fin + ' data saved again');
                            console.log(donnee1);
                            let workbook = new excel.Workbook();
                            let worksheet = workbook.addWorksheet('Programme')
                            worksheet.columns = [
                              {header: 'NombreDePersonnesInscrites', key: 'NombreDePersonnesInscrites'},
                              {header: 'programDescription', key: 'programDescription'},
               				];
                            worksheet.columns.forEach(column => {
                                column.width = column.header.length < 12 ? 12 : column.header.length
                            });
                            worksheet.getRow(1).font = {bold: true};
                            // Dump all the data into Excel
                            donnee1.forEach((e, index) => {
                            // row 1 is the header.
                                const rowIndex = index + 2
                                worksheet.addRow({
                                    ...e,
                                  });
                            });
                            workbook.xlsx.writeFile('Rapport Programme '+fields1.debut+' à '+fields1.fin+'.xlsx');
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.write(page);
                            res.write(page2);
                            res.write('<script> document.getElementById("rp").innerHTML = "Données sauvegardés avec succès à <br> "+Date(); </script>');
                            res.end();
                        });
                    });
                });
            });
        });
});

app.get('/download', (req, res) => {
    var file = "Rapport Inscription "+debut+' à '+fin+".xlsx";
    var files = fs.createReadStream(file);
   res.writeHead(200, {'Content-disposition': 'attachment; filename=Rapport Inscription '+debut+' à '+fin+'.xlsx'}); //here you can specify file name
   files.pipe(res); // also you can set content-type

     try {
       fs.unlinkSync("./"+"Rapport Inscription "+debut+' à '+fin+".xlsx");
       //file removed
     } catch(err) {
       console.error(err);
     }
});   

app.get('/download1', (req, res) => {
    var file = "Rapport Programme "+debut+' à '+fin+".xlsx";
    var files = fs.createReadStream(file);
   res.writeHead(200, {'Content-disposition': 'attachment; filename=Rapport Programme '+debut+' à '+fin+'.xlsx'}); //here you can specify file name
   files.pipe(res); // also you can set content-type

     try {
       fs.unlinkSync("./"+"Rapport Programme "+debut+' à '+fin+".xlsx");
       //file removed
     } catch(err) {
       console.error(err);
     }
    });   

app.get('/download1', (req, res) => {
    fs.readFile("rapportInscription.html", function (err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("404 Not Found");
        }
        page = data;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(page);
        res.end();
    }); 
}); 
app.get('/prog', (req, res) => {
    fs.readFile("rapportProgramme.html", function (err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("404 Not Found");
        }
        page = data;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(page);
        res.end();
    }); 
}); 
module.exports = app; 
