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

		_.each(files, function(file){
			var fr = new FileReader();
			fr.onload = function(e) { 
				self.parser(place,fr.result);
				self.numFilesParsed += 1;
				callbackNumFilesProcessed(self.numFilesParsed);

				if (self.numFilesParsed == self.numFiles)
					callback(self.place);
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

		var lat = Number(arrayCoordinate[0]);
		var lng = Number(arrayCoordinate[1]);
		if(isNaN(lat) || isNaN(lng))
			return;

		this.place.coordinates.push({
			lat: lat,
			lng: lng,
		 	cap: arrayPower,
			date: String(arrayCoordinate[2])
		});
	},
};