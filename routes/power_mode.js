var _ = require('underscore');
var db = require('../models');
var utils = require('./utils/Utils');
var async = require('async');

var UserIdentification = 1;

/*-------------------------------------------------------------------*/
exports.save = function(id,modes,isNew,callback){
	if(utils.isNumber(id)){
		var v = [];
		_.each(_.keys(modes), function(key){
			v.push({
				power: key,
				frequency: modes[key],
				PlaceId: id
			});
		});

		if(isNew){
			console.log('* SAVING POWER MODE *');
		    db.PowerMode.bulkCreate(v)
			.success(function() { 
				callback();
			}).error(function(err){
				callback(err);
			});

		} else {
			console.log('* UPDATING POWER MODE *');	

			db.PowerMode.destroy({
	    		where: {
					PlaceId: id
				}},
				{
					truncate: true
				})
			.success(function(){
				db.PowerMode.bulkCreate(v)
				.success(function() { 
					callback();
				}).error(function(err){
					callback(err);
				});
			}).error(function(err){
				callback(err)
			});
		}
	} else
		callback("ID")
};