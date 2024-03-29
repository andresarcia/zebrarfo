var utils = require('./Utils');
var _ = require("underscore");
var vptree = require("vptree");

/**
 * Creates a new place from an upload or other place
 * @param {Object} u - place uploaded 
 * @param {Object} o - other place
 * @param {Boolean} newCoordinates - append to the return object an array with just the new coords
 * @return {Object} n - new place
 */
exports.create = function(u, o, newCoordinates, callback) {

	// new place object initialization
	var n = {};
	// if uploaded place, choose the new name
	if(u) n.name = u.name;
	else n.name = o.name;

	n.frequencies = {};
	n.frequencies.values = [];
	n.frequencies.bands = [];
	n.frequencies.width = [];
	n.power = {};
	n.power.min = null;
	n.power.max = null;
	n.power.avg = null;
	n.power.sd = null;
	n.distance = {};
	n.distance.total = null;
	n.distance.min = null;
	n.distance.max = null;
	n.distance.avg = null;
	n.distance.sd = [];
	n.coordinates = [];
	if(newCoordinates) n.newCoordinates = [];
	n.outliers = {};

	/* -- temp vars ------------- */
	n.placePowerSD_X = null;
	n.placePowerSD_M = null;

	if(u){
		switch (u.frequencies.unit) {
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
			default:
				return callback("There must be a frequency unit");
		}

		n.gpsFunction = u.gpsFunction;

	} else {
		n.frequencyUnitFactor = 1;
		n.gpsFunction = 'first';
	}

	/* --------------------------- */


	// STATS ======================
	var start = new Date().getTime();
	// ============================

	reduceCommonGps(u, o, n, function(){
		checkPlaceAttributes(n, function(err){
			if(err){
				return callback(err,null);
			}
			// ========================
			var end = new Date().getTime();
			console.log("builder finish time ms:" + (end - start));
			// ========================
			return callback(null, n);
		});
	});
};


