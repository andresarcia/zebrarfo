var async = require('async');
var _ = require('underscore');
var newPlaceBuilder = require('./utils/NewPlaceBuilder');
var placeUtils = require('./utils/PlaceUtils');
var db = require('../models');

var UserIdentification = 1;

exports.createPlace = function(req, res){
	if(Object.keys(req.body).length === 0)
		res.status(404).send({ error: 'something blew up' });
	
	else {
		if(req.body.json){
			/*-------------------------*/
			console.log('*PARSING*');
			/*-------------------------*/
			newPlaceBuilder.build(req.body, function(newPlace){
				/*-------------------------*/
				console.log(newPlace);
				console.log('');
				console.log('*SAVING*');
				/*-------------------------*/
				saveInDB(newPlace, function(err,place){
					if(err) {
						console.error(err);
						res.status(500).send({ error: err });
					}
					res.send(place);
				});
			});
		
		} else	
			parserFiles(req.body);
	}
};

/*--------------------------------------------------------------------------------------------------------------*/
var saveInDB = function(place, callback){
	db.Place.findOrCreate({
		UserId:UserIdentification,
		name: place.name, 

	}).success(function(doc, created){

		if(created) {
			console.log('');
			console.log('*CREATING NEW PLACE*');

			doc.numberCoordinates = place.numberCoordinates;
			doc.powerMin = place.powerMin;
			doc.powerMax = place.powerMax;
			doc.powerAvg = place.powerAvg;
			doc.sdPowerAvg = place.sdPowerAvg;
			doc.avgPowerSD = place.avgPowerSD;
			doc.frequencyMin = place.frequencyMin;
			doc.frequencyMax = place.frequencyMax;
			doc.numberPowerFrequency = place.numberPowerFrequency;
			doc.totalDistance = place.totalDistance;
			doc.distaceAvg = place.distaceAvg;
			doc.distaceMin = place.distaceMin;
			doc.distaceMax = place.distaceMax;

			doc.save().success(function(){
				insertCoordinates(place, doc, function(err){
			    	if (err)
						return callback(err,null);
					
					placeUtils.takePowerModeFromPlace(doc.id, function(err){
					// 	console.log("listo");
						callback(null,doc);
					});

			    });
			})
			.error(function(err){
				callback(err,null);
			});
		}

		else {
			console.log('');
			console.log('*UPDATING OLD PLACE*');
			insertCoordinates(place, doc, function(err){
		    	if (err)
					return callback(err,null);

				placeUtils.takeStatisticsFromOldPlace(doc.id,place,function(err,n){
					if (err)
						return callback(err,null);

					callback(null,n);
				});
		    });
		}

	})
	.error(function(err){
		callback(err,null);
	});
};

/*--------------------------------------------------------------------------------------------------------------*/
function insertCoordinates(data,place,callback){
	async.each(data.coordinates, function(coordinate, callback) {
		insertCoordinate(coordinate,place.id,function(err){
			if(err) 
	    		return callback(err);

	   		callback();
	  	});
	  
	}, function(err){	    
	    if(err) 
	    	return callback(err);
	    
	    callback();
	});
}

/*--------------------------------------------------------------------------------------------------------------*/
function insertCoordinate(data,placeId,callback){
	db.Coordinate.findOrCreate({
		latitude: data.latitude,
		longitude: data.longitude,
		powerMin: data.powerMin,
		powerMax : data.powerMax,
		powerAvg : data.powerAvg,
		powerSD : data.powerSD,
		createdDate: data.createdDate,
		PlaceId: placeId,

	}).success(function(coordinate, created){
		if(created){
			insertPowerFrequency(data.data,coordinate.id,function(err){
				if (err)
					return callback(err);
				
				callback();
			});	
		} else 
			callback();
	})
	.error(function(err){
		return callback(err);
	});
}

/*--------------------------------------------------------------------------------------------------------------*/
function insertPowerFrequency(data,coordinateId,callback){	
	async.each(data, function(unit, callback) {
		unit.CoordinateId = coordinateId;
	  	callback();
	
	}, function(err){	    
	    if(err) 
	    	return callback(err);

    	db.Capture.bulkCreate(data)
		.success(function() { 
			callback();
		}).error(function(err){
			return callback(err);
		});
	});
}

/*--------------------------------------------------------------------------------------------------------------*/
