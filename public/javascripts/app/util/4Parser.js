var app = app || {};
app.util = app.util || {};

app.util.Parser = function(){};

app.util.Parser.prototype = {
	numFilesParsed: 0,
	numFiles: 0,

	initialize: function(files,place,unit,ext,callbackNumFilesProcessed,callback){
		var self = this;
		if(place)
			this.place = _.clone(place);
		else
			throw 'Any Place';

		this.numFiles = files.length;
		this.place.coordinates = [];
		this.place.frequencies = {};
		this.place.frequencies.values = [];
		self.place.frequencies.unit = unit;

		files = [].slice.call(files);
		files = files.sort(function(a,b){
			return app.util.alphanum(a.name,b.name);
		});

		_.each(files, function(file){
			var fr = new FileReader();
			fr.onload = function(e) { 
				if(ext == 'txt')
					self.parser(place,fr.result);

				else if(ext == 'json'){
					var data = JSON.parse(fr.result);
					self.place.coordinates = self.place.coordinates.concat(data.coordinates);
					_.each(data.frequencies.values, function(fq){
						if(!_.contains(self.place.frequencies.values, fq))
							self.place.frequencies.values.push(fq);
					});
				}

				self.numFilesParsed += 1;
				callbackNumFilesProcessed(self.numFilesParsed);

				if(self.numFilesParsed == self.numFiles){
					var err = self.validate();
					if(err.length > 0)
						callback(err,null);
					else
						callback(null,self.place);
				}
			};
			fr.readAsText(file);
		});
	},

	parser: function(place,data){
		if(data === null || data === undefined || data === "")
			return;

		var self = this;
		var info = [];
		var captures = [];
		var frequencies = [];

		var lines = data.split('\n');
		_.each(lines, function(line, i){
			lineSplit = line.split('\t');
			if(lineSplit.length == 2){
				frequencies.push(Number(lineSplit[0]));
				captures.push(Number(lineSplit[1]));
			
			} else if(lineSplit.length == 1)
				info.push(lineSplit);
		});

		var lat = Number(info[0]);
		var lng = Number(info[1]);
		var date = String(info[2]);
		if(isNaN(lat) || isNaN(lng) || captures.length === 0 || date === "")
			return;

		if(self.place.frequencies.values.length === 0)
			self.place.frequencies.values = frequencies;
		else {
			if(self.place.frequencies.values.toString() != frequencies.toString())
				return;
		}

		this.place.coordinates.push({
			lat: lat,
			lng: lng,
			cap: captures,
			date: date
		});
	},

	validate: function(){
		var err = [];
		var n = this.place;

		if(n.name === null || n.name === undefined || n.name === "")
			err.push("Name of the place cannot be empty or null");

		if(!n.coordinates || n.coordinates.length === 0)
			err.push("There must be at least one sample");

		if(!n.frequencies || !n.frequencies.values || n.frequencies.values.length === 0)
			err.push("There must be at least one frequency in the samples");

		return err;
	},
};