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
		db.Coordinate.findOrInitialize({
			where: {
				latitude: coord.latitude,
				longitude: coord.longitude,
				powerMin: coord.powerMin,
				powerMax : coord.powerMax,
				powerAvg : coord.powerAvg,
				powerSD : coord.powerSD,
				createdDate: coord.createdDate,
				PlaceId: id
			}
		}).then(function(coordinate,created){
			if(coordinate[0].isNewRecord){
				coordinate[0].save()
				.then(function(){
					capture.save(coordinate[0].id, coord.captures, function(err){
						if(err) 
							return callback(err);
					});
				}).catch(function(err) {
					next(httpError(err));
				});
			} else {
				coordinate[0].dataValues.visible = true;
				coordinate[0].save()
				.catch(function(err) {
					return callback(err);
				});
			}
		})
		.catch(function(err) {
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
		}).then(function(place){
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
			.then(function(result) {
				var placeObject = {};
				placeObject.total = result.count;
				placeObject.currentPage = result.count;
				placeObject.coordinates = result.rows;
				res.status(200).send(placeObject);
				
			}).catch(function(err){
				next(httpError(err));
			});
		})
		.catch(function(err){
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
		}).then(function(place){
			if(!place){
				next(httpError(404));
				return;
			}

			place.getCoordinates({ 
				where: {
					id: req.params.id,
					visible: true
				}
			}).then(function(coord){
				if(coord.length == 0){
					next(httpError(404));
					return;
				}

				coord[0].getCaptures({
					attributes: ['frequency', 'power'],
				}).then(function(data){
					if(data.length == 0){
						next(httpError(404));
						return;
					}
					res.status(200).send(data);
				}).catch(function(err){
					next(httpError(err));
				});

			}).catch(function(err){
				next(httpError(err));
			});

		}).catch(function(err){
			next(httpError(err));
		});

	} else
		next(httpError(404));
};