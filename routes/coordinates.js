var db = require('../models');
var httpError = require('build-http-error');
var utils = require('./utils/Utils');
var coordinate = require('./coordinates');
var capture = require('./captures');

var _ = require("underscore");

var UserIdentification = 1;

/*-------------------------------------------------------------------*/
exports.save = function(id,coordinates,callback){
	console.log('* SAVING COORDINATES *');	

	_.each(coordinates, function(coord){
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
				});
			} else {
				coordinate.dataValues.visible = true;
				coordinate.save()
				.error(function(err){
					return callback(err);
				});
			}
		})
		.error(function(err){
			return callback(err);
		});
	});
	
	callback(null);
}

/*-------------------------------------------------------------------*/
exports.list = function(req,res,next){
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

/*-------------------------------------------------------------------*/
exports.get = function(req, res, next){
	if(utils.isNumber(req.params.idPlace) && utils.isNumber(req.params.id)){
		
		db.Place.find({
			where: {
				UserId:UserIdentification,
				id: req.params.idPlace,
				visible: true
			}
		}).success(function(place){
			if(!place){
				next(httpError(404));
				return;
			}

			place.getCoordinates({ 
				where: {
					id: req.params.id,
					visible: true
				}
			}).success(function(coord){
				if(coord.length == 0){
					next(httpError(404));
					return;
				}

				coord[0].getCaptures({
					attributes: ['frequency', 'power'],
				}).success(function(data){
					if(data.length == 0){
						next(httpError(404));
						return;
					}

					res.status(200).send(data);

				}).error(function(err){
					next(httpError(err));
				});

			}).error(function(err){
				next(httpError(err));
			});

		}).error(function(err){
			next(httpError(err));
		});

	} else
		next(httpError(404));
};