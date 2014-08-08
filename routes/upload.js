var parserTxt = require('./utils/parser');
var mongoose = require('mongoose');
var Place = mongoose.model('Place');

exports.create = function(req, res){
	
	if(req.body.json)
		saveInDB(req.body, function(place){
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
			placeReturned.save();
		} else {
			console.log('ya creado este place');
		}
		
		callback(placeReturned);
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