var async = require('async');
var parserTxt = require('./utils/parser');
var mongoose = require('mongoose');
var Place = mongoose.model('Place');
var Coordinate = mongoose.model('Coordinate');

exports.create = function(req, res){
	
	if(req.body.json){
		saveInDB(req.body, function(err,place){

			if(err)
				res.send(err);
					
			res.send(place);
		});
	}
	else	
		parserFiles(req.body);
};

var userId = '53d6948c4f231a5934ac71b3';

var saveInDB = function(place, callback){
	Place.findOrCreate({
		name: place.name,
		userId: userId
	}, 
	function(err, placeReturned, created) {

		if (err)
			res.send(err);

		if (created) {
			placeReturned.numberCoordinates = place.numberCoordinates;
			placeReturned.potencyMin = place.potencyMin;
			placeReturned.potencyMax = place.potencyMax;
			placeReturned.potencyAvg = place.potencyAvg;
			placeReturned.sdPotencyAvg = place.sdPotencyAvg;
			placeReturned.avgPotencySD = place.avgPotencySD;
			
			placeReturned.save(function (err) {
				if (err) 
  					callback(err);

  				saveCoordinates(place.coordinates,placeReturned.id, function(err){
					if (err) 
	  					callback(err);
	  				callback(null,placeReturned);
				});

			});

		} else {
			saveCoordinates(place.coordinates,placeReturned.id, function(err){
				if (err) 
  					callback(err);
  				
  				takeStatistics(placeReturned,place,function(err,placeWithStatistics){
  					if (err) 
  						callback(err);

  					callback(null,placeWithStatistics);
  				});

			});
		}

  	});
};


var saveCoordinates = function(coordiantes, placeId, firstCallback){
	var numFilesProcessed = 0;

	async.each(coordiantes, function(coordinate, callback) {

		Coordinate.findOrCreate({
			latitude: coordinate.latitude,
			longitude: coordinate.longitude,
			numberPotencyFrequency: coordinate.numberPotencyFrequency,
			createdDate: coordinate.createdDate,
			potencyMin: coordinate.potencyMin,
			potencyMax: coordinate.potencyMax,
			potencyAvg: coordinate.potencyAvg,
			potencySd: coordinate.potencySD,
			placeId: placeId
		}, 
		function(err, coord, created) {

			if (err)
				firstCallback(err);

			if (created) {
				coord.data = coordinate.data;
				coord.save(function (err) {
					if (err) 
	  					firstCallback(err);

	  				numFilesProcessed++;
	  				callback();
				});

			} else {
				numFilesProcessed++;
				callback();
			}
	  	});
  
	}, function(err){
    	if(err)
    		firstCallback(err);

    	if(coordiantes.length == numFilesProcessed)
    		firstCallback();  
	});
};


var takeStatistics = function(placeReturned, place, callback){
	
	Coordinate.count({ placeId: placeReturned.id }, function (err, count) {
		if(err)
			callback(err);

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

			placeReturned.save(function (err) {
				if (err) 
  					callback(err);

  				callback(null,placeReturned);
			});

		} else 
			callback(null,placeReturned);
	});
};


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