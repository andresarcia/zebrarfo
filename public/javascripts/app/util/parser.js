var com = com || {};
com.spantons = com.spantons || {};
com.spantons.util = com.spantons.util || {};

com.spantons.util.Parser = function(){};

com.spantons.util.Parser.prototype = {
	numFilesParser: 0,
	numFiles: 0,
	unitFactor: 1,
	place: null,

	initialize: function(files,place,unit,callbackNumFilesProcessed,callback){
		var self = this;

		if(place)
			this.place = place;
		else
			throw 'Any Place';

		this.numFiles = files.length;
		this.chooseUnitFactor(unit);

		_.each(files, function(file){
   			var fr = new FileReader();
		    fr.onload = function(e) { 
		    	self.parser(place,fr.result);
		        self.numFilesParser++;
		        callbackNumFilesProcessed(self.numFilesParser);
		        if (self.numFilesParser == self.numFiles) 
		        	callback(self.placeStats());
		    };
		    fr.readAsText(file);
		});
	},

	chooseUnitFactor: function(unit){
		switch (unit) {
		    case 'Hz':
		        this.unitFactor = 1/1000;
		        break;
		    case 'kHz':
		        this.unitFactor = 1;
		        break;
		    case 'MHz':
		        this.unitFactor = 1000;
		        break;
		    case 'GHz':
		        this.unitFactor = 1000000;
		        break;
		}
	},

	parser: function(place,data){
		var self = this;
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
				var newFrequency = Number(lineSplit[0]) * self.unitFactor;
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

		if(place.frequencyMin === null)
			place.frequencyMin = frequencyMin;
		if(place.powerMax === null)
			place.frequencyMax = frequencyMax;
		if (place.frequencyMin > frequencyMin)
			place.frequencyMin = frequencyMin;
		if (place.frequencyMax < frequencyMax)
			place.frequencyMax = frequencyMax;

		if(place.numberPowerFrequency === null)
			place.numberPowerFrequency = numberPowerFrequency;
	},

	placeStats: function(){
		this.place.powerAvg = this.place.powerAvg / this.place.numberCoordinates;
		this.place.powerAvg = Number(this.place.powerAvg.toFixed(5));
		
		if(this.place.numberCoordinates === 1)
			this.place.sdPowerAvg = 0;
		
		else {
			this.place.placePowerSD_X = Math.sqrt((this.place.placePowerSD_X - (this.place.placePowerSD_M*this.place.placePowerSD_M)/this.place.numberCoordinates)/(this.place.numberCoordinates - 1));
			this.place.sdPowerAvg = Number(this.place.placePowerSD_X.toFixed(5));
		}
		
		this.place.avgPowerSD = this.place.avgPowerSD / this.place.numberCoordinates;
		this.place.avgPowerSD = Number(this.place.avgPowerSD.toFixed(5));

		delete this.place.placePowerSD_X;
		delete this.place.placePowerSD_M;

		return this.place;
	}
};