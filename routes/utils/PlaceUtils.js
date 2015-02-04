var db = require('../../models');
var utils = require('./Utils');

var UserIdentification = 1;

/*-----------------------------------------------------------------*/
exports.getOccupationHetmapData = function(req,res){
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
					'where id = '+req.params.id+' and UserId = '+ UserIdentification+'' +
				') as aux, Coordinates ' +
				'where Coordinates.PlaceId = aux.id' +
			') as aux, Captures ' +
			'where Captures.CoordinateId = aux.id order by frequency';

		db.sequelize
		.query(query).success(function(response) {
			if(response.length == 0){
				res.status(404).send('Sorry, we cannot find that!');
				return;
			}

			res.status(200).send({ data: response });
		})
		.error(function(err){
			if (process.env.NODE_ENV === 'development')
				res.status(500).send(err);
			else if (process.env.NODE_ENV === 'production')
				res.status(500).send('something blew up');
		});
	} else
		res.status(404).send('Sorry, we cannot find that!');	
};


/*-----------------------------------------------------------------*/
exports.takeStatisticsFromOldPlace = function(id, n, callback){	
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
exports.takePowerModeFromPlace = function(id, callback){	
	
	// db.PowerFrequency.findAll({
	// 	attributes: ['frequency', 'power'],
	// 	include: [{
	// 		model: db.Coordinate,
	// 		attributes: ['latitude', 'longitude', 'id'],
	// 		where: {
	// 			visible: true
	// 		},
	// 		include: [{
	// 			model: db.Place,
	// 			attributes: [],
	// 			where: {
	// 				UserId:UserIdentification,
	// 				visible: true,
	// 				id: id
	// 			}
	// 		}]
	// 	}]
	// }).success(function(data){
	// 	data = JSON.stringify(data);
	// 	data = JSON.parse(data);
	// 	// console.log(data);
		callback();
	// }).error(function(err){
	// 	return callback(err,null);
	// });




	// db.Place.find({
	// 	where: {
	// 		id: id,
	// 		UserId: UserIdentification,
	// 		visible: true
	// 	},
	// 	include: [
 //    		{ model: db.Coordinate, include: [{ model: db.PowerFrequency }] }
 //  		]
	// })
	// .success(function(place){
	// 	var mode = {};
		



	// 	callback();
	// })
	// .error(function(err){
	// 	return callback(err,null);
	// });
};
