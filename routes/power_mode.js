var _ = require('underscore');
var db = require('../models');
var httpError = require('build-http-error');
var utils = require('./utils/Utils');
var async = require('async');

var UserIdentification = 1;

/*-------------------------------------------------------------------*/
exports.save = function(id,modes,isNew,callback){
	if(utils.isNumber(id)){
		var v = [];
		_.each(_.keys(modes), function(key){
			v.push({
				power: key,
				frequency: modes[key],
				PlaceId: id
			});
		});

		if(isNew){
			console.log('* SAVING POWER MODE *');
		    db.PowerMode.bulkCreate(v)
			.success(function() { 
				callback();
			}).error(function(err){
				callback(err);
			});

		} else {
			console.log('* UPDATING POWER MODE *');	

			db.PowerMode.destroy({
	    		where: {
					PlaceId: id
				}},
				{
					truncate: true
				})
			.success(function(){
				db.PowerMode.bulkCreate(v)
				.success(function() { 
					callback();
				}).error(function(err){
					callback(err);
				});
			}).error(function(err){
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
		}).success(function(place){
			if(!place){
				next(httpError(404));
				return;
			}
		
			place.getPowerModes({
				order: 'power DESC',
			})	
			.success(function(data){
				if(data.length === 0)
					return next(httpError(404));

				res.status(200).send(data);

			}).error(function(err){
				next(httpError(err));
			});
		
		}).error(function(err){
			next(httpError(err));
		});
	} else
		next(httpError(404));
};

/*-------------------------------------------------------------------*/
exports.delete = function(req,res,next){
	if(utils.isNumber(req.params.idPlace) && utils.isNumber(req.params.id)){
		db.PowerMode.find({
			where: {
				id: req.params.id
			},
			raw: true
		}).success(function(outlayer){
			
			db.Capture.findAll({
				where: {
					power: outlayer.dataValues.power
				}
			}).success(function(captures){
				console.log(captures);

			}).error(function(err){
				next(httpError(err));
			});

		}).error(function(err){
			next(httpError(err));
		});
	} else
		next(httpError(404));
};