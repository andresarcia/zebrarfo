var _ = require('underscore');
var db = require('../models');
var utils = require('./utils/Utils');
var placeUtils = require('./utils/PlaceUtils');
var async = require('async');

/*-------------------------------------------------------------------*/
exports.save = function(id, outliers, isNew, callback){
	if(utils.isNumber(id)){

		_.each(outliers, function(item){
			item = _.extend(item, { PlaceId: id });
		});

		if(isNew){
			console.log('* SAVING OUTLIERS *');

			db.Outlier.bulkCreate(outliers)
			.then(function() { 
				return callback();
			}).catch(function(err){
				return callback(err);
			});

		} else {
			console.log('* UPDATING OUTLIERS *');

			db.Outlier.destroy({
				where: {
					PlaceId: id
				}},
				{
					truncate: true
				})
			.then(function(){
				db.Outlier.bulkCreate(outliers)
				.then(function() { 
					return callback();
				}).catch(function(err){
					return callback(err);
				});
			}).catch(function(err){
				return callback(err);
			});
		}
	} else
		return callback("ID");
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
		},
	}).then(function(place){
		if(!place){
			console.error("404, Place not found");
			return res.json(404, { message: "Place not found" });
		}
	
		place.getOutliers({
			order: 'power DESC',
		})	
		.then(function(data){
			if(data.length === 0){
				console.error("404, Outliers not found");
				return res.json(404, { message: "Outliers not found" });
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
};

/*-------------------------------------------------------------------*/
exports.delete = function(req, res){
	if(!utils.isNumber(req.params.idPlace)){
		console.error("400, Sorry, the place id has the wrong format specification");
		return res.json(400, { message: "Sorry, the place id has the wrong format specification" });
	}

	if(!utils.isNumber(req.params.id)){
		console.error("400, Sorry, the outlier id has the wrong format specification");
		return res.json(400, { message: "Sorry, the outlier id has the wrong format specification" });
	}

	db.Place.find({
		where: {
			UserId:req.user.iss,
			id: req.params.idPlace,
			visible: true
		},
	}).then(function(place){
		if(!place){
			console.error("404, Place not found");
			return res.json(404, { message: "Place not found" });
		}

		place.getOutliers({
			where: {
				id: req.params.id
			}
		}).then(function(outliers){
			if(outliers.length === 0){
				console.error("404, Outliers not found");
				return res.json(404, { message: "Outliers not found" });
			}
			// get the power to delete
			var power = Number(outliers[0].dataValues.power);
			// get the decimal length for the caps
			var decimalLength = String(power).split(".");
			if(decimalLength.length == 2) decimalLength = decimalLength[1].length;
			else decimalLength = 0;

			place.getCoordinates({
				where: {
					visible: true
				},
			}).then(function(coordinates){
				if(coordinates.length == 1){
					return res.json(403, { 
						message: "You can't delete the outlier because it belows to the only sample left in the place"
					});
				}

				async.eachSeries(coordinates, function(coord, callback) {
					var found = _.find(JSON.parse(coord.dataValues.cap), function(cap){
						var comp = Number(cap.toFixed(decimalLength));
						return comp == power; 
					});

					if(found !== undefined){
						coord.dataValues.visible = false;
						coord.save()
						.then(function(){
							return callback();
						})
						.catch(function(err){
							return callback(err);
						});
					} else {
						return callback();
					}

				}, function(err){
					if(err){
						console.error("ERROR: " + err);
						return res.json(500, { 
							message: "There has been a server error. Please try again in a few minutes"
						});
					}

					placeUtils.retakeStatsAndSave(req.user.iss ,req.params.idPlace, function(err, n){
						if(err){
							console.error("ERROR: " + err);
							return res.json(500, { 
								message: "There has been a server error. Please try again in a few minutes"
							});
						}

						res.status(200).send(n);
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

	}).catch(function(err){
		console.error("ERROR: " + err);
		return res.json(500, { 
			message: "There has been a server error. Please try again in a few minutes" 
		});
	});
};