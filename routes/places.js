var db = require('../models');
var async = require('async');
var httpError = require('build-http-error');
var _ = require('underscore');
var utils = require('./utils/Utils');
var builder = require('./utils/PlaceBuilder');
var placeUtils = require('./utils/PlaceUtils');
var coordinate = require('./coordinates');
var outliers = require('./outliers');

var UserIdentification = 1;

/*-------------------------------------------------------------------*/
exports.create = function(req,res,next){
	if(Object.keys(req.body).length === 0)
		next(httpError(404,'something blew up with your browser, try to update it'));
	
	else {
		// ========================
		var start = new Date().getTime();
		// ========================
		if(req.body.json){
			console.log('* CREATING NEW PLACE *');
			builder.create(req.body, function(err, place){
				if(err) 
					next(httpError(404,err));

				db.Place.findOrInitialize({
					where: {
						UserId:UserIdentification,
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
						n[0].distaceAvg = place.distaceAvg;
						n[0].distaceMin = place.distaceMin;
						n[0].distaceMax = place.distaceMax;
						
						n[0].save()
						.then(function(){
							coordinate.save(n[0].id,place.coordinates,function(err){
								if(err)
									next(httpError(err));

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
								
								placeUtils.takeStatsComparingPlace(n[0].id,place,function(err,n){
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
		
		} else	
			next(httpError(404,'please update your browser!!'));
	}
};

/*-------------------------------------------------------------------*/
exports.list = function(req,res,next){
	db.Place.findAll({
		where: {
			UserId:UserIdentification,
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
				UserId:UserIdentification,
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

		db.Place.find({
			where: {
				UserId:UserIdentification,
				id: req.body.id,
				visible: true
			},
		}).then(function(place){
			if(!place){
				next(httpError(404));
				return;
			}

			async.each(req.body.coordinates, function(coord, callback) {
				place.getCoordinates({
					where: {
						id: coord.id
					}
				}).then(function(coordinate){
					if(!coordinate){
						next(httpError(404));
						return;
					}
					if(coord.action === "delete"){
						coordinate[0].dataValues.visible = false;
						coordinate[0].save()
						.then(function(){
							callback();
						})
						.catch(function(err){
							callback(err);
							next(httpError(err));
						});
					}

				}).catch(function(err){
					next(httpError(err));
				});

			}, function(err){		
				if(err) {
					next(httpError(err));
				}

				placeUtils.retakeStatsAndSave(req.body.id, function(err, n){
					if(err) {
						next(httpError(err));
					}
					
					res.status(200).send(n);
				});
			});

		}).catch(function(err){
			next(httpError(err));
		});
		
	} else
		next(httpError(404));
};

/*-------------------------------------------------------------------*/
exports.delete = function(req,res,next){
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
