var app = app || {};
app.util = app.util || {};

app.util.Parser = function(){};

app.util.Parser.prototype = {
	numFilesParser: 0,
	numFiles: 0,
	unitFactor: 1,

	initialize: function(files,place,unit,callbackNumFilesProcessed,callback){
		var self = this;
		
		if(place)
			this.place = place;
		else
			throw 'Any Place';

		this.numFiles = files.length;
		this.chooseUnitFactor(unit);

		this.frequencyMin = new app.util.Stats();
		this.frequencyMax = new app.util.Stats();
		this.powerMin = new app.util.Stats();
		this.powerMax = new app.util.Stats();

		_.each(files, function(file){
   			var fr = new FileReader();
		    fr.onload = function(e) { 
		    	self.parser(place,fr.result);
		    	self.numFilesParser += 1;
		    	callbackNumFilesProcessed(self.numFilesParser);
		        
		        if (self.numFilesParser == self.numFiles){
		        	self.place.numberCoordinates = self.powerMin.getCount();
					self.place.powerMin = self.powerMin.getResult();
					self.place.powerMax = self.powerMax.getResult();
					self.place.frequencyMin = self.frequencyMin.getResult();
					self.place.frequencyMax = self.frequencyMax.getResult();
		        
		        	callback(self.place);
		        }
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
		 	captures: arrayFrequencyPower,
			createdDate: String(arrayCoordinate[2])
		});
	},

	coordinateStats: function(coord){
		var coordinate = {};
		coordiante = _.extend(coordinate, coord);

		var frequencyMin = new app.util.Stats();
		var frequencyMax = new app.util.Stats();
		var powerMin = new app.util.Stats();
		var powerMax = new app.util.Stats();
		
		_.each(coord.captures,function(item){
			powerMin.min(item.power);
			powerMax.max(item.power);
			frequencyMin.min(item.frequency);
			frequencyMax.max(item.frequency);
		});

		coordinate.powerMin = Number(powerMin.getResult().toFixed(5));
		coordinate.powerMax = Number(powerMax.getResult().toFixed(5));

		this.saveInPlace(coordinate,frequencyMin.getResult(),frequencyMax.getResult(),powerMin.getCount());
	},

	saveInPlace: function(coordinate,frequencyMin,frequencyMax,numberPowerFrequency){
		this.place.coordinates.push(coordinate);

		this.powerMin.min(coordinate.powerMin);
		this.powerMax.max(coordinate.powerMax);
		this.frequencyMin.min(frequencyMin);
		this.frequencyMax.max(frequencyMax);

		if(this.place.numberPowerFrequency === null)
			this.place.numberPowerFrequency = numberPowerFrequency;
	},
};