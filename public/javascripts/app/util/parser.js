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
		place.powerAvg = place.powerAvg / place.numberCoordinates;
		place.powerAvg = Number(place.powerAvg.toFixed(5));
		
		if(place.numberCoordinates === 1)
			place.sdPowerAvg = 0;
		else {
			place.placePowerSD_X = Math.sqrt((place.placePowerSD_X - (place.placePowerSD_M*place.placePowerSD_M)/place.numberCoordinates)/(place.numberCoordinates - 1));
			place.sdPowerAvg = Number(place.placePowerSD_X.toFixed(5));
		}
		place.avgPowerSD = place.avgPowerSD / place.numberCoordinates;
		place.avgPowerSD = Number(place.avgPowerSD.toFixed(5));

		delete place.placePowerSD_X;
		delete place.placePowerSD_M;

		return place;
	};

	/* ------------------------------------------------------------------------- */
	var parser = function(place,data){
		
		arrayCoordinate = [];
		arrayFrequencyPower = [];
		coordinate = {};
		numberPowerFrequency = 0;
		frequencyMin = null;
		frequencyMax = null;
		powerMin = null;
		powerMax = null;
		powerAvg = null;
		powerSD_X = null;
		powerSD_M = null;

		var lines = data.split("\n");
		        
        _.each(lines, function(line){
        	lineSplit = line.split("\t");	
			if(lineSplit.length == 2){
				var newFrequency = Number(lineSplit[0]);
				var newPower = Number(lineSplit[1]);

				if(powerMin === null && frequencyMin === null){
					powerMin = powerMax = newPower;
					frequencyMin = frequencyMax = newFrequency;
				
				} else {
					if (frequencyMax < newFrequency)
						frequencyMax = newFrequency;
					if (frequencyMin > newFrequency)
						frequencyMin = newFrequency;

					if (powerMax < newPower)
						powerMax = newPower;
					if (powerMin > newPower)
						powerMin = newPower;
				}
				powerAvg = powerAvg + newPower;
				powerSD_M = powerSD_M + newPower;
				powerSD_X = powerSD_X + (newPower * newPower);
				numberPowerFrequency ++;
				arrayFrequencyPower.push({ frequency: newFrequency, power:newPower });
			}
			else if(lineSplit.length == 1)
				arrayCoordinate.push(lineSplit);
        });

        coordinate = {};
        coordinate.latitude = Number(arrayCoordinate[0]);
		coordinate.longitude = Number(arrayCoordinate[1]);
		if(isNaN(coordinate.latitude) || isNaN(coordinate.longitude))
			return;

		coordinate.numberPowerFrequency = numberPowerFrequency;
		coordinate.frequencyMin = Number(frequencyMin.toFixed(5));
		coordinate.frequencyMax = Number(frequencyMax.toFixed(5));
		coordinate.powerMin = Number(powerMin.toFixed(5));
		coordinate.powerMax = Number(powerMax.toFixed(5));
		powerAvg = powerAvg / numberPowerFrequency;
		coordinate.powerAvg = Number(powerAvg.toFixed(5));
		powerSD_X = Math.sqrt((powerSD_X - (powerSD_M*powerSD_M)/numberPowerFrequency)/(numberPowerFrequency - 1));
		coordinate.powerSD = Number(powerSD_X.toFixed(5));
		coordinate.createdDate = String(arrayCoordinate[2]);
		coordinate.data = arrayFrequencyPower;

		place.coordinates.push(coordinate);
		place.numberCoordinates ++;
		place.powerAvg = place.powerAvg + coordinate.powerAvg;	
		place.avgPowerSD = place.avgPowerSD + coordinate.powerSD;
		place.placePowerSD_M = place.placePowerSD_M + coordinate.powerAvg;
		place.placePowerSD_X = place.placePowerSD_X + (coordinate.powerAvg * coordinate.powerAvg);

		if(place.powerMin === null)
			place.powerMin = coordinate.powerMin;
		if(place.powerMax === null)
			place.powerMax = coordinate.powerMax;
		if (place.powerMin > coordinate.powerMin)
			place.powerMin = coordinate.powerMin;
		if (place.powerMax < coordinate.powerMax)
			place.powerMax = coordinate.powerMax;
	};

});