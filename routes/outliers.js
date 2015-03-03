var _ = require('underscore');
var db = require('../models');
var httpError = require('build-http-error');
var utils = require('./utils/Utils');
var placeUtils = require('./utils/PlaceUtils');
var async = require('async');

var UserIdentification = 1;

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
				callback();
			}).catch(function(err){
				callback(err);
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
					callback();
				}).catch(function(err){
					callback(err);
				});
			}).catch(function(err){
				callback(err)
			});
		}
	} else
		callback("ID")
};

/*-------------------------------------------------------------------*/
exports.list = function(req,res,next){
	if(utils.isNumber(req.params.id)){
		db.Place.find({
			where: {
				UserId:UserIdentification,
				id: req.params.id,
				visible: true
			},
		}).then(function(place){
			if(!place){
				next(httpError(404));
				return;
			}
		
			place.getOutliers({
				order: 'power DESC',
			})	
			.then(function(data){
				if(data.length === 0)
					return next(httpError(404));

				res.status(200).send(data);

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
exports.delete = function(req,res,next){
	if(utils.isNumber(req.params.idPlace) && utils.isNumber(req.params.id)){
		db.Place.find({
			where: {
				UserId:UserIdentification,
				id: req.params.idPlace,
				visible: true
			},
		}).then(function(place){
			if(!place){
				next(httpError(404));
				return;
			}

			place.getOutliers({
				where: {
					id: req.params.id
				}
			}).then(function(outlayer){
				if(outlayer.length == 0){
					next(httpError(404));
					return;
				}

				db.Capture.destroy({
		    		where: {
						power: outlayer[0].dataValues.power
					}
				})
					// },
					// {
					// 	truncate: true
					// })
				.then(function(){
					// placeUtils.retakeStatsAndSave(req.params.idPlace, function(err, n){
				 //    	if(err) {
		   //  				next(httpError(err));
		   //  			}
				    	
				 //    	res.status(200).send(n);
				 //    });
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