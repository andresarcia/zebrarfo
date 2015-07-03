var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var compression = require('compression');
var passport = require('passport');
var jwt = require('jwt-simple');

// == MONGO ===================================================================
// var mongoose = require('mongoose');
// ============================================================================

var app = express();
module.exports = app;

// view engine setup ---------------------------------------------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('jwtTokenSecret', 'LiwzebraRFO8J9u13tg');

// compresion of responses
app.use(compression({
	filter: shouldCompress,
	level: 9 // max level of compression, default 6
}));
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser({limit: '99mb'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
// passport
app.use(passport.initialize());

// COMPRESION ----------------------------------------------------------------
function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
}

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

// --------------------------------------------------------------------------
var routes = require('./routes/index');
app.use('/api/', routes);


// == MONGO ===================================================================
// mongoose.connect('mongodb://localhost/zebra', function(err, res){
// 	if(err){
// 		console.log('ERROR: connectiong to Database. ' + err);
// 	} else {
// 		console.log('Conected to Database');
// 	}
// });
// ============================================================================

