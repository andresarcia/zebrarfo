var db = require('../models');
var async = require('async');

var _ = require('underscore');
var jf = require('jsonfile');
var utils = require('./utils/Utils');
var builder = require('./utils/PlaceBuilder');
// == MONGO ===================================================================
// var builder = require('./utils/PlaceBuilderV2');
// ============================================================================
var placeUtils = require('./utils/PlaceUtils');
var coordinate = require('./coordinates');
var outliers = require('./outliers');

// == MONGO ===================================================================
// var mongoose = require('mongoose');
// var Place = require('../models_mongo/place.js');
// ============================================================================

/*-------------------------------------------------------------------*/
exports.create = function(req,res){
	// check permissions to publish
	if(req.user.role == "subscriber"){
		console.error("403, Sorry, you do not have permissions to update the place");
		return res.json(403, { message: "Sorry, you do not have permissions to update the place" });
	}

	// validate place format
	if(Object.keys(req.body).length === 0){
		console.error("400, Sorry, the request has the wrong format specification");
		return res.json(400, { message: "Sorry, the request has the wrong format specification" });
	}

	// STATS ======================
	var start = new Date().getTime();
	// ============================


	console.log('* CREATING NEW PLACE *');
	builder.create(req.body, function(err, place){
		if(err){
			console.error("ERROR: " + err);
			return res.json(500, { 
				message: "There has been a server error. Please try again in a few minutes" 
			});
		}

		db.Place.findOrInitialize({
			where: {
				UserId:req.user.iss,
				name: place.name,
			},
		}).then(function(n){
			if(n[0].isNewRecord){
				console.log('* SAVING PLACE *');

				n[0].numberCoordinates = place.numberCoordinates;
				n[0].powerMin = place.powerMin;
				n[0].powerMax = place.powerMax;
				n[0].powerAvg = place.powerAvg;
				n[0].sdPowerAvg = place.sdPowerAvg;
				n[0].avgPowerSD = place.avgPowerSD;
				n[0].frequencyMin = place.frequencyMin;
				n[0].frequencyMax = place.frequencyMax;
				n[0].numberPowerFrequency = place.numberPowerFrequency;
				n[0].totalDistance = place.totalDistance;
				n[0].distanceAvg = place.distanceAvg;
				n[0].distanceMin = place.distanceMin;
				n[0].distanceMax = place.distanceMax;
				n[0].frequenciesBands = JSON.stringify(place.frequenciesBands);
				n[0].frequenciesChannelWidth = JSON.stringify(place.frequenciesChannelWidth);
				n[0].distanceSD = JSON.stringify(place.distanceSD);

				n[0].save()
				.then(function(){
					coordinate.save(n[0].id,place.coordinates,function(err){
						if(err){
							console.error("ERROR: " + err);
							return res.json(500, { 
								message: "There has been a server error saving the coordinates. Please try again in a few minutes" 
							});
						}

						outliers.save(n[0].id,place.outliers,true,function(err){
							if(err){
								console.error("ERROR: " + err);
								return res.json(500, { 
									message: "There has been a server error saving the outliers. Please try again in a few minutes" 
								});
							}
							// ========================
							var end = new Date().getTime();
							console.log("Time ms:" + (end - start));
							// ========================
							res.status(200).send(n[0]);
						});
					});
				}).catch(function(err) {
					console.error("ERROR: " + err);
					return res.json(500, { 
						message: "There has been a server error. Please try again in a few minutes" 
					});
				});

			} else {
				console.log('* UPDATING OLD PLACE *');
				coordinate.save(n[0].id,place.coordinates,function(err){
					if(err){
						console.error("ERROR: " + err);
						return res.json(500, { 
							message: "There has been a server error saving the coordinates. Please try again in a few minutes"
						});
					}

					outliers.save(n[0].id,place.outliers,false,function(err){
						if(err){
							console.error("ERROR: " + err);
							return res.json(500, { 
								message: "There has been a server error saving the outliers. Please try again in a few minutes" 
							});
						}
						
						placeUtils.takeStatsComparingPlace(req.user.iss,n[0].id,place,function(err,n){
							if(err){
								console.error("ERROR: " + err);
								return res.json(500, { 
									message: "There has been a server error taking the stats for the place. Please try again in a few minutes" 
								});
							}
							// ========================
							var end = new Date().getTime();
							console.log("Time ms:" + (end - start));
							// ========================
							res.status(200).send(n);
						});
					});
				});
			}

		}).catch(function(err) {
			console.error("ERROR: " + err);
			return res.json(500, { 
				message: "There has been a server error. Please try again in a few minutes" 
			});
		});
	});


	// == MONGO ===================================================================
	// Place.findOne({ name: req.body.name }, function(err, o) {
	// 	if(err) {
	// 		console.error("ERROR: " + err);
			// return res.json(500, { 
			// 	message: "There has been a server error. Please try again in a few minutes" 
			// });
	// 	}
	// 	if(!o) createPlace();
	// 	else updatePlace(o);
	// });

	// var createPlace = function (){
	// 	console.log('* CREATING NEW PLACE *');
	// 	builder.create(req.body, null, false, function(err, n){
	// 		if(err) {
	// 			console.error("ERROR: " + err);
				// return res.json(500, { 
				// 	message: "There has been a server error. Please try again in a few minutes" 
				// });
	// 		}

	// 		console.log('* SAVING NEW PLACE *');
	// 		var place = new Place(n);
	// 		// save the parent (user) model in the place model
	// 		place._creator = mongoose.Types.ObjectId(req.user.iss);
	// 		saveAndResponse(place, true);
	// 	});
	// };

	// var updatePlace = function(o){
	// 	console.log('* UPDATING PLACE *');
	// 	builder.create(req.body, o, true, function(err, n){
	// 		if(err) {
	// 			console.error("ERROR: " + err);
				// return res.json(500, { 
				// 	message: "There has been a server error. Please try again in a few minutes" 
				// });
	// 		}

	// 		console.log('* SAVING UPDATED PLACE *');
	// 		o.distance = n.distance;
	// 		o.power = n.power;
	// 		o.outliers = n.outliers;
	// 		o.frequencies.bands = n.frequencies.bands;
	// 		o.frequencies.width = n.frequencies.width;
	// 		o.updatedAt = Date.now();

	// 		_.each(n.newCoordinates, function(item){
	// 			o.coordinates.push(item);
	// 		});

	// 		if(n.newCoordinates.length > 0){
	// 			saveAndResponse(o, true);

	// 		} else {
	// 			saveAndResponse(o, false);
	// 		} 
	// 	});
	// };

	// var saveAndResponse = function(place, save){
	// 	if(save){
	// 		place.save(function(err){
	// 			if(err){
				// 	console.error("ERROR: " + err);
					// return res.json(500, { 
					// 	message: "There has been a server error. Please try again in a few minutes" 
					// });
				// }
	// 			console.log("DONE");
	// 			// ========================
	// 			var end = new Date().getTime();
	// 			console.log("Time ms:" + (end - start));
	// 			// ========================
	// 			// res.status(200).send(n);
	// 		});
	// 	} else {
	// 		console.log("DONE");
	// 		// res.status(200).send(n);
	// 	}
	// };
	// ============================================================================
};

