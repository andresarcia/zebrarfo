var _ = require('underscore');
var db = require('../models');
var httpError = require('build-http-error');
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
exports.list = function(req,res,next){
	if(!utils.isNumber(req.params.id)){
		return next(httpError(400, 'Sorry, the place id has the wrong format specification'));
	}

	db.Place.find({
		where: {
			UserId:req.user.iss,
			id: req.params.id,
			visible: true
		},
	}).then(function(place){
		if(!place){
			return next(httpError(404, 'Place not found'));
		}
	
		place.getOutliers({
			order: 'power DESC',
		})	
		.then(function(data){
			if(data.length === 0){
				return next(httpError(404, 'Outliers not found'));
			}

			res.status(200).send(data);

		}).catch(function(err){
			console.error("ERROR: " + err);
			return next(httpError(500, err));
		});
	
	}).catch(function(err){
		console.error("ERROR: " + err);
		return next(httpError(500, err));
	});
};

/*-------------------------------------------------------------------*/
exports.delete = function(req,res,next){
	if(!utils.isNumber(req.params.idPlace)){
		return next(httpError(400, 'Sorry, the place id has the wrong format specification'));
	}

	if(!utils.isNumber(req.params.id)){
		return next(httpError(400, 'Sorry, the outlier id has the wrong format specification'));
	}

	db.Place.find({
		where: {
			UserId:req.user.iss,
			id: req.params.idPlace,
			visible: true
		},
	}).then(function(place){
		if(!place){
			return next(httpError(404, 'Place not found'));
		}

		place.getOutliers({
			where: {
				id: req.params.id
			}
		}).then(function(outlayer){
			if(outlayer.length === 0) return next(httpError(404));
			var power = Number(outlayer[0].dataValues.power.toFixed(1));
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
						return next(httpError(500, err));
					}

					placeUtils.retakeStatsAndSave(req.user.iss ,req.params.idPlace, function(err, n){
						if(err){
							console.error("ERROR: " + err);
							return next(httpError(500, err));
						}

						res.status(200).send(n);
					});
				});

			}).catch(function(err){
				console.error("ERROR: " + err);
				return next(httpError(500, err));
			});

		}).catch(function(err){
			console.error("ERROR: " + err);
			return next(httpError(500, err));
		});

	}).catch(function(err){
		console.error("ERROR: " + err);
		return next(httpError(500, err));
	});
};