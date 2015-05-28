var utils = require('./Utils');
var _ = require("underscore");

exports.create = function(place, callback) {
	var o = place;
	var n = {};

	if(o.name === null || o.name === undefined || o.name === "")
		callback("Name of the place cannot be empty or null",null);

	n.name = o.name;
	n.coordinates = [];
	n.numberCoordinates = 0;
	n.powerMin = null;
	n.powerMax = null;
	n.powerAvg = null;
	n.sdPowerAvg = null;
	n.avgPowerSD = null;
	n.numberPowerFrequency = null;
	n.frequencyMin = null;
	n.frequencyMax = null;
	n.frequenciesBands = [];
	n.frequenciesChannelWidth = [];
	n.totalDistance = 0;
	n.distanceAvg = 0;
	n.distanceMax = null;
	n.distanceMin = null;
	n.outliers = {};

	/* -- vars for take stats -- */
	n.placePowerSD_X = null;
	n.placePowerSD_M = null;
	n.countSamplesDistance = 0;
	n.frequencyUnitFactor = 1;
	n.frequencies = [];
	/* ------------------------- */

	reduceCommonGps(o,n,function(){
		checkPlaceAttributes(n,function(err){
			if(err)
				callback(err,null);

			callback(null,n);
		});
	});
};

function reduceCommonGps(o,n,callback){	
	if(o.frequencies === undefined){
		var groupByCoordinate = _.groupBy(o.Coordinates, function(sample){
			return sample.latitude + sample.longitude;
		});

		_.each(_.keys(groupByCoordinate), function(key){
			var samplesToReduce = groupByCoordinate[key];
			var union = [];

			_.each(samplesToReduce, function(item){
				union = union.concat(item.Captures);
			});

			var groupByFrequencies = _.groupBy(union, function(item){
				return item.frequency;
			});
			
			var captures = [];
			var frequencies = _.keys(groupByFrequencies);
			_.each(frequencies, function(key){
				var operation;
				switch (o.gpsFunction) {
					case 'avg':
						operation = _.reduce(groupByFrequencies[key], function(memo, item){ 
							return memo + item.power; 
						}, 0);
						operation /= groupByFrequencies[key].length;
						break;

					case 'max':
						operation = _.reduce(groupByFrequencies[key], function(memo, item){ 
							if(memo < item.power)
								return item.power;
							else
								return memo;
						}, groupByFrequencies[key][0].power);
						break;

					case 'min':
						operation = _.reduce(groupByFrequencies[key], function(memo, item){ 
							if(memo > item.power)
								return item.power;
							else
								return memo;
						}, groupByFrequencies[key][0].power);
						break;

					case 'first':
						operation = groupByFrequencies[key][0].power;
						break;

					case 'last':
						operation = groupByFrequencies[key][groupByFrequencies[key].length - 1].power;
						break;

					default:
						operation = groupByFrequencies[key][0].power;
						break;
				}

				captures.push({ 
					frequency: Number(key), 
					power:operation
				});

				var outlier = operation.toFixed(1);
				if(n.outliers[outlier])
					n.outliers[outlier] += 1;
				else
					n.outliers[outlier] = 1;
			});
		
			var coord = takeCoordStats({
				latitude: groupByCoordinate[key][0].latitude,
				longitude: groupByCoordinate[key][0].longitude,
				captures: captures,
				createdDate: groupByCoordinate[key][0].createdDate
			});

			saveCoord(coord, n);
		});
	
	} else {
		// Change the frequencies values to common unit (kHz)
		switch (o.frequencies.unit) {
			case 'Hz':
				n.frequencyUnitFactor = 1/1000;
				break;
			case 'kHz':
				n.frequencyUnitFactor = 1;
				break;
			case 'MHz':
				n.frequencyUnitFactor = 1000;
				break;
			case 'GHz':
				n.frequencyUnitFactor = 1000000;
				break;
		}
		/* ------------------------------------------------ */

		var groupByCoordinate = _.groupBy(o.coordinates, function(sample){
			return sample.lat + sample.lng;
		});

		_.each(_.keys(groupByCoordinate), function(key, index){
			var item = groupByCoordinate[key];
			var captures = [];

			for (var i = 0; i < item[0].cap.length; i++) {
				var operation;
				switch (o.gpsFunction) {
					case 'avg':
						operation = _.reduce(item, function(memo, item){ 
							return memo + item.cap[i]; 
						}, 0);
						operation /= item.length;
						break;

					case 'max':
						operation = _.reduce(item, function(memo, item){ 
							if(memo < item.cap[i])
								return item.cap[i];
							else
								return memo;
						}, item[0].cap[i]);
						break;

					case 'min':
						operation = _.reduce(item, function(memo, item){ 
							if(memo > item.cap[i])
								return item.cap[i];
							else
								return memo;
						}, item[0].cap[i]);
						break;

					case 'first':
						operation = item[0].cap[i];
				 		break;

					case 'last':
						operation = item[item.length - 1].cap[i];
						break;

					default:
						operation = item[0].cap[i];
						break;
				}
				var fq = o.frequencies.values[i] * n.frequencyUnitFactor;
				if(index === 0) n.frequencies.push(fq);

				if(n.outliers[outlier])
					n.outliers[outlier] += 1;
				else
					n.outliers[outlier] = 1;

				captures.push({ 
					frequency: fq, 
					power:operation 
				});

				var outlier = operation.toFixed(1);
				if(n.outliers[outlier])
					n.outliers[outlier] += 1;
				else
					n.outliers[outlier] = 1;
			}
		
			var coord = takeCoordStats({
				latitude: item[0].lat,
				longitude: item[0].lng,
				captures: captures,
				createdDate: item[0].date
			});

			saveCoord(coord, n);
		});
	}

	takePlaceStats(n);
	callback(n);
}