/*-------------------------------------------------------------------*/
exports.list = function(req, res){
	// == MONGO ===================================================================
	// Place.find(
	// { _creator: req.user.iss }, 
	// { 
	// 	name: 1,
	// 	distance: 1,
	// 	power: 1,
	// 	frequencies: 1
	// },
	// function(err, places){
	// 	if(err) {
	// 		console.error("ERROR: " + err);
			// return res.json(500, { 
			// 	message: "There has been a server error. Please try again in a few minutes" 
			// });
	// 	}

	// 	res.status(200).send(places);
	// });
	// ============================================================================

	db.Place.findAll({
		where: {
			UserId:req.user.iss,
			visible: true
		}
	}).then(function(places){
		res.status(200).send(places);
	}).catch(function(err) {
		console.error("ERROR: " + err);
		return res.json(500, { 
			message: "There has been a server error. Please try again in a few minutes" 
		});
	});
};

/*-------------------------------------------------------------------*/
exports.get = function(req, res){
	// check place id is a number
	if(!utils.isNumber(req.params.id)){
		console.error("400, Sorry, the place id has the wrong format specification");
		return res.json(400, { message: "Sorry, the place id has the wrong format specification" });
	}

	db.Place.find({
		where: {
			UserId:req.user.iss,
			id: req.params.id,
			visible: true
		},
		include: [{ 
			model: db.Coordinate, 
			where: {
				visible: true
			} 
		}]
	}).then(function(place){
		if(!place){
			console.error("404, Place not found");
			return res.json(404, { message: "Place not found" });
		}

		place = place.toJSON();
		place.coordinates = place.Coordinates;
		delete place.Coordinates;

		res.status(200).send(place);
	
	}).catch(function(err) {
		console.error("ERROR: " + err);
		return res.json(500, { 
			message: "There has been a server error. Please try again in a few minutes" 
		});
	});
};

