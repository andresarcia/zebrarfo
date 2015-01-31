var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

if (app.get('env') === 'development') {
	app.use(express.static(path.join(__dirname, 'public')));

} else if (app.get('env') === 'production') {
	app.use(express.static(path.join(__dirname, 'public/build')));
}

app.get('/', function (req,res){
	if (app.get('env') === 'development') {
		res.sendfile(__dirname + '/index_development.html');
	
	} else if (app.get('env') === 'production') {
		res.sendfile(__dirname + '/index_production.html');
	}
});

var routes = require('./routes/index');
app.use('/api/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {

}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
