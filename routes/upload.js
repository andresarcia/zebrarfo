var async = require('async');
var parserTxt = require('./utils/parser');
var mongoose = require('mongoose');
var Place = mongoose.model('Place');
var Coordinate = mongoose.model('Coordinate');

exports.create = function(req, res){
	
	if(req.body.json)
		saveInDB(req.body, function(err,place){
			if(err)
				res.send(err);
					
			res.send(place);
		});
	else	
		parserFiles(req.body);
};


var saveInDB = function(place, callback){
	Place.findOrCreate({
		name: place.name,
		userId: '53d6948c4f231a5934ac71b3'
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
  				callback(null,placeReturned);
  				// TOMAR ESTADISTICAS
			});
		}

  	});
};


var saveCoordinates = function(coordiantes, placeId, firstCallback){
	
	async.eachSeries(coordiantes, function(coordinate, callback) {

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
				coord.save();
				coord.save(function (err) {
					if (err) 
	  					firstCallback(err);

	  				callback();
				});
			} else
				callback();
	  	});
  
	}, function(err){
    	if(err)
    		firstCallback(err);

    	firstCallback();  
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