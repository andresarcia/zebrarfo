var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var compress = require('compression');

var app = express();

// view engine setup ---------------------------------------------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(compress());
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

// PUBLIC FOLDER -------------------------------------------------------------
if (app.get('env') === 'development') {
	app.use(express.static(path.join(__dirname, 'public')));

} else if (app.get('env') === 'production') {
	app.use(express.static(path.join(__dirname, 'public/build')));
}

// INDEX CONTENT -------------------------------------------------------------
app.get('/', function (req,res){
	if (app.get('env') === 'development') {
		res.sendfile(__dirname + '/index_development.html');
	
	} else if (app.get('env') === 'production') {
		res.sendfile(__dirname + '/index_production.html');
	}
});


var routes = require('./routes/index');
app.use('/api/', routes);

// ERROR HANDLERS ------------------------------------------------------------
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		if(err.status == 404)
			res.status(err.status).send(err.message || "Sorry, we cannot find that!");
		else 
			res.status(err.status || 500).send(err.message || "Something blew up!");
	});

} else if (app.get('env') === 'production') {
	app.use(function(err, req, res, next) {
		if(err.status == 404)
			res.status(err.status).send("Sorry, we cannot find that!");
		else 
			res.status(err.status || 500).send("Something blew up!");
	});
}

// --------------------------------------------------------------------------
module.exports = app;
