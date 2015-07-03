var db = require('../models');
var utils = require('./utils/Utils');
var coordinate = require('./coordinates');
var capture = require('./captures');
var async = require('async');
var _ = require("underscore");

/*-------------------------------------------------------------------*/
exports.save = function(id,coordinates,callback){
	console.log('* SAVING COORDINATES *');
	async.eachSeries(coordinates, function(coord, asyncCallback) {
		db.Coordinate.findOrInitialize({
			where: {
				lat: coord.lat,
				lng: coord.lng,
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
						if(err){
							return asyncCallback(err);
						}

						return asyncCallback();
					});
				}).catch(function(err) {
					return asyncCallback(err);
				});
			} else {
				coordinate[0].dataValues.visible = true;
				coordinate[0].save()
				.then(function() {
					return asyncCallback();
				}).catch(function(err) {
					return asyncCallback(err);
				});
			}
		})
		.catch(function(err) {
			return asyncCallback(err);
		});

	}, function(err){
		if(err){
			return callback(err);
		}

		return callback();
	});
};

/*-------------------------------------------------------------------*/
exports.list = function(req, res){
	if(!utils.isNumber(req.params.id)){
		console.error("400, Sorry, the place id has the wrong format specification");
		return res.json(400, { message: "Sorry, the place id has the wrong format specification" });
	}

	db.Place.find({
		where: {
			UserId:req.user.iss,
			id: req.params.id,
			visible: true
		}
	}).then(function(place){
		if(!place){
			console.error("404, Place not found");
			return res.json(404, { message: "Place not found" });
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
			console.error("ERROR: " + err);
			return res.json(500, { 
				message: "There has been a server error. Please try again in a few minutes" 
			});
		});
	})
	.catch(function(err){
		console.error("ERROR: " + err);
		return res.json(500, { 
			message: "There has been a server error. Please try again in a few minutes" 
		});
	});
};

/*-------------------------------------------------------------------*/
exports.get = function(req, res){
	if(!utils.isNumber(req.params.idPlace)){
		console.error("400, Sorry, the place id has the wrong format specification");
		return res.json(400, { message: "Sorry, the place id has the wrong format specification" });
	}

	if(!utils.isNumber(req.params.id)){
		console.error("400, Sorry, the coordinate id has the wrong format specification");
		return res.json(400, { 
			message: "Sorry, the coordinate id has the wrong format specification" 
		});
	}

	db.Place.find({
		where: {
			UserId:req.user.iss,
			id: req.params.idPlace,
			visible: true
		}
	}).then(function(place){
		if(!place){
			console.error("404, Place not found");
			return res.json(404, { message: "Place not found" });
		}

		place.getCoordinates({ 
			where: {
				id: req.params.id,
				visible: true
			}
		}).then(function(coord){
			if(coord.length === 0){
				console.error("404, Coordinate not found");
				return res.json(404, { message: "Coordinate not found" });
			}

			coord[0].getCaptures({
				attributes: ['frequency', 'power'],
			}).then(function(data){
				if(data.length === 0){
					console.error("404, Captures not found");
					return res.json(404, { message: "Captures not found" });
				}

				res.status(200).send(data);

			}).catch(function(err){
				console.error("ERROR: " + err);
				return res.json(500, { 
					message: "There has been a server error. Please try again in a few minutes" 
				});
			});

		}).catch(function(err){
			console.error("ERROR: " + err);
			return res.json(500, { 
				message: "There has been a server error. Please try again in a few minutes" 
			});
		});

	}).catch(function(err){
		console.error("ERROR: " + err);
		return res.json(500, { 
			message: "There has been a server error. Please try again in a few minutes" 
		});
	});
};

exports._delete = function(userId, placeId, coordinates, callback){
	db.Place.find({
		where: {
			id: placeId,
			UserId: userId,
			visible: true
		},
	})
	.then(function(place){
		if(place === null){
			return callback("Sorry, we cannot find that!");
		}

		async.each(coordinates, function(coord, callbackInner) {
			place.getCoordinates({
				where: {
					id: coord
				}
			}).then(function(coordinate){
				if(!coordinate){
					return callbackInner("Sorry, we cannot find that!");
				}

				coordinate[0].dataValues.visible = false;
				coordinate[0].save()
				.then(function(){
					return callbackInner();
				})
				.catch(function(err){
					return callbackInner(err);
				});

			}).catch(function(err){
				return callbackInner(err);
			});
		}, function(err){
			if(err){
				return callback(err);
			}

			return callback();
		});

	}).catch(function(err){
		return callback(err);
	});
};