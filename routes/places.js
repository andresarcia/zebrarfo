var db = require('../models');
var async = require('async');
var httpError = require('build-http-error');
var _ = require('underscore');
var utils = require('./utils/Utils');
var builder = require('./utils/PlaceBuilder');
var placeUtils = require('./utils/PlaceUtils');
var coordinate = require('./coordinates');
var mode = require('./power_mode');

var UserIdentification = 1;

/*-------------------------------------------------------------------*/
exports.create = function(req,res,next){
	if(Object.keys(req.body).length === 0)
		next(httpError(404,'something blew up with your browser, try to update it'));
	
	else {
		if(req.body.json){
			console.log('* CREATING NEW PLACE *');
			builder.create(req.body, function(err, place){
				if(err) 
					next(httpError(404,err));

				db.Place.findOrCreate({
					UserId:UserIdentification,
					name: place.name, 

				}).success(function(n, created){
					if(created) {
						console.log('* SAVING PLACE *');
						n.numberCoordinates = place.numberCoordinates;
						n.powerMin = place.powerMin;
						n.powerMax = place.powerMax;
						n.powerAvg = place.powerAvg;
						n.sdPowerAvg = place.sdPowerAvg;
						n.avgPowerSD = place.avgPowerSD;
						n.frequencyMin = place.frequencyMin;
						n.frequencyMax = place.frequencyMax;
						n.numberPowerFrequency = place.numberPowerFrequency;
						n.totalDistance = place.totalDistance;
						n.distaceAvg = place.distaceAvg;
						n.distaceMin = place.distaceMin;
						n.distaceMax = place.distaceMax;

						n.save()
						.success(function(){
							coordinate.save(n.id,place.coordinates,function(err){
								if(err)
									next(httpError(err));

								mode.save(n.id,place.mode,true,function(err){
									if(err)
										next(httpError(err));
									
									res.status(200).send(n);
								});
							});

						}).error(function(err){
							next(httpError(err));
						});
					
					} else {
						console.log('* UPDATING OLD PLACE *');
						coordinate.save(n.id,place.coordinates,function(err){
							if(err)
								next(httpError(err));

							mode.save(n.id,place.mode,false,function(err){
								if(err)
									next(httpError(err));
								
								placeUtils.takeStatsComparingPlace(n.id,place,function(err,n){
									if (err)
										next(httpError(err));

									res.status(200).send(n);
								});
								
							});
						});
					}

				}).error(function(err){
					next(httpError(err));
				});
			});
		
		} else	
			next(httpError(404,'please update your browser!!'));
	}
};

/*-------------------------------------------------------------------*/
exports.save = function(place, callback){
	place.save()
	.success(function(){
		callback(null)
	}).error(function(err){
		callback(err);
	});
};

/*-------------------------------------------------------------------*/
exports.list = function(req,res,next){
	db.Place.findAll({
		where: {
			UserId:UserIdentification,
			visible: true
		}
	}).success(function(places){
		res.status(200).send(places);
	})
	.error(function(err){
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
		}).success(function(place){
			if(!place){
				next(httpError(404));
				return;
			}
			
			res.status(200).send(place);	
		
		}).error(function(err){
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
				id: req.params.id,
				visible: true
			},
		}).success(function(place){
			if(!place){
				next(httpError(404));
				return;
			}

			async.each(req.body.coordinates, function(coord, callback) {
				place.getCoordinates({
					where: {
						id: coord.id
					}
				}).success(function(coordinate){
					if(!coordinate){
						next(httpError(404));
						return;
					}
					if(coord.action === "delete"){
						coordinate[0].dataValues.visible = false;
						coordinate[0].save()
						.success(function(){
							callback();
						}).error(function(err){
							callback(err);
						});
					}

				}).error(function(err){
					next(httpError(err));
				});

			}, function(err){	    
				if(err) {
			    	next(httpError(err));
			    }

			    placeUtils.retakeStats(req.body.id, function(err, n){
			    	if(err) {
				    	next(httpError(err));
				    }

				    mode.save(req.body.id,n.mode,false,function(err){
						if(err)
							next(httpError(err));
						
						db.Place.find({
							where: {
								UserId:UserIdentification,
								id: req.params.id,
								visible: true
							}
						}).success(function(o){
							o.numberCoordinates = n.numberCoordinates;
							o.powerMin = n.powerMin;
							o.powerMax = n.powerMax;
							o.powerAvg = n.powerAvg;
							o.sdPowerAvg = n.sdPowerAvg;
							o.avgPowerSD = n.avgPowerSD;
							o.numberPowerFrequency = n.numberPowerFrequency;
							o.frequencyMin = n.frequencyMin;
							o.frequencyMax = n.frequencyMax;
							o.totalDistance = n.totalDistance;
							o.distaceAvg = n.distaceAvg;
							o.distaceMin = n.distaceMin;
							o.distaceMax = n.distaceMax;

							o.save()
							.success(function(){
								res.status(200).send(n);
							}).error(function(err){
								next(httpError(err));
							});
						}).error(function(err){
							next(httpError(err));
						});
					});
			    });
			});

		}).error(function(err){
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
		}).success(function(place){
			if(!place){
				next(httpError(404));
				return;
			}

			place.destroy()
			.success(function() {
				res.status(200).send({ msg:'Place '+req.params.id+ ' deleted' });
			}).error(function(err){
				next(httpError(err));
			});

		}).error(function(err){
			next(httpError(err));
		});
	
	} else
		next(httpError(404));
};