/*-------------------------------------------------------------------*/
exports.update = function(req, res){
	// check permissions to update
	if(req.user.role == "subscriber"){
		console.error("403, Sorry, you do not have permissions to update the place");
		return res.json(403, { message: "Sorry, you do not have permissions to update the place" });
	}

	// check place id is a number
	if(!utils.isNumber(req.body.id)){
		console.error("400, Sorry, the place id has the wrong format specification");
		return res.json(400, { message: "Sorry, the place id has the wrong format specification" });
	}

	if(req.body.spacing){
		async.eachSeries(_.keys(req.body.spacing), function(key, callback) {
			placeUtils.saveCoordinateCapturesAvg(req.user.iss,req.body.id, key, req.body.spacing[key], 
			function(err){
				if(err){
					return callback(err);
				}

				return callback();
			});

		}, function(err){
			if(err){
				console.error("ERROR: " + err);
				return res.json(500, { 
					message: "There has been a server error. Please try again in a few minutes" 
				});
			}

			if(req.body.edited){
				coordinate._delete(req.user.iss, req.body.id, req.body.edited, 
				function(err){
					if(err){
						console.error("ERROR: " + err);
						return res.json(500, { 
							message: "There has been a server error. Please try again in a few minutes" 
						});
					}
					placeUtils.retakeStatsAndSave(req.user.iss,req.body.id, function(err, n){
						if(err){
							console.error("ERROR: " + err);
							return res.json(500, { 
								message: "There has been a server error. Please try again in a few minutes" 
							});
						}
						res.status(200).send(n);
					});
				});
			} else {
				placeUtils.retakeStatsAndSave(req.user.iss,req.body.id, function(err, n){
					if(err){
						console.error("ERROR: " + err);
						return res.json(500, { 
							message: "There has been a server error. Please try again in a few minutes" 
						});
					}
					res.status(200).send(n);
				});
			}
		});
	} else if(req.body.edited){
		coordinate._delete(req.user.iss, req.body.id, req.body.edited, 
		function(err){
			if(err){
				console.error("ERROR: " + err);
				return res.json(500, { 
					message: "There has been a server error. Please try again in a few minutes" 
				});
			}

			placeUtils.retakeStatsAndSave(req.user.iss,req.body.id, function(err, n){
				if(err){
					console.error("ERROR: " + err);
					return res.json(500, { 
						message: "There has been a server error. Please try again in a few minutes" 
					});
				}

				res.status(200).send(n);
			});
		});
	}
};

/*-------------------------------------------------------------------*/
exports.delete = function(req, res){
	// check permissions to update
	if(req.user.role == "subscriber"){
		console.error("403, Sorry, you do not have permissions to update the place");
		return res.json(403, { message: "Sorry, you do not have permissions to update the place" });
	}

	// check place id is a number
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

		place.destroy()
		.then(function() {
			res.status(200).send({ msg:'Place '+req.params.id+ ' deleted' });
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

/*-------------------------------------------------------------------*/
exports.download = function(req, res){
	// check place id is a number
	if(!utils.isNumber(req.params.id)){
		console.error("400, Sorry, the place id has the wrong format specification");
		return res.json(400, { message: "Sorry, the place id has the wrong format specification" });
	}

	placeUtils.toJson(req.user.iss, req.params.id, function(err,data,name){
		if(err){
			console.error("ERROR: " + err);
			return res.json(500, { 
				message: "There has been a server error. Please try again in a few minutes" 
			});
		}

		if(data === null){
			console.error("404, Place not found");
			return res.json(404, { message: "Place not found" });
		}

		var path = '/tmp/' + name + '.json';
		jf.writeFile(path, data, function(err) {
			if(err){
				console.error("ERROR: " + err);
				return res.json(500, { 
					message: "There has been a server error. Please try again in a few minutes" 
				});
			}

			res.cookie('fileDownload', 'true', { path: '/' });
			res.download(path);
		});
	});
};