var app = app || {};
app.util = app.util || {};

app.util.Parser = function(){};

app.util.Parser.prototype = {
	numFilesParsed: 0,
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

		this.place.frequencies = {};
		this.place.frequencies.unit = unit;
		this.place.frequencies.values = [];

		this.powerMin = new app.util.Stats();
		this.powerMax = new app.util.Stats();

		_.each(files, function(file){
   			var fr = new FileReader();
		    fr.onload = function(e) { 
		    	self.parser(place,fr.result);
		    	self.numFilesParsed += 1;
		    	callbackNumFilesProcessed(self.numFilesParsed);
		        
		        if (self.numFilesParsed == self.numFiles){
					self.place.powerMin = self.powerMin.getResult();
					self.place.powerMax = self.powerMax.getResult();
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
		var arrayPower = [];

		var lines = data.split('\n');
		
		_.each(lines, function(line){
			lineSplit = line.split('\t');
			if(lineSplit.length == 2){
				if(self.numFilesParsed == 0)
					self.place.frequencies.values.push(Number(lineSplit[0]) * self.unitFactor)

				arrayPower.push(Number(lineSplit[1]));
			
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
		 	captures: arrayPower,
			createdDate: String(arrayCoordinate[2])
		});
	},

	coordinateStats: function(coord){
		var coordinate = {};
		coordiante = _.extend(coordinate, coord);

		var powerMin = new app.util.Stats();
		var powerMax = new app.util.Stats();
		
		_.each(coord.captures,function(item){
			powerMin.min(item);
			powerMax.max(item);
		});

		var min = Number(powerMin.getResult().toFixed(5));
		var max = Number(powerMax.getResult().toFixed(5));

		this.saveInPlace(coordinate,min,max);
	},

	saveInPlace: function(coordinate, powerMin, powerMax){
		this.place.coordinates.push(coordinate);
		this.powerMin.min(powerMin);
		this.powerMax.max(powerMax);
	},
};