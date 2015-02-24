var utils = require('./Utils');
var _ = require("underscore");

exports.create = function(place, callback) {
	var o = place;
	var n = {};

	if(o.name === null || o.name === undefined || o.name === "")
		callback("Name of the place cannot be empty or null",null);

	/* ------------------------- */
	n.name = o.name;
	n.coordinates = [];
	n.numberCoordinates = 0;

	/* ------------------------- */
	n.power = {};
	n.power.min = null;
	n.power.max = null;
	n.power.avg = null;
	n.power.sd_avg = null;

	/* ------------------------- */
	n.outliers = {};

	/* ------------------------- */
	n.frequencies = {};
	n.frequencies.unit = o.frequencies.unit;
	n.frequencies.total = o.frequencies.values.length || o.frequencies;
	n.frequencies.values = o.frequencies.values;
	n.frequencies.min = o.frequencies.values[0];
	n.frequencies.max = o.frequencies.values[o.frequencies.values.length - 1];
	if(n.frequencies.values.length > 1){
		n.frequencies.step = n.frequencies.values[1] - n.frequencies.values[0];
	} else {
		n.frequencies.step = 0;
	}

	/* ------------------------- */
	n.distance = {};
	n.distance.total = 0;
	n.distance.avg = 0;
	n.distance.max = null;
	n.distance.min = null;

	/* -- vars for take stats -- */
	n.placePowerSD_X = null;
	n.placePowerSD_M = null;
	n.countSamplesDistance = 0;
	/* ------------------------- */

	reduceCommonGps(o,n,function(){
		checkPlaceAttributes(n,function(err){
			if(err)
				callback(err,null);
			callback(null,n);
		})
	});
}

function reduceCommonGps(o,n,callback){	
	var groupByCoordinate = _.groupBy(o.coordinates, function(sample){
		return sample.latitude + sample.longitude;
	});

	_.each(_.keys(groupByCoordinate), function(key){
		var item = groupByCoordinate[key];
		var captures = [];

		for (var i = 0; i < item[0].captures.length; i++) {
			var operation;
			switch (o.gpsFunction) {
				case 'avg':
					operation = _.reduce(item, function(memo, item){ 
						return memo + item.captures[i]; 
					}, 0);
					operation /= item.length;
					break;

				case 'max':
					operation = _.reduce(item, function(memo, item){ 
						if(memo < item.captures[i])
							return item.captures[i];
						else
							return memo;
					}, item[0].captures[i]);
					break;

				case 'min':
					operation = _.reduce(item, function(memo, item){ 
						if(memo > item.captures[i])
							return item.captures[i];
						else
							return memo;
					}, item[0].captures[i]);
					break;

				case 'first':
					operation = item[0].captures[i];
			 		break;

				case 'last':
					operation = item[item.length - 1].captures[i];
					break;

				default:
					operation = item[0].captures[i];
					break;
			}

			captures.push(operation);

			if(n.outliers[operation])
				n.outliers[operation] += 1;
			else
				n.outliers[operation] = 1;
		}

		var coord = takeCoordStats({
			latitude: item[0].latitude,
			longitude: item[0].longitude,
			captures: captures,
			createdDate: item[0].createdDate
		}, n);

		saveCoord(coord, n);
	});

	takePlaceStats(n);
	callback(n);
}


function takeCoordStats(coord, n){
	var coordinate = {};
	coordinate = _.extend(coordinate, coord);

	var powerMin = null;
	var powerMax = null;
	var powerAvg = null;
	var powerSD_X = null;
	var powerSD_M = null;

	_.each(coord.captures,function(item){
		if(powerMin === null){
			powerMin = powerMax = item;
		} else {
			if (powerMax < item)
				powerMax = item;
			if (powerMin > item)
				powerMin = item;
		}
		powerAvg += item;
		powerSD_M += item;
		powerSD_X += (item * item);
	});

	coordinate.powerMin = Number(powerMin.toFixed(5));
	coordinate.powerMax = Number(powerMax.toFixed(5));
	powerAvg = powerAvg / n.frequencies.total;
	coordinate.powerAvg = Number(powerAvg.toFixed(5));

	if(coord.captures.length > 1){
		powerSD_X = Math.sqrt((powerSD_X - (powerSD_M*powerSD_M)/n.frequencies.total)/(n.frequencies.total - 1));
		coordinate.powerSD = Number(powerSD_X.toFixed(5));

	} else
		coordinate.powerSD = 0;

	return coordinate;
}


