var db = require('../models');
var utils = require('./utils/Utils');
var httpError = require('build-http-error');
var _ = require("underscore");

var UserIdentification = 1;

/*-------------------------------------------------------------------*/
exports.save = function(id,captures,callback){
	_.each(captures, function(capture){
		capture.CoordinateId = id;
	});
	
	db.Capture.bulkCreate(captures)
	.success(function() { 
		callback();
	}).error(function(err){
		return callback(err);
	});
};
