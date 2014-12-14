var app = app || {};
app.util = app.util || {};

app.util.Parser = function(){};

app.util.Parser.prototype = {
	numFilesParser: 0,
	numFiles: 0,
	numCoordReady: 0,
	unitFactor: 1,
	place: null,
	samples: [],

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
		    	self.numFilesParser += 1;
		    	callbackNumFilesProcessed(self.numFilesParser);
		        
		        if (self.numFilesParser == self.numFiles)
		        	callback(this.place);
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
		var arrayCoordinate = [];
		var arrayFrequencyPower = [];

		var lines = data.split('\n');
		        
        _.each(lines, function(line){
        	lineSplit = line.split('\t');	
			if(lineSplit.length == 2){
				var newFrequency = Number(lineSplit[0]) * self.unitFactor;
				var newPower = Number(lineSplit[1]);
				arrayFrequencyPower.push({ frequency: newFrequency, power:newPower });
			
			} else if(lineSplit.length == 1)
				arrayCoordinate.push(lineSplit);
        });

        var latitude = Number(arrayCoordinate[0]);
		var longitude = Number(arrayCoordinate[1]);
		if(isNaN(latitude) || isNaN(longitude))
			return;

		this.coordinateStats({
			latitude: latitude,
			longitude: longitude,
		 	data: arrayFrequencyPower,
			createdDate: String(arrayCoordinate[2])
		});
	},

	coordinateStats: function(coord){
		var coordinate = {};
		coordiante = _.extend(coordinate, coord);

		var numberPowerFrequency = 0;
		var frequencyMin = null;
		var frequencyMax = null;
		var powerMin = null;
		var powerMax = null;

		_.each(coord.data,function(item){
			if(powerMin === null && frequencyMin === null){
				powerMin = powerMax = item.power;
				frequencyMin = frequencyMax = item.frequency;
			
			} else {
				if (frequencyMax < item.frequency)
					frequencyMax = item.frequency;
				if (frequencyMin > item.frequency)
					frequencyMin = item.frequency;

				if (powerMax < item.power)
					powerMax = item.power;
				if (powerMin > item.power)
					powerMin = item.power;
			}
			numberPowerFrequency += 1;
		});

		coordinate.powerMin = Number(powerMin.toFixed(5));
		coordinate.powerMax = Number(powerMax.toFixed(5));

		this.saveInPlace(coordinate,frequencyMin,frequencyMax,numberPowerFrequency);
	},

	saveInPlace: function(coordinate,frequencyMin,frequencyMax,numberPowerFrequency){
		this.place.coordinates.push(coordinate);
		this.place.numberCoordinates ++;

		if(this.place.powerMin === null)
			this.place.powerMin = coordinate.powerMin;
		if(this.place.powerMax === null)
			this.place.powerMax = coordinate.powerMax;
		if (this.place.powerMin > coordinate.powerMin)
			this.place.powerMin = coordinate.powerMin;
		if (this.place.powerMax < coordinate.powerMax)
			this.place.powerMax = coordinate.powerMax;

		if(this.place.frequencyMin === null)
			this.place.frequencyMin = frequencyMin;
		if(this.place.powerMax === null)
			this.place.frequencyMax = frequencyMax;
		if (this.place.frequencyMin > frequencyMin)
			this.place.frequencyMin = frequencyMin;
		if (this.place.frequencyMax < frequencyMax)
			this.place.frequencyMax = frequencyMax;

		if(this.place.numberPowerFrequency === null)
			this.place.numberPowerFrequency = numberPowerFrequency;
	},
};