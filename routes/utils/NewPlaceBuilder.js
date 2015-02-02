var utils = require('./Utils');
var _ = require("underscore");

exports.build = function(place, callback) {
	var o = place;
	var n = {};

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
	n.totalDistance = 0;
	n.distaceAvg = 0;
	n.distaceMax = null;
	n.distaceMin = null;

    /* -- vars for take stats -- */
	n.placePowerSD_X = null;
	n.placePowerSD_M = null;
	n.countSamplesDistance = 0;
	/* ------------------------- */

	reduceCommonGps(o,n,function(){
		callback(n);
	});
}

function reduceCommonGps(o,n,callback){	
	var samplesObj = _.groupBy(o.coordinates, function(sample){
		return sample.latitude + sample.longitude;
	});

	_.each(_.keys(samplesObj), function(key){
		var samplesToReduce = samplesObj[key];
		var union = [];
	
		_.each(samplesToReduce, function(item){
			union = union.concat(item.data);
		});

		var groupByFrequencies = _.groupBy(union, function(item){
			return item.frequency;
		});
		
		var data = [];
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
			}
			data.push({ frequency: Number(key), power:operation });	
		});
	
		var coord = takeCoordStats({
			latitude: samplesObj[key][0].latitude,
			longitude: samplesObj[key][0].longitude,
			data: data,
			createdDate: samplesObj[key][0].createdDate
		});

		saveNewCoordInPlace(coord, n);
	});

	takePlaceStats(n);
	callback(n);
}


function takeCoordStats(coord){

	var coordinate = {};
	coordiante = _.extend(coordinate, coord);

	var numberPowerFrequency = 0;
	var frequencyMin = null;
	var frequencyMax = null;
	var powerMin = null;
	var powerMax = null;
	var powerAvg = null;
	var powerSD_X = null;
	var powerSD_M = null;

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

		powerAvg += item.power;
		powerSD_M += item.power;
		powerSD_X += (item.power * item.power);
		numberPowerFrequency += 1;
	});

	coordinate.powerMin = Number(powerMin.toFixed(5));
	coordinate.powerMax = Number(powerMax.toFixed(5));
	powerAvg = powerAvg / numberPowerFrequency;
	coordinate.powerAvg = Number(powerAvg.toFixed(5));

	if(coord.data.length > 1){
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


function saveNewCoordInPlace(coord, n){
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

		if(n.distaceMin === null || n.distaceMax === null)
			n.distaceMin = n.distaceMax = distance;
		else {
			if(n.distaceMin > distance)
				n.distaceMin = distance;
			if(n.distaceMax < distance)
				n.distaceMax = distance;
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
		n.distaceAvg = n.totalDistance/n.countSamplesDistance;
	else 
		n.totalDistance = n.distaceAvg = n.distaceMin = n.distaceMax = 0;

	/* -- delete vars for take stats -- */
	delete n.placePowerSD_X;
	delete n.placePowerSD_M;
	delete n.countSamplesDistance;
	/* -------------------------------- */
}