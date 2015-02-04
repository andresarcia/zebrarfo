var _ = require('underscore');
var db = require('../models');

var UserIdentification = 1;

/*-------------------------------------------------------------------*/
exports.save = function(id,modes,isNew,callback){
	if(isNew){
		console.log('* SAVING POWER MODE *');
		var v = [];
		_.each(_.keys(modes), function(key){
			v.push({
				power: key,
				frequency: modes[key],
				PlaceId: id
			});
		});
			    
	    db.PowerMode.bulkCreate(v)
		.success(function() { 
			callback();
		}).error(function(err){
			callback(err);
		});

	} else {
		console.log('* UPDATING POWER MODE *');	
		callback();
	}
};