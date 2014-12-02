var _ = require("underscore");
var async = require('async');
var parserTxt = require('./utils/parser');
var utils = require('./utils/utils');
var db = require('../models');

var UserIdentification = 1;

exports.createPlace = function(req, res){
	if(Object.keys(req.body).length === 0)
		res.status(500).send({ error: 'something blew up' });
	
	else {
		if(req.body.json){
			/*-------------------------*/
			console.log('*PARSING*');
			/*-------------------------*/
			reduceCommonGps(req.body, function(newPlace){
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
function reduceCommonGps(place,callback){
	var newPlace = {};
	newPlace.name = place.name;
	newPlace.coordinates = [];
	newPlace.numberCoordinates = 0;
	newPlace.powerMin = null;
	newPlace.powerMax = null;
	newPlace.powerAvg = null;
	newPlace.sdPowerAvg = null;
	newPlace.avgPowerSD = null;
	newPlace.numberPowerFrequency = null;
    newPlace.frequencyMin = null;
    newPlace.frequencyMax = null;
    newPlace.totalDistance = 0;
    newPlace.distaceAvg = 0;

    /* -- vars for take stats -- */
	newPlace.placePowerSD_X = null;
	newPlace.placePowerSD_M = null;
	newPlace.countSamplesDistance = 0;
	/* ------------------------- */

	var samplesObj = _.groupBy(place.coordinates, function(sample){
		return sample.latitude + sample.longitude;
	});

	_.each(_.keys(samplesObj), function(key){
		var samplesToReduce = samplesObj[key];
		var union = [];
	
		_.each(samplesToReduce, function(item){
			union = union.concat(item.data);
		});

		var groupByFrequencies = _.groupBy(union, function(item){
			return item.frequency;
		});
		
		var data = [];
		var frequencies = _.keys(groupByFrequencies);
		_.each(frequencies, function(key){
			var operation;
			switch (place.gpsFunction) {
			    case 'avg':
			        operation = _.reduce(groupByFrequencies[key], function(memo, item){ 
						return memo + item.power; 
					}, 0);
					operation /= groupByFrequencies[key].length;
			        break;

			    case 'max':
			        operation = _.reduce(groupByFrequencies[key], function(memo, item){ 
			        	if(memo < item.power)
							return item.power;
						else
							return memo;
					}, groupByFrequencies[key][0].power);
			        break;

			    case 'min':
			        operation = _.reduce(groupByFrequencies[key], function(memo, item){ 
			        	if(memo > item.power)
							return item.power;
						else
							return memo;
					}, groupByFrequencies[key][0].power);
			        break;

			    case 'first':
			        operation = groupByFrequencies[key][0].power;
			        break;

			    case 'last':
			        operation = groupByFrequencies[key][groupByFrequencies[key].length - 1].power;
			        break;
			}
			data.push({ frequency: Number(key), power:operation });	
		});

		var coord = takeCoordStats({
			latitude: samplesObj[key][0].latitude,
			longitude: samplesObj[key][0].longitude,
			data: data,
			createdDate: samplesObj[key][0].createdDate
		});

		saveNewPlace(coord, newPlace);
	});

	takePlaceStats(newPlace);
	callback(newPlace);
}


function takeCoordStats(coord){

	var coordinate = {};
	coordiante = _.extend(coordinate, coord);

	var numberPowerFrequency = 0;
	var frequencyMin = null;
	var frequencyMax = null;
	var powerMin = null;
	var powerMax = null;
	var powerAvg = null;
	var powerSD_X = null;
	var powerSD_M = null;

	_.each(coord.data,function(item){
		if(powerMin === null && frequencyMin === null){
			powerMin = powerMax = item.power;
			frequencyMin = frequencyMax = item.frequency;
		
		} else {
			if (frequencyMax < item.frequency)
				frequencyMax = item.frequency;
			if (frequencyMin > item.frequency)
				frequencyMin = item.frequency;

			if (powerMax < item.power)
				powerMax = item.power;
			if (powerMin > item.power)
				powerMin = item.power;
		}

		powerAvg += item.power;
		powerSD_M += item.power;
		powerSD_X += (item.power * item.power);
		numberPowerFrequency += 1;
	});

	coordinate.powerMin = Number(powerMin.toFixed(5));
	coordinate.powerMax = Number(powerMax.toFixed(5));
	powerAvg = powerAvg / numberPowerFrequency;
	coordinate.powerAvg = Number(powerAvg.toFixed(5));
	powerSD_X = Math.sqrt((powerSD_X - (powerSD_M*powerSD_M)/numberPowerFrequency)/(numberPowerFrequency - 1));
	coordinate.powerSD = Number(powerSD_X.toFixed(5));

	return {
		coordinate: coordinate,
		frequencyMin: frequencyMin,
		frequencyMax: frequencyMax,
		numberPowerFrequency: numberPowerFrequency
	};
}


function saveNewPlace(coord, newPlace){
	newPlace.coordinates.push(coord.coordinate);
	newPlace.numberCoordinates += 1;
	newPlace.powerAvg += coord.coordinate.powerAvg;	
	newPlace.avgPowerSD += coord.coordinate.powerSD;
	newPlace.placePowerSD_M += coord.coordinate.powerAvg;
	newPlace.placePowerSD_X += (coord.coordinate.powerAvg * coord.coordinate.powerAvg);

	if(newPlace.powerMin === null)
		newPlace.powerMin = coord.coordinate.powerMin;
	if(newPlace.powerMax === null)
		newPlace.powerMax = coord.coordinate.powerMax;
	if (newPlace.powerMin > coord.coordinate.powerMin)
		newPlace.powerMin = coord.coordinate.powerMin;
	if (newPlace.powerMax < coord.coordinate.powerMax)
		newPlace.powerMax = coord.coordinate.powerMax;

	if(newPlace.frequencyMin === null)
		newPlace.frequencyMin = coord.frequencyMin;
	if(newPlace.powerMax === null)
		newPlace.frequencyMax = coord.frequencyMax;
	if (newPlace.frequencyMin > coord.frequencyMin)
		newPlace.frequencyMin = coord.frequencyMin;
	if (newPlace.frequencyMax < coord.frequencyMax)
		newPlace.frequencyMax = coord.frequencyMax;

	if(newPlace.numberPowerFrequency === null)
		newPlace.numberPowerFrequency = coord.numberPowerFrequency;

	if(newPlace.coordinates.length > 1){
		var lastItem = newPlace.coordinates[newPlace.coordinates.length - 2];
		var currentItem = newPlace.coordinates[newPlace.coordinates.length - 1];
		newPlace.totalDistance += utils.GetDistanceFromLatLonInKm(lastItem.latitude, lastItem.longitude, currentItem.latitude, currentItem.longitude);
		newPlace.countSamplesDistance += 1;
	}
}

function takePlaceStats(newPlace){
	newPlace.powerAvg = newPlace.powerAvg / newPlace.numberCoordinates;
	newPlace.powerAvg = Number(newPlace.powerAvg.toFixed(5));
	
	if(newPlace.numberCoordinates === 1)
		newPlace.sdPowerAvg = 0;
	
	else {
		newPlace.placePowerSD_X = Math.sqrt((newPlace.placePowerSD_X - (newPlace.placePowerSD_M*newPlace.placePowerSD_M)/newPlace.numberCoordinates)/(newPlace.numberCoordinates - 1));
		newPlace.sdPowerAvg = Number(newPlace.placePowerSD_X.toFixed(5));
	}
	
	newPlace.avgPowerSD = newPlace.avgPowerSD / newPlace.numberCoordinates;
	newPlace.avgPowerSD = Number(newPlace.avgPowerSD.toFixed(5));

	if(newPlace.coordinates.length > 1)
		newPlace.distaceAvg = newPlace.totalDistance/newPlace.countSamplesDistance;
	else 
		newPlace.totalDistance = newPlace.distaceAvg = 0;

	/* -- delete vars for take stats -- */
	delete newPlace.placePowerSD_X;
	delete newPlace.placePowerSD_M;
	delete newPlace.countSamplesDistance;
	/* -------------------------------- */
}

/*--------------------------------------------------------------------------------------------------------------*/
var saveInDB = function(place, callback){
	db.Place.findOrCreate({
		UserId:UserIdentification,
		name: place.name, 

	}).success(function(doc, created){

		if(created) {
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

			doc.save().success(function(){
				insertCoordinates(place, doc, function(err){
			    	if (err)
						return callback(err,null);
					
					callback(null,doc);
			    });
			})
			.error(function(err){
				callback(err,null);
			});
		}

		else {
			insertCoordinates(place, doc, function(err){
		    	if (err)
					return callback(err,null);

				takeStatistics(doc,place,function(err,placeWithStatistics){
					if (err)
						return callback(err,null);

					callback(null,placeWithStatistics);
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
	    
    	db.PowerFrequency.bulkCreate(data)
		.success(function() { 
			callback();
		}).error(function(err){
			return callback(err);
		});
	});
}

/*--------------------------------------------------------------------------------------------------------------*/
var takeStatistics = function(placeReturned, place, callback){	

	db.Coordinate.count({ where: {PlaceId:placeReturned.id} })
	.success(function(count){
		if(count != placeReturned.numberCoordinates){

	  		placeReturned.numberCoordinates = count;	
			if(placeReturned.powerMin > place.powerMin)
				placeReturned.powerMin = place.powerMin;
			if(placeReturned.powerMax < place.powerMax)
				placeReturned.powerMax = place.powerMax;

			placeReturned.powerAvg = (placeReturned.powerAvg + place.powerAvg)/2;
			placeReturned.avgPowerSD = (placeReturned.avgPowerSD + place.avgPowerSD)/2;

			if(count > 1){
				var sdPowerAvg_M = placeReturned.powerAvg + place.powerAvg;
				var sdPowerAvg_X = (placeReturned.powerAvg * placeReturned.powerAvg) + (place.powerAvg * place.powerAvg);
				sdPowerAvg_X = Math.sqrt((sdPowerAvg_X - (sdPowerAvg_M*sdPowerAvg_M)/count)/(count - 1));
				placeReturned.sdPowerAvg = Number(sdPowerAvg_X.toFixed(5));

				placeReturned.totalDistance = placeReturned.totalDistance + place.totalDistance;
				placeReturned.distaceAvg = (placeReturned.distaceAvg + place.distaceAvg)/2;

			} else
				placeReturned.sdPowerAvg = 0;

			placeReturned.save().success(function(){
				callback(null,placeReturned);
			})
			.error(function(err){
				return callback(err,null);
			});

	  	} else
	  		callback(null,placeReturned);
	})
	.error(function(err){
		return callback(err,null);
	});

};

/*--------------------------------------------------------------------------------------------------------------*/
var parserFiles = function(files){
	// console.log(req.body);

	// if (req.body.zone && req.files.data && req.files.data.length > 0) {
		
	// 	parse.toJSON(req.body.zone,req.files.data, function(data){

	// 		fs.writeFile('public/my.json', JSON.stringify(data, null, 4), function(err) {
	// 		    if(err) 
	// 		      	console.log(err);
	// 		    else 
	// 		      	res.redirect('/');
	// 		});

	// 	});
	// }
	// else {
	// 	// call errorHanldler
	// 	console.log('Error occured incomplete data');
	// 	res.send('ERROR');
	// }
};