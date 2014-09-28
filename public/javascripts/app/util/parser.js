$(document).ready(function(){

	parserFiles = function(files,place,callbackNumFilesProcessed,callback){
		var numFilesParser = 0;
		var numFiles = files.length;
		var newPlace = null;
		place.coordinates = [];

		_.each(files, function(file){
   			var fr = new FileReader();
		    fr.onload = function(e) { 
		        parser(place,fr.result);
		        numFilesParser++;
		        callbackNumFilesProcessed(numFilesParser);
		        if (numFilesParser == numFiles) 
		        	callback(formatStatPlace(place));
		    };
		    fr.readAsText(file);
		});
	};

	/* ------------------------------------------------------------------------- */
	var formatStatPlace = function(place){
		place.potencyAvg = place.potencyAvg / place.numberCoordinates;
		place.potencyAvg = Number(place.potencyAvg.toFixed(5));
		
		if(place.numberCoordinates === 1)
			place.sdPotencyAvg = 0;
		else {
			place.placePotencySD_X = Math.sqrt((place.placePotencySD_X - (place.placePotencySD_M*place.placePotencySD_M)/place.numberCoordinates)/(place.numberCoordinates - 1));
			place.sdPotencyAvg = Number(place.placePotencySD_X.toFixed(5));
		}
		place.avgPotencySD = place.avgPotencySD / place.numberCoordinates;
		place.avgPotencySD = Number(place.avgPotencySD.toFixed(5));

		delete place.placePotencySD_X;
		delete place.placePotencySD_M;

		return place;
	};

	/* ------------------------------------------------------------------------- */
	var parser = function(place,data){
		
		arrayCoordinate = [];
		arrayFrequencyPotency = [];
		coordinate = {};
		numberPotencyFrequency = 0;
		potencyMin = null;
		potencyMax = null;
		potencyAvg = null;
		potencySD_X = null;
		potencySD_M = null;

		var lines = data.split("\n");
		        
        _.each(lines, function(line){
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
        });

        coordinate = {};
        coordinate.latitude = Number(arrayCoordinate[0]);
		coordinate.longitude = Number(arrayCoordinate[1]);
		if(Number.isNaN(coordinate.latitude) || Number.isNaN(coordinate.longitude))
			return;

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
		place.placePotencySD_M = place.placePotencySD_M + coordinate.potencyAvg;
		place.placePotencySD_X = place.placePotencySD_X + (coordinate.potencyAvg * coordinate.potencyAvg);

		if(place.potencyMin === null)
			place.potencyMin = coordinate.potencyMin;
		if(place.potencyMax === null)
			place.potencyMax = coordinate.potencyMax;
		if (place.potencyMin > coordinate.potencyMin)
			place.potencyMin = coordinate.potencyMin;
		if (place.potencyMax < coordinate.potencyMax)
			place.potencyMax = coordinate.potencyMax;
	};

});