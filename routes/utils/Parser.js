var lineReader = require('line-reader'),
	async = require('async'),
	path = require('path'),
	fs = require('graceful-fs');

/*--------------------------------------------------------------------------------------------------------------*/
exports.toJSON = function(zone, data, callback){

	var place = {};
	place.name = zone;
	place.numberCoordinates = 0;
	place.potencyMin = null;
	place.potencyMax = null;
	place.potencyAvg = null;
	place.sdPotencyAvg = null;
	placePotencySD_X = null;
	placePotencySD_M = null;
	place.avgPotencySD = null;
	
	place.coordinates = [];

	async.series([
		function(callback){

			if(data[0] === undefined){
				if (path.extname(data.name).toLowerCase() === '.txt') 
					extractCoordinateObject(place,data);
				callback();
			}
			else if(data.length > 1) {
				async.eachSeries(data, function(file, callback) {
					if (path.extname(file.name).toLowerCase() === '.txt') 
						extractCoordinateObject(place,file);
					
					callback();
				});	
				callback();	
			}

		},function(callback2){
			place.potencyAvg = place.potencyAvg / place.numberCoordinates;
			place.potencyAvg = Number(place.potencyAvg.toFixed(5));
			
			if(place.numberCoordinates === 1)
				place.sdPotencyAvg = 0;
			else{
				placePotencySD_X = Math.sqrt((placePotencySD_X - (placePotencySD_M*placePotencySD_M)/place.numberCoordinates)/(place.numberCoordinates - 1));
				place.sdPotencyAvg = Number(placePotencySD_X.toFixed(5));
			}
			place.avgPotencySD = place.avgPotencySD / place.numberCoordinates;
			place.avgPotencySD = Number(place.avgPotencySD.toFixed(5));
			callback(place);
		}
	]);
};

/*--------------------------------------------------------------------------------------------------------------*/
function extractCoordinateObject(place, file){
	async.series([
		function(callback){
			arrayCoordinate = [];
			arrayFrequencyPotency = [];
			coordinate = {};
			numberPotencyFrequency = 0;
			potencyMin = null;
			potencyMax = null;
			potencyAvg = null;
			potencySD_X = null;
			potencySD_M = null;
			callback();
		},
		function(callback){
		    array = fs.readFileSync(file.path).toString().split("\n");
			callback();
		},
		function(callback){
			async.eachSeries(array, function(line, callback) {
		    	lineSplit = line.split("\t");	
				if(lineSplit.length == 2){
					var newPotency = Number(lineSplit[1]);
					if(potencyMin === null)
						potencyMin = potencyMax = newPotency;
					else {
						if (potencyMax < newPotency)
							potencyMax = newPotency;
						if (potencyMin > newPotency)
							potencyMin = newPotency;
					}
					potencyAvg = potencyAvg + newPotency;
					potencySD_M = potencySD_M + newPotency;
					potencySD_X = potencySD_X + (newPotency * newPotency);
					numberPotencyFrequency ++;
					arrayFrequencyPotency.push({ frequency:Number(lineSplit[0]), potency:Number(lineSplit[1])});
				}
				else if(lineSplit.length == 1)
					arrayCoordinate.push(lineSplit);

				callback();
			}, null);
				
		callback();
		},
		function(callback){
			coordinate.latitude = Number(arrayCoordinate[0]);
			coordinate.longitude = Number(arrayCoordinate[1]);
			coordinate.numberPotencyFrequency = numberPotencyFrequency;
			coordinate.potencyMin = Number(potencyMin.toFixed(5));
			coordinate.potencyMax = Number(potencyMax.toFixed(5));
			potencyAvg = potencyAvg / numberPotencyFrequency;
			coordinate.potencyAvg = Number(potencyAvg.toFixed(5));
			potencySD_X = Math.sqrt((potencySD_X - (potencySD_M*potencySD_M)/numberPotencyFrequency)/(numberPotencyFrequency - 1));
			coordinate.potencySD = Number(potencySD_X.toFixed(5));
			coordinate.createdDate = String(arrayCoordinate[2]);
			coordinate.data = arrayFrequencyPotency;
			
			place.coordinates.push(coordinate);
			place.numberCoordinates ++;
			place.potencyAvg = place.potencyAvg + coordinate.potencyAvg;	
			place.avgPotencySD = place.avgPotencySD + coordinate.potencySD;
			placePotencySD_M = placePotencySD_M + coordinate.potencyAvg;
			placePotencySD_X = placePotencySD_X + (coordinate.potencyAvg * coordinate.potencyAvg);

			if(place.potencyMin === null)
				place.potencyMin = coordinate.potencyMin;
			if(place.potencyMax === null)
				place.potencyMax = coordinate.potencyMax;
			if (place.potencyMin > coordinate.potencyMin)
				place.potencyMin = coordinate.potencyMin;
			if (place.potencyMax < coordinate.potencyMax)
				place.potencyMax = coordinate.potencyMax;

			callback();
		}
	]);
}
