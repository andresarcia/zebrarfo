var db = require('../models');
var async = require('async');
var httpError = require('build-http-error');
var utils = require('./utils/Utils');
var coordinate = require('./coordinates');
var capture = require('./captures');

var UserIdentification = 1;

/*-------------------------------------------------------------------*/
exports.save = function(id,coordinates,callback){
	console.log('* SAVING COORDINATES *');	

	async.each(coordinates, function(coord, callbackInner) {
		
		db.Coordinate.findOrCreate({
			latitude: coord.latitude,
			longitude: coord.longitude,
			powerMin: coord.powerMin,
			powerMax : coord.powerMax,
			powerAvg : coord.powerAvg,
			powerSD : coord.powerSD,
			createdDate: coord.createdDate,
			PlaceId: id,

		}).success(function(coordinate, created){
			if(created){
				capture.save(coordinate.id, coord.captures, function(err){
					if(err) 
	    				return callback(err);

					callbackInner();
				});
			} else 
				callbackInner();
		})
		.error(function(err){
			callbackInner(err);
		});
	  
	}, function(err){	    
	    if(err) 
	    	return callback(err);
	    
	    callback(null);
	});
}

/*-------------------------------------------------------------------*/
exports.get = function(req,res,next){
	if(utils.isNumber(req.params.id)){
		db.Place.find({
			where: {
				UserId:UserIdentification,
				id: req.params.id,
				visible: true
			}
		}).success(function(place){
			if(!place){
				next(httpError(404));
				return;
			}

			var options;

			if(utils.isNumber(req.query.offset) && utils.isNumber(req.query.limit))
				options = { 
					where: { 
						PlaceId:place.id, 
						visible: true 
					}, 
					offset: req.query.offset, 
					limit: req.query.limit 
				};
			else
				options = { 
					where: { 
						PlaceId:place.id, 
						visible: true 
					}
				};

  			db.Coordinate.findAndCountAll(options)
			.success(function(result) {
				var placeObject = {};
				placeObject.total = result.count;
				placeObject.currentPage = result.count;
				placeObject.coordinates = result.rows;
				res.status(200).send(placeObject);
				
			}).error(function(err){
				next(httpError(err));
			});
		})
		.error(function(err){
			next(httpError(err));
		});
	
	} else
		next(httpError(404));
};