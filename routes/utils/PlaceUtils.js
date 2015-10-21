var i = require('./PlaceUtils');
var db = require('../../models');
var utils = require('./Utils');
var builder = require('./PlaceBuilder');
var outliers = require('../outliers');
var _ = require('underscore');
var async = require('async');


/*-----------------------------------------------------------------*/
exports.getFullPlace = function(userId, id, callback){
	db.Place.find({
		where: {
			id: id,
			UserId: userId,
			visible: true
		},
		include: [{ 
			model: db.Coordinate, 
			where: {
				visible: true
			}
		}]
	})
	.then(function(place){
		place = JSON.stringify(place);
		place = JSON.parse(place);
		
		return callback(null,place);
	})
	.catch(function(err){
		return callback(err,null);
	});
};

/*-----------------------------------------------------------------*/
exports.takeStatsComparingPlace = function(userId,id, n, callback){	
	console.log('* UPDATING PLACE STATS *');

	db.Place.find({
		where: {
			id: id,
			UserId: userId,
			visible: true
		}
	}).then(function(o){
		db.Coordinate.count({ where: { PlaceId:id } })
		.then(function(count){

			if(count != o.numberCoordinates){
				o.numberCoordinates = count;
				if(o.powerMin > n.powerMin)
					o.powerMin = n.powerMin;
				if(o.powerMax < n.powerMax)
					o.powerMax = n.powerMax;

				o.powerAvg = (o.powerAvg + n.powerAvg)/2;
				o.avgPowerSD = (o.avgPowerSD + n.avgPowerSD)/2;

				if(count > 1){
					var sdPowerAvg_M = o.powerAvg + n.powerAvg;
					var sdPowerAvg_X = (o.powerAvg * o.powerAvg) + (n.powerAvg * n.powerAvg);
					sdPowerAvg_X = Math.sqrt((sdPowerAvg_X - (sdPowerAvg_M*sdPowerAvg_M)/count)/(count - 1));
					o.sdPowerAvg = Number(sdPowerAvg_X.toFixed(5));

					o.totalDistance = o.totalDistance + n.totalDistance;
					o.distanceAvg = (o.distanceAvg + n.distanceAvg)/2;

					if(o.distanceMin > n.distanceMin)
						o.distanceMin = n.distanceMin;
					if(o.distanceMax < n.distanceMax)
						o.distanceMax = n.distanceMax;

				} else
					o.sdPowerAvg = 0;

				o.save().then(function(){
					return callback(null,o);
				})
				.catch(function(err){
					return callback(err,null);
				});

			} else{
				return callback(null,o);
			}

		})
		.catch(function(err){
			return callback(err,null);
		});
	})
	.catch(function(err){
		return callback(err,null);
	});
};

/*-----------------------------------------------------------------------------*/
exports.retakeStats = function(userId, id, callback){
	i.getFullPlace(userId, id, function(err,place){
		if(err){
			return callback(err,null);
		}

		place.power = JSON.parse(place.power);
		place.frequencies = JSON.parse(place.frequencies);
		place.distance = JSON.parse(place.distance);

		builder.create(null, place, false, function(err, n){
			if(err){
				return callback(err,null);
			}

			return callback(null,n);
		});
	});
};

/*-----------------------------------------------------------------------------*/
exports.retakeStatsAndSave = function(userId,id, callback){
	i.retakeStats(userId, id, function(err, n){
		if(err) {
			callback(err,null);
		}

		outliers.save(id,n.outliers,false,function(err){
			if(err){
				return callback(err,null);
			}
			
			db.Place.find({
				where: {
					UserId:userId,
					id: id,
					visible: true
				}
			}).then(function(o){

				o.numberCoordinates = n.coordinates.length;
				o.frequencies = JSON.stringify(n.frequencies);
				o.power = JSON.stringify(n.power);
				o.distance = JSON.stringify(n.distance);

				o.save()
				.then(function(){
					return callback(null,n);

				}).catch(function(err){
					return callback(err,null);
				});
			}).catch(function(err){
				return callback(err,null);
			});
		});
	});
};

exports.saveCoordinateCapturesAvg = function(userId, placeId, coordinateToSave, coordinates, callback){
	var captures = [];
	var coordSave = null;

	coordinates.push(coordinateToSave);
	db.Place.find({
		where: {
			id: placeId,
			UserId: userId,
			visible: true
		},
	})
	.then(function(place){
		if(place == null){
			return callback("Sorry, we cannot find that!");
		}

		var i = 0;
		async.eachSeries(coordinates, function(coord, callbackInner) {
			place.getCoordinates({ 
				where: {
					id: coord,
					visible: true
				}
			}).then(function(coord){
				var data = JSON.parse(coord[0].dataValues.cap);
				_.each(data, function(power, j){
					if(!captures[j]){
						captures[j] = power;
					} else {
						captures[j] += power;
					}
				});

				if(i < coordinates.length - 1){
					coord[0].dataValues.visible = false;
					coord[0].save()
					.then(function(){
						i += 1;
						return callbackInner();
					})
					.catch(function(err){
						return callbackInner(err);
					});
				} else {
					return callbackInner();
				}

			}).catch(function(err){
				return callbackInner(err);
			});
		}, function(err){
			if(err){
				return callback(err);
			}

			var capturesAvg = [];
			_.each(captures, function(item){
				capturesAvg.push(item / coordinates.length);
			});

			place.getCoordinates({ 
				where: {
					id: coordinateToSave,
					visible: true
				}
			}).then(function(coord){

				coord[0].dataValues.cap = JSON.stringify(capturesAvg);
				coord[0].save()
				.then(function() {
					return callback();
				}).catch(function(err) {
					return callback(err);
				});

			}).catch(function(err){
				return callback(err);
			});
		});

	}).catch(function(err){
		return callback(err);
	});
};


exports.toJson = function(userId,id,callback){
	i.getFullPlace(userId, id, function(err,place){
		if(err){
			return callback(err,null);
		}

		if(place == null){
			return callback(null,null);
		}

		delete place.id;
		delete place.numberCoordinates;
		delete place.visible;
		delete place.UserId;
		delete place.createdAt;
		delete place.updatedAt;

		place.power = JSON.parse(place.power);
		place.frequencies = JSON.parse(place.frequencies);
		delete place.frequencies.bands;
		delete place.frequencies.width;

		place.distance = JSON.parse(place.distance);
		delete place.distance.sd;

		place.coordinates = _.clone(place.Coordinates);
		delete place.Coordinates;

		_.each(place.coordinates, function(item, i){
			delete item.id;
			delete item.powerMin;
			delete item.powerMax;
			delete item.powerAvg;
			delete item.powerSD;
			delete item.visible;
			delete item.PlaceId;
			delete item.createdAt;
			delete item.updatedAt;
			item.cap = JSON.parse(item.cap);
		});

		var name = _.clone(place.name);
		delete place.name;

		return callback(null,place,name);
	});
};