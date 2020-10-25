let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let session = require('express-session');
let fs = require('fs');
let fileUpload = require('express-fileupload');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}));

app.use('/js', express.static(__dirname + '/public/javascripts'));
app.use('/css', express.static(__dirname + '/public/stylesheets'));
app.use('/images', express.static(__dirname + '/public/images'));
app.use('/documents', express.static(__dirname + '/public/documents'));

imagesPath = path.resolve('./public/images');
documentsPath = path.resolve('./public/documents');

let config = require('./routes/routes.config.json');
for(index in config.routes){
  app.use(config.routes[index].uri, require(config.routes[index].handler));
}

app.use(function(request, response, next){
  console.log("REquest Path : " + request.path);
  if(request.path == "/"){
    next();
  }else{
    let htmlRegex = /.*htm.*$/;
    if(request.path.match(htmlRegex).length > 0){
      let pathFile = path.resolve('./views/html' + request.path);
      let stat = fs.statSync(pathFile);
      if(stat && stat.isFile()){
        response.sendFile(pathFile);
      }else{
        console.log('Does not exist the file : %s', path.resolve('./views/html' + request.path));
        next();
      }
    }else{
      response.end();
    }
  }
});

app.use("/", function( request, response) {
  console.log("Entering to index.html");
  response.sendFile(path.resolve("./views/html/PortesOuverts/index.html"));
});

// catch 404 and forward to error handler
app.use(function(request, response, next) {
  console.log("404 Error , it does not exist : " + request.path);
  next(createError(404));
});
// error handler
app.use(function(err, request, response, next) {
  // set locals, only providing error in development
  if(!err){
    next();
    return;
  }
    response.send({errorMessage:err});
});




module.exports = app;