function reduceCommonGps(u, o, n, callback){
	// save the frequencies
	// transform the frequency to kHerz
	var fq = [];
	if(u) fq = u.frequencies.values;
	else fq = o.frequencies.values;
	n.frequencies.values = _.map(fq, function(num){
		return num * n.frequencyUnitFactor;
	});

	if(n.gpsFunction == 'all' && u){
		console.log("a");
		_.each(u.coordinates, function(coord){
			if(coord.cap.length != n.frequencies.values.length) return;
			_.each(coord.cap, function(cap){
				var outlier = cap.toFixed(1);
				if(n.outliers[outlier])
					n.outliers[outlier] += 1;
				else
					n.outliers[outlier] = 1;
			});
			var coordinate = takeCoordStats(coord.cap);
			coordinate = _.extend(coordinate, coord);
			saveCoord(coordinate, n);
		});

	} else {
		var uploadedByCoords = {};
		var otherByCoords = {};
		var coords = {};

		// if there uploaded place, grouped by coordinate
		if(u) {
			uploadedByCoords = _.groupBy(u.coordinates, function(sample){
				return sample.lat + sample.lng;
			});
		}

		// if there other place, grouped by coordinate
		if(o) {
			if(o.coordinates){
				otherByCoords = _.groupBy(o.coordinates, function(sample){
					return sample.lat + sample.lng;
				});

			} else if(o.Coordinates){
				otherByCoords = _.groupBy(o.Coordinates, function(sample){
					return sample.lat + sample.lng;
				});
			}
		}

		// replace the common coordinates in the uploaded place by the other place
		_.extend(coords, uploadedByCoords);
		_.extend(coords, otherByCoords);

		// check if there new coordinates
		// var difference = _.difference(_.keys(coords), _.keys(otherByCoords));
		// if(difference.length === 0){
		// 	return callback(o);
		// }

		_.each(_.keys(coords), function(key, index){
			var item = coords[key];

			var lat = item[0].lat;
			var lng = item[0].lng;
			// check if lat and lng are valid else next()
			if(!lat || !lng || lat === 0 || lng === 0) return;

			var cap = [];
			// if caps is not parse to JSON
			if(typeof item[0].cap !== 'object'){
				item[0].cap = JSON.parse(item[0].cap);
			}

			for (var i = 0; i < item[0].cap.length; i++) {
				var operation;
				switch (n.gpsFunction) {
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

				// save outliers with one presition
				var outlier = operation.toFixed(1);
				if(n.outliers[outlier])
					n.outliers[outlier] += 1;
				else
					n.outliers[outlier] = 1;

				// save the captures
				cap.push(operation);
			}

			// if the # of frequencies are not equals to # of captures, continue to next index
			if(cap.length != n.frequencies.values.length) return;

			var coordinate = {};
			// if new coordinate, take stats and build object
			if(!item[0]._id) {
				coordinate = takeCoordStats(cap);
				coordinate = _.extend(coordinate, {
					lat: item[0].lat,
					lng: item[0].lng,
					cap: cap,
					date: item[0].date
				});

				if(n.newCoordinates) n.newCoordinates.push(coordinate);

			// else copy his properties
			} else {
				coordinate = _.extend(coordinate, item[0]);
				
				// check if the coordinate inside other[] if also present on uploaded[]
				// if true, then put visible property to true
				if(uploadedByCoords[key]) {
					coordinate.visible = true;
				}
			}

			saveCoord(coordinate, n);
		});
	}

	takePlaceStats(n);
	return callback();
}


function takeCoordStats(captures){
	var coordinate = {};
	var powerMin = null;
	var powerMax = null;
	var powerAvg = null;
	var powerSD_X = null;
	var powerSD_M = null;

	_.each(captures, function(item){
		if(powerMin === null) powerMin = powerMax = item;
		else {
			if (powerMax < item) powerMax = item;
			if (powerMin > item) powerMin = item;
		}

		powerAvg += item;
		powerSD_M += item;
		powerSD_X += (item * item);
	});

	coordinate.power = {};
	coordinate.power.min = Number(powerMin.toFixed(5));
	coordinate.power.max = Number(powerMax.toFixed(5));
	powerAvg = powerAvg / captures.length;
	coordinate.power.avg = Number(powerAvg.toFixed(5));

	if(captures.length > 1){
		powerSD_X = Math.sqrt((powerSD_X - (powerSD_M*powerSD_M)/captures.length)/(captures.length - 1));
		coordinate.power.sd = Number(powerSD_X.toFixed(5));

	} else coordinate.power.sd = 0;

	return coordinate;
}


function saveCoord(coordinate, n){
	n.coordinates.push(coordinate);
	n.power.avg += coordinate.power.avg;
	n.placePowerSD_M += coordinate.power.avg;
	n.placePowerSD_X += (coordinate.power.avg * coordinate.power.avg);

	if(n.power.min === null) n.power.min = coordinate.power.min;
	if(n.power.max === null) n.power.max = coordinate.power.max;
	if(n.power.min > coordinate.power.min) n.power.min = coordinate.power.min;
	if(n.power.max < coordinate.power.max) n.power.max = coordinate.power.max;

	if(n.coordinates.length > 1){
		var lastItem = n.coordinates[n.coordinates.length - 2];
		var currentItem = n.coordinates[n.coordinates.length - 1];
		var distance = utils.GetDistanceFromLatLonInKm(lastItem.lat, lastItem.lng, currentItem.lat, currentItem.lng);

		n.distance.total += distance;

		if(n.distance.min === null || n.distance.max === null) n.distance.min = n.distance.max = distance;
		else {
			if(n.distance.min > distance) n.distance.min = distance;
			if(n.distance.max < distance) n.distance.max = distance;
		}
	}
}

function takePlaceStats(n){
	// power	
	n.power.avg = n.power.avg / n.coordinates.length;
	n.power.avg = Number(n.power.avg.toFixed(5));

	// sd
	if(n.coordinates.length == 1) n.power.sd = 0;
	else {
		n.placePowerSD_X = Math.sqrt((n.placePowerSD_X - (n.placePowerSD_M*n.placePowerSD_M)/n.coordinates.length)/(n.coordinates.length - 1));
		n.power.sd = Number(n.placePowerSD_X.toFixed(5));
	}

	// distance
	if(n.coordinates.length > 1) n.distance.avg = n.distance.total/n.coordinates.length;
	else n.distance.total = n.distance.avg = n.distance.min = n.distance.max = 0;

	// outliers
	var aux = [];
	_.each(_.keys(n.outliers), function(key){
		aux.push({
			power: Number(key),
			frequency: n.outliers[key]
		});
	});
	aux = _.sortBy(aux, 'power');
	n.outliers = aux;

	// frequencies bands
	var bands = [{
		from: n.frequencies.values[0],
		to: n.frequencies.values[n.frequencies.values.length - 1],
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
		var result = _.filter(n.frequencies.values, function(num){ 
			return num >= item.from && num <= item.to; 
		});
		if(result.length > 0){
			n.frequencies.bands.push({
				text: item.name,
				from: item.from,
				to: item.to,
				id: index
			});
		}
	});

	// frequencies width
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
		var result = _.filter(n.frequencies.values, function(num){ 
			return num >= item.from && num <= item.to; 
		});
		if(result.length > 0) {
			n.frequencies.width.push({
				text: item.name,
				id: index
			});
		}
	});

	n.distance.sd = distancesSD(n.coordinates);

	/* -- delete vars for take stats -- */
	delete n.placePowerSD_X;
	delete n.placePowerSD_M;
	delete n.frequencyUnitFactor;
	delete n.gpsFunction;
	/* -------------------------------- */
}