function takeCoordStats(coord){

	var coordinate = {};
	coordinate = _.extend(coordinate, coord);

	var numberPowerFrequency = 0;
	var frequencyMin = null;
	var frequencyMax = null;
	var powerMin = null;
	var powerMax = null;
	var powerAvg = null;
	var powerSD_X = null;
	var powerSD_M = null;

	_.each(coord.captures,function(item){

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

		powerAvg += item.power;
		powerSD_M += item.power;
		powerSD_X += (item.power * item.power);
		numberPowerFrequency += 1;
	});

	coordinate.powerMin = Number(powerMin.toFixed(5));
	coordinate.powerMax = Number(powerMax.toFixed(5));
	powerAvg = powerAvg / numberPowerFrequency;
	coordinate.powerAvg = Number(powerAvg.toFixed(5));

	if(coord.captures.length > 1){
		powerSD_X = Math.sqrt((powerSD_X - (powerSD_M*powerSD_M)/numberPowerFrequency)/(numberPowerFrequency - 1));
		coordinate.powerSD = Number(powerSD_X.toFixed(5));

	} else
		coordinate.powerSD = 0;

	return {
		coordinate: coordinate,
		frequencyMin: frequencyMin,
		frequencyMax: frequencyMax,
		numberPowerFrequency: numberPowerFrequency
	};
}


function saveCoord(coord, n){
	n.coordinates.push(coord.coordinate);
	n.numberCoordinates += 1;
	n.powerAvg += coord.coordinate.powerAvg;	
	n.avgPowerSD += coord.coordinate.powerSD;
	n.placePowerSD_M += coord.coordinate.powerAvg;
	n.placePowerSD_X += (coord.coordinate.powerAvg * coord.coordinate.powerAvg);

	if(n.powerMin === null)
		n.powerMin = coord.coordinate.powerMin;
	if(n.powerMax === null)
		n.powerMax = coord.coordinate.powerMax;
	if (n.powerMin > coord.coordinate.powerMin)
		n.powerMin = coord.coordinate.powerMin;
	if (n.powerMax < coord.coordinate.powerMax)
		n.powerMax = coord.coordinate.powerMax;

	if(n.frequencyMin === null)
		n.frequencyMin = coord.frequencyMin;
	if(n.powerMax === null)
		n.frequencyMax = coord.frequencyMax;
	if (n.frequencyMin > coord.frequencyMin)
		n.frequencyMin = coord.frequencyMin;
	if (n.frequencyMax < coord.frequencyMax)
		n.frequencyMax = coord.frequencyMax;

	if(n.numberPowerFrequency === null)
		n.numberPowerFrequency = coord.numberPowerFrequency;

	if(n.coordinates.length > 1){
		var lastItem = n.coordinates[n.coordinates.length - 2];
		var currentItem = n.coordinates[n.coordinates.length - 1];
		var distance = utils.GetDistanceFromLatLonInKm(lastItem.latitude, lastItem.longitude, currentItem.latitude, currentItem.longitude);
		
		n.totalDistance += distance;
		n.countSamplesDistance += 1;

		if(n.distanceMin === null || n.distanceMax === null)
			n.distanceMin = n.distanceMax = distance;
		else {
			if(n.distanceMin > distance)
				n.distanceMin = distance;
			if(n.distanceMax < distance)
				n.distanceMax = distance;
		}
	}
}

