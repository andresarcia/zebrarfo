var i = require('./PlaceUtils')
var db = require('../../models');
var utils = require('./Utils');
var builder = require('./PlaceBuilder');
var httpError = require('build-http-error');

var UserIdentification = 1;

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
					'where id = '+req.params.id+' and UserId = '+ UserIdentification+' and visible = 1' +
				') as aux, Coordinates ' +
				'where Coordinates.PlaceId = aux.id and Coordinates.visible = 1' +
			') as aux, Captures ' +
			'where Captures.CoordinateId = aux.id order by frequency';

		db.sequelize
		.query(query).success(function(response) {
			if(response.length == 0){
				next(httpError(404));
				return;
			}

			res.status(200).send({ data: response });
		})
		.error(function(err){
			next(httpError(err));
		});
	} else
		next(httpError(404));
};

/*-----------------------------------------------------------------*/
exports.getFullPlace = function(id,callback){
	db.Place.find({
		where: {
			id: id,
			UserId: UserIdentification,
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
	.success(function(place){
		place = JSON.stringify(place);
		place = JSON.parse(place);
		
		callback(null,place);
	})
	.error(function(err){
		return callback(err,null);
	});
};

/*-----------------------------------------------------------------*/
exports.takeStatsComparingPlace = function(id, n, callback){	
	console.log('* UPDATING PLACE STATS *');

	db.Place.find({
		where: {
			id: id,
			UserId: UserIdentification,
			visible: true
		}
	}).success(function(o){
		db.Coordinate.count({ where: { PlaceId:id } })
		.success(function(count){

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
					o.distaceAvg = (o.distaceAvg + n.distaceAvg)/2;

					if(o.distaceMin > n.distaceMin)
						o.distaceMin = n.distaceMin;
					if(o.distaceMax < n.distaceMax)
						o.distaceMax = n.distaceMax;

				} else
					o.sdPowerAvg = 0;

				o.save().success(function(){
					callback(null,o);
				})
				.error(function(err){
					return callback(err,null);
				});

			} else
	  			callback(null,o);

		})
		.error(function(err){
			return callback(err,null);
		});
	})
	.error(function(err){
		return callback(err,null);
	});
};

/*--------------------------------------------------------------------------------------------------------------*/
exports.retakeStats = function(id, callback){
	i.getFullPlace(id, function(err,place){
		if(err) 
			return callback(err,null);

		builder.create(place, function(err, n){
			delete n.coordinates;
			callback(null,n);
		});
		
	});
};
