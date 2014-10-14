var async = require('async');
var parserTxt = require('./utils/parser');
var db = require('../models');

var UserIdentification = 1;

exports.createPlace = function(req, res){
	if(Object.keys(req.body).length === 0)
		res.status(500).send({ error: 'something blew up' });
	
	else {
		if(req.body.json){
			saveInDB(req.body, function(err,place){
				if(err) {
					console.error(err);
					res.status(500).send({ error: err });
				}
				res.send(place);
			});
		}
		else	
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
			doc.numberCoordinates = place.numberCoordinates;
			doc.powerMin = place.powerMin;
			doc.powerMax = place.powerMax;
			doc.powerAvg = place.powerAvg;
			doc.sdPowerAvg = place.sdPowerAvg;
			doc.avgPowerSD = place.avgPowerSD;

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
		numberPowerFrequency: data.numberPowerFrequency,
		frequencyMin: data.frequencyMin,
		frequencyMax: data.frequencyMax,
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