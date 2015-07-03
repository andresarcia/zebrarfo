var _ = require('underscore');
var db = require('../models');
var utils = require('./utils/Utils');
var placeUtils = require('./utils/PlaceUtils');
var async = require('async');

/*-------------------------------------------------------------------*/
exports.save = function(id,outliers,isNew,callback){
	if(utils.isNumber(id)){
		var v = [];
		_.each(_.keys(outliers), function(key){
			v.push({
				power: key,
				frequency: outliers[key],
				PlaceId: id
			});
		});

		if(isNew){
			console.log('* SAVING OUTLIERS *');
			db.Outlier.bulkCreate(v)
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
				db.Outlier.bulkCreate(v)
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

			var power = Number(outliers[0].dataValues.power.toFixed(1));
			place.getCoordinates({
				where: {
					visible: true
				},
				include: [{ 
					model: db.Capture,
				}]
			}).then(function(coordinates){
				async.eachSeries(coordinates, function(coord, callback) {
					var found = _.find(coord.dataValues.Captures, function(cap){ 
						var comp = Number(cap.dataValues.power.toFixed(1));
						return comp == power; 
					});
					if(found){
						coord.dataValues.visible = false;
						coord.save()
						.then(function(){
							return callback();
						})
						.catch(function(err){
							return callback(err);
						});
					} else
						callback();
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