function distancesSD(coordinates){

	var distances = [];

	// build radios
	var range = _.range(1,10);
	var factors = [0.001, 0.01, 0.1, 1, 10, 100];
	var radios = [];
	_.each(factors, function(factor){
		var decimal = factor.toString().split(".")[1];
		if(decimal) decimal = decimal.length;
		else decimal = 0;

		var res = _.map(range, function(num){ 
			var sol = num * factor;
			return Number(sol.toFixed(decimal));
		});
		radios = _.union(radios, res);
	});
	radios.push(1000);

	// build tree
	var tree = vptree.build(coordinates, function(a,b){
		return utils.GetDistanceFromLatLonInKm(a.lat, a.lng, b.lat, b.lng);
	});

	function smartSearch(radio, element, nNearest){
		if(!nNearest) nNearest = 1;

		var sorted = tree.search(element, nNearest);
		if(sorted[sorted.length - 1].d < radio && sorted.length < coordinates.length){
			sol = smartSearch(radio, element, nNearest * 2);
		} else {
			sorted.splice(0,1);
			return sorted;
		}

		return sol;
	}

	// flag to know when the radio is bigger than all the coordinates
	var stillUnselected = true;

	_.each(radios, function(r){
		var SD_M 	= 0,
			SD_X 	= 0,
			count 	= 0;

		// if still unselected markers do
		if(stillUnselected){
			_.each(coordinates, function(item){
				if(item.selected) return;

				var sorted = smartSearch(r, item);

				_.find(sorted, function(sItem, i){
					var marker = coordinates[sItem.i];

					if(sItem.d <= r){
						marker.selected = true;
					} else {
						SD_M += sItem.d;
						SD_X += sItem.d * sItem.d;
						return sItem;
					}
				});

				count += 1;
			});
		}

		if(count == 1 || stillUnselected === false){
			SD_X = 0;
			stillUnselected = false;
		}

		else SD_X = Number(Math.sqrt((SD_X - (SD_M * SD_M)/ count)/(count - 1))).toFixed(4);
		distances.push({ radio: r, sd: SD_X });
	});

	return distances;
}


function checkPlaceAttributes(n, callback){
	if(n.coordinates.length === 0)
		return callback("There must be at least one sample");

	if(n.power.min === null || n.power.min === undefined)
		return callback("We could not calculate the power min of the place");

	if(n.power.max === null || n.power.max === undefined)
		return callback("We could not calculate the power max of the place");

	if(n.power.avg === null || n.power.avg === undefined)
		return callback("We could not calculate the power avg of the place");

	if(n.power.sd === null || n.power.sd === undefined)
		return callback("We could not calculate the power standard deviation of the place");

	if(n.frequencies.values.length < 1)
		return callback("There must be at least one frequency and power in the samples");

	if(n.distance.total === null || n.distance.total === undefined)
		return callback("We could not calculate the total distance of the place");

	if(n.distance.avg === null || n.distance.avg === undefined)
		return callback("We could not calculate the avg distance of the place");

	if(n.distance.max === null || n.distance.max === undefined)
		return callback("We could not calculate the max distance of the place");

	if(n.distance.min === null || n.distance.min === undefined)
		return callback("We could not calculate the total min of the place");

	if(n.outliers.length === 0)
		return callback("We could not calculate the outliers of the place");

	return callback(null);
}