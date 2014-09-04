var async = require('async');
var parserTxt = require('./utils/parser');

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

// var userId = '53d6948c4f231a5934ac71b3';

// var saveInDB = function(place, callback){
// 	Place.findOrCreate({
// 		name: place.name,
// 		userId: userId
// 	}, 
// 	function(err, placeReturned, created) {
// 		if (err)
// 			res.send(err);

// 		if (created) {
// 			placeReturned.numberCoordinates = place.numberCoordinates;
// 			placeReturned.potencyMin = place.potencyMin;
// 			placeReturned.potencyMax = place.potencyMax;
// 			placeReturned.potencyAvg = place.potencyAvg;
// 			placeReturned.sdPotencyAvg = place.sdPotencyAvg;
// 			placeReturned.avgPotencySD = place.avgPotencySD;
// 			placeReturned.save(function (err,doc) {
// 				if (err) 
// 					return callback(err,null);
				
// 				saveCoordinates(doc,place.coordinates,function(err,doc){
// 					if (err) 
// 						return callback(err,null);
					
// 					callback(null,doc);
// 				});
// 			});

// 		} else {
// 			var coordinatesPlaceNew = JSON.parse(JSON.stringify(place.coordinates));
// 			var coordinatesPlace = [];
// 			async.each(placeReturned.coordinates, function(doc, callback) {
// 				var coordinate = doc.toObject();
// 				delete coordinate.data;
// 				delete coordinate.potencyMin;
// 				delete coordinate.potencyMax;
// 				delete coordinate.potencyAvg;
// 				delete coordinate.potencySD;
// 				delete coordinate.createdDate;
// 				delete coordinate._id;
// 				delete coordinate.numberPotencyFrequency;
// 				coordinatesPlace.push(coordinate);
// 		  		callback();

// 			}, function(err){
//     			if(err)
//     				res.send(err);

//     			async.each(coordinatesPlaceNew, function(doc, callback) {
// 					delete doc.data;
// 					delete doc.potencyMin;
// 					delete doc.potencyMax;
// 					delete doc.potencyAvg;
// 					delete doc.potencySD;
// 					delete doc.createdDate;
// 					delete doc.numberPotencyFrequency;
// 			  		callback();

// 				}, function(err){
// 	    			if(err)
// 	    				res.send(err);

// 	    			coordinatesPlace = coordinatesPlace.map(JSON.stringify);
// 					coordinatesPlaceNew = coordinatesPlaceNew.map(JSON.stringify);	

// 					coordinatesPlaceNew.forEach(function(value, index){
// 						if (coordinatesPlace.indexOf(value) == -1) 
// 				  			placeReturned.coordinates.push(place.coordinates[index]);
// 					});		

// 					placeReturned.save(function (err) {
// 						if (err) 
// 		  					callback(err);

// 		 				takeStatistics(placeReturned,place,function(err,placeWithStatistics){
// 		  					if (err) 
// 		  						callback(err);

// 		  					callback(null,placeWithStatistics);
// 		  				});
// 					});
	    			
// 				});
// 			});

// 		}

//   	});
// };


// var saveCoordinates = function(place, coordinates, mainCallback){
// 	var step = 20;
// 	var aux = step;
// 	var missing = coordinates.length;

// 	async.eachSeries(coordinates, function(coordinate, callback){
// 		place.coordinates.push(
// 			{
// 				latitude: coordinate.latitude,
// 				longitude: coordinate.longitude,
// 				numberPotencyFrequency: coordinate.numberPotencyFrequency,
// 				potencyMin: coordinate.potencyMin,
// 				potencyMax: coordinate.potencyMax,
// 				potencyAvg: coordinate.potencyAvg,
// 				potencySD: coordinate.potencySD,
// 				createdDate: coordinate.createdDate,
// 				data: coordinate.data 
// 	  		}
// 	  	);
// 	  	aux--;
	  	
// 	  	if(aux < 1 || missing < step) {
// 	  		place.save(function (err) {
// 				if(err)
// 					return callback(err);

// 				aux = step;
// 				missing -= step;

// 				callback();
// 			});	
// 	  	} else
// 	  		callback();

// 	}, function(err){
// 		if (err) 
//   			return mainCallback(err,null);
  		
// 		mainCallback(null,place);		
// 	});
// };


// var takeStatistics = function(placeReturned, place, callback){	

// 	if(placeReturned.numberCoordinates != placeReturned.coordinates.length){
		
// 		placeReturned.numberCoordinates = placeReturned.coordinates.length;	
// 		if(placeReturned.potencyMin > place.potencyMin)
// 			placeReturned.potencyMin = place.potencyMin;
// 		if(placeReturned.potencyMax < place.potencyMax)
// 			placeReturned.potencyMax = place.potencyMax;

// 		placeReturned.potencyAvg = (placeReturned.potencyAvg + place.potencyAvg)/2;
// 		placeReturned.avgPotencySD = (placeReturned.avgPotencySD + place.avgPotencySD)/2;

// 		if(placeReturned.coordinates.length > 1){
// 			var sdPotencyAvg_M = placeReturned.potencyAvg + place.potencyAvg;
// 			var sdPotencyAvg_X = (placeReturned.potencyAvg * placeReturned.potencyAvg) + (place.potencyAvg * place.potencyAvg);
// 			sdPotencyAvg_X = Math.sqrt((sdPotencyAvg_X - (sdPotencyAvg_M*sdPotencyAvg_M)/placeReturned.coordinates.length)/(placeReturned.coordinates.length - 1));
// 			placeReturned.sdPotencyAvg = Number(sdPotencyAvg_X.toFixed(5));

// 		} else
// 			placeReturned.sdPotencyAvg = 0;

// 		placeReturned.save(function (err) {
// 			if (err) 
// 				callback(err);

// 			callback(null,placeReturned);
// 		});


// 	} else
// 		callback(null,placeReturned);
// };


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