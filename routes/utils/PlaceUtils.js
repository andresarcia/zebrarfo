var i = require('./PlaceUtils');
var db = require('../../models');
var utils = require('./Utils');
var builder = require('./PlaceBuilder');
var httpError = require('build-http-error');
var outliers = require('../outliers');
var _ = require('underscore');
var async = require('async');
var capturesModel = require('../captures');

/*-----------------------------------------------------------------*/
exports.getOccupationHetmapData = function(req,res,next){
	if(utils.isNumber(req.params.id)){
		
		var query = 
			'select ' +
				'aux.id, aux.lat, aux.lng, frequency, power ' +
			'from (' + 
				'select ' + 
					'Coordinates.latitude as lat, Coordinates.longitude as lng, Coordinates.id ' +
				'from (' +
					'select ' +
						'id ' +
					'from Places ' +
					'where id = '+req.params.id+' and UserId = '+ req.user.iss+' and visible = 1' +
				') as aux, Coordinates ' +
				'where Coordinates.PlaceId = aux.id and Coordinates.visible = 1' +
			') as aux, Captures ' +
			'where Captures.CoordinateId = aux.id order by frequency';

		db.sequelize
		.query(query).then(function(response) {
			if(response[0].length == 0){
				next(httpError(404));
				return;
			}

			res.status(200).send({ data: response[0] });
		})
		.catch(function(err){
			next(httpError(err));
		});
	} else
		next(httpError(404));
};

/*-----------------------------------------------------------------*/
exports.getFullPlace = function(userId,id,callback){
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
			},
			include: [{ 
				model: db.Capture 
			}] 
		}]
	})
	.then(function(place){
		place = JSON.stringify(place);
		place = JSON.parse(place);
		
		callback(null,place);
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
					callback(null,o);
				})
				.catch(function(err){
					return callback(err,null);
				});

			} else
	  			callback(null,o);

		})
		.catch(function(err){
			return callback(err,null);
		});
	})
	.catch(function(err){
		return callback(err,null);
	});
};

/*--------------------------------------------------------------------------------------------------------------*/
exports.retakeStats = function(userId, id, callback){
	i.getFullPlace(userId, id, function(err,place){
		if(err) 
			return callback(err,null);

		builder.create(place, function(err, n){
			delete n.coordinates;
			callback(null,n);
		});
	});
};

/*--------------------------------------------------------------------------------------------------------------*/
exports.retakeStatsAndSave = function(userId,id, callback){
	i.retakeStats(userId, id, function(err, n){
		if(err) {
			callback(err,null);
		}

		outliers.save(id,n.outliers,false,function(err){
			if(err)
				callback(err,null);
			
			db.Place.find({
				where: {
					UserId:userId,
					id: id,
					visible: true
				}
			}).then(function(o){
				o.numberCoordinates = n.numberCoordinates;
				o.powerMin = n.powerMin;
				o.powerMax = n.powerMax;
				o.powerAvg = n.powerAvg;
				o.sdPowerAvg = n.sdPowerAvg;
				o.avgPowerSD = n.avgPowerSD;
				o.numberPowerFrequency = n.numberPowerFrequency;
				o.frequencyMin = n.frequencyMin;
				o.frequencyMax = n.frequencyMax;
				o.totalDistance = n.totalDistance;
				o.distanceAvg = n.distanceAvg;
				o.distanceMin = n.distanceMin;
				o.distanceMax = n.distanceMax;

				o.save()
				.then(function(){
					callback(null,n);

				}).catch(function(err){
					callback(err,null);
				});
			}).catch(function(err){
				callback(err,null);
			});
		});
	});
};

exports.saveCoordinateCapturesAvg = function(userId,placeId, coordinateToSave, coordinates, callback){
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
		if(place == null)
			return callback("Sorry, we cannot find that!");

		var i = 0;
		async.eachSeries(coordinates, function(coord, callbackInner) {
			place.getCoordinates({ 
				where: {
					id: coord,
					visible: true
				}
			}).then(function(coord){
				coord[0].getCaptures({
					attributes: ['frequency','power','CoordinateId'],
				}).then(function(data){
					data = JSON.stringify(data);
					data = JSON.parse(data);

					_.each(data, function(item,i){
						if(!captures[i]){
							captures[i] = {
								frequency: item.frequency,
								power: item.power,
							};
						} else {
							captures[i].power += item.power;
						}
					});

					if(i < coordinates.length - 1){
						coord[0].dataValues.visible = false;
						coord[0].save()
						.then(function(){
							i += 1;
							callbackInner();
						})
						.catch(function(err){
							callbackInner(err);
						});
					} else {
						callbackInner();
					}

				}).catch(function(err){
					callbackInner(err);
				});
			}).catch(function(err){
				callbackInner(err);
			});
		}, function(err){
			if(err)
				return callback(err);

			_.each(captures, function(item){
				item.power /= coordinates.length;
			});

			capturesModel.deleteAndSave(coordinates[coordinates.length - 1], captures,
			function(err){
				if(err) return callback(err);
				callback();
			});
		});

	}).catch(function(err){
		return callback(err);
	});
};


exports.toJson = function(userId,id,callback){
	i.getFullPlace(userId, id, function(err,place){
		if(err) 
			return callback(err,null);

		if(place == null)
			return callback(null,null);

		place.frequencies = {};
		place.frequencies.values = [];

		delete place.id;
		delete place.numberCoordinates;
		delete place.powerMin;
		delete place.powerMax;
		delete place.powerAvg;
		delete place.sdPowerAvg;
		delete place.avgPowerSD;
		delete place.numberPowerFrequency;
		delete place.frequencyMin;
		delete place.frequencyMax;
		delete place.totalDistance;
		delete place.distanceAvg;
		delete place.distanceMin;
		delete place.distanceMax;
		delete place.visible;
		delete place.UserId;
		delete place.createdAt;
		delete place.updatedAt;

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
			item.cap = [];

			_.each(item.Captures, function(cap,j){
				if(i == 0)
					place.frequencies.values.push(cap.frequency);

				item.cap.push(cap.power);
			});

			item.lat = _.clone(item.latitude);
			item.lng = _.clone(item.longitude);
			item.date = _.clone(item.createdDate);

			delete item.latitude;
			delete item.longitude;
			delete item.createdDate;
			delete item.Captures;
		});

		var name = _.clone(place.name);
		delete place.name;

		return callback(null,place,name);
	});
}