function saveCoord(coord, n){
	n.coordinates.push(coord);
	n.numberCoordinates += 1;
	n.power.avg += coord.powerAvg;	
	n.placePowerSD_M += coord.powerAvg;
	n.placePowerSD_X += (coord.powerAvg * coord.powerAvg);

	if(n.power.min === null)
		n.power.min = coord.powerMin;
	if(n.power.max === null)
		n.power.max = coord.powerMax;
	if (n.power.min > coord.powerMin)
		n.power.min = coord.powerMin;
	if (n.power.max < coord.powerMax)
		n.power.max = coord.powerMax;

	if(n.coordinates.length > 1){
		var lastItem = n.coordinates[n.coordinates.length - 2];
		var currentItem = n.coordinates[n.coordinates.length - 1];
		var distance = utils.GetDistanceFromLatLonInKm(lastItem.latitude, lastItem.longitude, currentItem.latitude, currentItem.longitude);
		
		n.distance.total += distance;
		n.countSamplesDistance += 1;

		if(n.distance.min === null || n.distance.max === null)
			n.distance.min = n.distance.max = distance;
		else {
			if(n.distance.min > distance)
				n.distance.min = distance;
			if(n.distance.max < distance)
				n.distance.max = distance;
		}
	}
}

function takePlaceStats(n){
	n.power.avg = n.power.avg / n.numberCoordinates;
	n.power.avg = Number(n.power.avg.toFixed(5));
	
	if(n.numberCoordinates === 1)
		n.power.sd_avg = 0;
	
	else {
		n.placePowerSD_X = Math.sqrt((n.placePowerSD_X - (n.placePowerSD_M*n.placePowerSD_M)/n.numberCoordinates)/(n.numberCoordinates - 1));
		n.power.sd_avg = Number(n.placePowerSD_X.toFixed(5));
	}

	if(n.coordinates.length > 1)
		n.distance.avg = n.distance.total/n.countSamplesDistance;
	else 
		n.distance.total = n.distance.avg = n.distance.min = n.distance.max = 0;

	/* -- delete vars for take stats -- */
	delete n.placePowerSD_X;
	delete n.placePowerSD_M;
	delete n.countSamplesDistance;
	/* -------------------------------- */
}

function checkPlaceAttributes(n, callback){
	if(n.length == 0 || n.numberCoordinates == 0)
		callback("There must be at least one sample");

	if(n.power.min === null || n.power.min === undefined)
		callback("We could not calculate the power min of the place");

	if(n.power.max === null || n.power.max === undefined)
		callback("We could not calculate the power max of the place");

	if(n.power.avg === null || n.power.avg === undefined)
		callback("We could not calculate the power avg of the place");

	if(n.power.sd_avg === null || n.power.sd_avg === undefined)
		callback("We could not calculate the power standard deviation of the place");

	if(n.frequencies.total < 1)
		callback("There must be at least one frequency and power in the samples");
	
	if(n.frequencies.min === null || n.frequencies.min === undefined)
		callback("We could not calculate the frequency min of the place");

	if(n.frequencies.max === null || n.frequencies.max === undefined)
		callback("We could not calculate the frequency max of the place");

	if(n.frequencies.unit === null || n.frequencies.unit === undefined)
		callback("We could not calculate the frequency unit of the place");

	if(n.frequencies.step === null || n.frequencies.step === undefined)
		callback("We could not calculate the frequency step of the place");

	if(n.distance.total === null || n.distance.total === undefined)
		callback("We could not calculate the total distance of the place");

	if(n.distance.avg === null || n.distance.avg === undefined)
		callback("We could not calculate the avg distance of the place");

	if(n.distance.max === null || n.distance.max === undefined)
		callback("We could not calculate the max distance of the place");

	if(n.distance.min === null || n.distance.min === undefined)
		callback("We could not calculate the total min of the place");

	if(Object.keys(n.outliers).length === 0)
		callback("We could not calculate the outliers of the place");

	callback(null);
}