var async = require('async');
var parserTxt = require('./utils/parser');
var db = require('../models');

var UserIdentification = 1;

exports.create = function(req, res){
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
			doc.potencyMin = place.potencyMin;
			doc.potencyMax = place.potencyMax;
			doc.potencyAvg = place.potencyAvg;
			doc.sdPotencyAvg = place.sdPotencyAvg;
			doc.avgPotencySD = place.avgPotencySD;

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
		numberPotencyFrequency: data.numberPotencyFrequency,
		potencyMin: data.potencyMin,
		potencyMax : data.potencyMax,
		potencyAvg : data.potencyAvg,
		potencySD : data.potencySD,
		createdDate: data.createdDate,
		PlaceId: placeId,

	}).success(function(coordinate, created){
		if(created){
			insertPotencyFrequency(data.data,coordinate.id,function(err){
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
function insertPotencyFrequency(data,coordinateId,callback){	
	async.each(data, function(unit, callback) {
		unit.CoordinateId = coordinateId;
	  	callback();
	
	}, function(err){	    
	    if(err) 
	    	return callback(err);
	    
    	db.PotencyFrequency.bulkCreate(data)
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
			if(placeReturned.potencyMin > place.potencyMin)
				placeReturned.potencyMin = place.potencyMin;
			if(placeReturned.potencyMax < place.potencyMax)
				placeReturned.potencyMax = place.potencyMax;

			placeReturned.potencyAvg = (placeReturned.potencyAvg + place.potencyAvg)/2;
			placeReturned.avgPotencySD = (placeReturned.avgPotencySD + place.avgPotencySD)/2;

			if(count > 1){
				var sdPotencyAvg_M = placeReturned.potencyAvg + place.potencyAvg;
				var sdPotencyAvg_X = (placeReturned.potencyAvg * placeReturned.potencyAvg) + (place.potencyAvg * place.potencyAvg);
				sdPotencyAvg_X = Math.sqrt((sdPotencyAvg_X - (sdPotencyAvg_M*sdPotencyAvg_M)/count)/(count - 1));
				placeReturned.sdPotencyAvg = Number(sdPotencyAvg_X.toFixed(5));

			} else
				placeReturned.sdPotencyAvg = 0;

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