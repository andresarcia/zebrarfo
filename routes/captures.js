var db = require('../models');
var utils = require('./utils/Utils');
var httpError = require('build-http-error');
var async = require('async');

var UserIdentification = 1;

/*-------------------------------------------------------------------*/
exports.save = function(id,captures,callback){
	async.each(captures, function(capture, callbackInner) {
		capture.CoordinateId = id;
	  	callbackInner();
	
	}, function(err){	    
	    if(err) 
	    	return callback(err);

    	db.Capture.bulkCreate(captures)
		.success(function() { 
			callback();
		}).error(function(err){
			return callback(err);
		});
	});
};