function takePlaceStats(n){
	n.powerAvg = n.powerAvg / n.numberCoordinates;
	n.powerAvg = Number(n.powerAvg.toFixed(5));
	
	if(n.numberCoordinates === 1)
		n.sdPowerAvg = 0;
	
	else {
		n.placePowerSD_X = Math.sqrt((n.placePowerSD_X - (n.placePowerSD_M*n.placePowerSD_M)/n.numberCoordinates)/(n.numberCoordinates - 1));
		n.sdPowerAvg = Number(n.placePowerSD_X.toFixed(5));
	}
	
	n.avgPowerSD = n.avgPowerSD / n.numberCoordinates;
	n.avgPowerSD = Number(n.avgPowerSD.toFixed(5));

	if(n.coordinates.length > 1)
		n.distanceAvg = n.totalDistance/n.countSamplesDistance;
	else 
		n.totalDistance = n.distanceAvg = n.distanceMin = n.distanceMax = 0;

	// wifi bands, add other
	var bands = [{
		from: n.frequencies[0],
		to: n.frequencies[n.frequencies.length - 1],
		name: "all"
	},{
		from: 2412000,
		to: 2484000,
		name: "2.4 GHz"
	},{
		from: 5170000,
		to: 5825000,
		name: "5 GHz"
	}];

	_.each(bands, function(item, index){
		var result = _.filter(n.frequencies, function(num){ return num >= item.from && num <= item.to; });
		if(result.length > 0) n.frequenciesBands.push({
			text: item.name,
			from: item.from,
			to: item.to,
			id: index
		});
	});

	// channels width
	var width = [{
		from: 470000,
		to: 890000,
		name: "American 6Mhz"
	},
	{
		from: 470000,
		to: 862000,
		name: "European 8Mhz"
	}];

	_.each(width, function(item, index){
		var result = _.filter(n.frequencies, function(num){ return num >= item.from && num <= item.to; });
		if(result.length > 0) n.frequenciesChannelWidth.push({
			text: item.name,
			id: index
		});
	});

	/* -- delete vars for take stats -- */
	delete n.placePowerSD_X;
	delete n.placePowerSD_M;
	delete n.countSamplesDistance;
	delete n.frequencyUnitFactor;
	delete n.frequencies;
	/* -------------------------------- */
}

function checkPlaceAttributes(n, callback){
	if(n.length === 0 || n.numberCoordinates === 0)
		callback("There must be at least one sample");

	if(n.powerMin === null || n.powerMin === undefined)
		callback("We could not calculate the power min of the place");

	if(n.powerMax === null || n.powerMax === undefined)
		callback("We could not calculate the power max of the place");

	if(n.powerAvg === null || n.powerAvg === undefined)
		callback("We could not calculate the power avg of the place");

	if(n.sdPowerAvg === null || n.sdPowerAvg === undefined || n.avgPowerSD === null || n.avgPowerSD === undefined)
		callback("We could not calculate the power standard deviation of the place");

	if(n.numberPowerFrequency < 1)
		callback("There must be at least one frequency and power in the samples");
	
	if(n.frequencyMin === null || n.frequencyMin === undefined)
		callback("We could not calculate the frequency min of the place");

	if(n.frequencyMax === null || n.frequencyMax === undefined)
		callback("We could not calculate the frequency max of the place");

	if(n.totalDistance === null || n.totalDistance === undefined)
		callback("We could not calculate the total distance of the place");

	if(n.distanceAvg === null || n.distanceAvg === undefined)
		callback("We could not calculate the avg distance of the place");

	if(n.distanceMax === null || n.distanceMax === undefined)
		callback("We could not calculate the max distance of the place");

	if(n.distanceMin === null || n.distanceMin === undefined)
		callback("We could not calculate the total min of the place");

	if(Object.keys(n.outliers).length === 0)
		callback("We could not calculate the outliers of the place");

	callback(null);
}