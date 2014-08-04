$(document).ready(function(){

	parser = function(place,data){
		
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