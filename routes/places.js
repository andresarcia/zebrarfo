var db = require('../models');
var async = require('async');
var httpError = require('build-http-error');
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
// var Place = require('../models_mongo/place.js');
// ============================================================================

/*-------------------------------------------------------------------*/
exports.create = function(req,res,next){
	if(Object.keys(req.body).length === 0)
		next(httpError(404,'something blew up with your browser, try to update it'));
	
	else {
		// ========================
		var start = new Date().getTime();
		// ========================
		console.log('* CREATING NEW PLACE *');
		builder.create(req.body, function(err, place){
			if(err) 
				next(httpError(404,err));

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
							if(err) next(httpError(err));

							outliers.save(n[0].id,place.outliers,true,function(err){
								if(err)
									next(httpError(err));
								// ========================
								var end = new Date().getTime();
								console.log("Time ms:" + (end - start));
								// ========================
								res.status(200).send(n[0]);
							});
						});
					}).catch(function(err) {
						next(httpError(err));
					});

				} else {
					console.log('* UPDATING OLD PLACE *');
					coordinate.save(n[0].id,place.coordinates,function(err){
						if(err)
							next(httpError(err));

						outliers.save(n[0].id,place.outliers,false,function(err){
							if(err)
								next(httpError(err));
							
							placeUtils.takeStatsComparingPlace(req.user.iss,n[0].id,place,function(err,n){
								if (err)
									next(httpError(err));
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
				next(httpError(err));
			});
		});
	}




	// == MONGO ===================================================================
// 	if(Object.keys(req.body).length === 0){
// 		next(httpError(404,'something blew up with your browser, try to update it'));

// 	} else {
// 		// ========================
// 		var start = new Date().getTime();
// 		// ========================

// 		Place.findOne({ name: req.body.name }, function(err, o) {
// 			if(err) next(httpError(404,err));
// 			if(!o) createPlace();
// 			else updatePlace(o);
// 		});

// 		var createPlace = function (){
// 			console.log('* CREATING NEW PLACE *');
// 			builder.create(req.body, null, false, function(err, n){
// 				console.log('* SAVING NEW PLACE *');
// 				var place = new Place(n);
// 				saveAndResponse(place, true);
// 			});
// 		};

// 		var updatePlace = function(o){
// 			console.log('* UPDATING PLACE *');
// 			builder.create(req.body, o, true, function(err, n){
// 				console.log('* SAVING UPDATED PLACE *');
// 				o.distance = n.distance;
// 				o.power = n.power;
// 				o.outliers = n.outliers;
// 				o.frequencies.bands = n.frequencies.bands;
// 				o.frequencies.width = n.frequencies.width;
// 				o.updatedAt = Date.now();
// 				_.each(n.newCoordinates, function(item){
// 					o.coordinates.push(item);
// 				});
				
// 				if(n.newCoordinates.length > 0) saveAndResponse(o, true);
// 				else saveAndResponse(o, false);
// 			});
// 		};

// 		var saveAndResponse = function(place, save){
// 			if(save){
// 				place.save(function(err){
// 					if(err) next(httpError(err));
// 					console.log("DONE");
// 					// ========================
// 					var end = new Date().getTime();
// 					console.log("Time ms:" + (end - start));
// 					// ========================
// 					// res.status(200).send(n);
// 				});
// 			} else {
// 				console.log("DONE");
// 				// res.status(200).send(n);
// 			}
// 		};
// 	}
};

/*-------------------------------------------------------------------*/
exports.list = function(req,res,next){
	db.Place.findAll({
		where: {
			UserId:req.user.iss,
			visible: true
		}
	}).then(function(places){
		res.status(200).send(places);
	}).catch(function(err) {
		next(httpError(err));
	});
};

/*-------------------------------------------------------------------*/
exports.get = function(req,res,next){
	if(utils.isNumber(req.params.id)){
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
				next(httpError(404));
				return;
			}
			place = place.toJSON();
			place.coordinates = place.Coordinates;
			delete place.Coordinates;

			res.status(200).send(place);
		
		}).catch(function(err) {
			next(httpError(err));
		});
	} else
		next(httpError(404));
};

/*-------------------------------------------------------------------*/
exports.update = function(req,res,next){
	if(utils.isNumber(req.body.id)){

		if(req.body.spacing){
			async.eachSeries(_.keys(req.body.spacing), function(key, callback) {
				placeUtils.saveCoordinateCapturesAvg(req.user.iss,req.body.id, key, req.body.spacing[key], 
				function(err){
					if(err) next(httpError(err));
					callback();
				});

			}, function(err){
				if(err)
					return next(httpError(err));

				if(req.body.edited){
					coordinate._delete(req.user.iss, req.body.id, req.body.edited, 
					function(err){
						if(err) next(httpError(err));
						placeUtils.retakeStatsAndSave(req.user.iss,req.body.id, function(err, n){
							if(err) next(httpError(err));
							res.status(200).send(n);
						});
					});
				} else {
					placeUtils.retakeStatsAndSave(req.user.iss,req.body.id, function(err, n){
						if(err) next(httpError(err));
						res.status(200).send(n);
					});
				}
			});
		} else if(req.body.edited){
			coordinate._delete(req.user.iss, req.body.id, req.body.edited, 
			function(err){
				if(err) next(httpError(err));

				placeUtils.retakeStatsAndSave(req.user.iss,req.body.id, function(err, n){
					if(err) next(httpError(err));
					res.status(200).send(n);
				});
			});
		}

	} else
		next(httpError(404));
};

/*-------------------------------------------------------------------*/
exports.delete = function(req,res,next){
	if(utils.isNumber(req.params.id)){
		db.Place.find({
			where: {
				UserId:req.user.iss,
				id: req.params.id,
				visible: true
			}
		}).then(function(place){
			if(!place){
				next(httpError(404));
				return;
			}

			place.destroy()
			.then(function() {
				res.status(200).send({ msg:'Place '+req.params.id+ ' deleted' });
			}).catch(function(err){
				next(httpError(err));
			});

		}).catch(function(err){
			next(httpError(err));
		});
	
	} else
		next(httpError(404));
};

/*-------------------------------------------------------------------*/
exports.download = function(req,res,next){
	if(utils.isNumber(req.params.id)){
		placeUtils.toJson(req.user.iss, req.params.id, function(err,data,name){
			if(err) return next(httpError(err));
			if(data === null) next(httpError(404));
			
			var path = '/tmp/' + name + '.json';
			jf.writeFile(path, data, function(err) {
				if(err) next(httpError(err));

				res.cookie('fileDownload', 'true', { path: '/' });
				res.download(path);
			});
		});

	} else
		next(httpError(404));
};