var db = require('../../models');

var UserIdentification = 1;

/*-----------------------------------------------------------------*/
exports.takeStatisticsFromOldPlace = function(id, n, callback){	
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
	db.Place.find({
		where: {
			id: id,
			UserId: UserIdentification,
			visible: true
		},
		include: [
    		{ model: db.Coordinate }
  		]
	}).success(function(place){
		console.log(place);
		callback();
	})
	.error(function(err){
		return callback(err,null);
	});

	// var v = [];

	// _.each(_.keys(data), function(key){
	// 	v.push({
	// 		power: key,
	// 		frequency: data[key],
	// 		PlaceId: placeId
	// 	});
	// });
			    
 //    db.PowerMode.bulkCreate(v)
	// .success(function() { 
	// 	callback();
	// }).error(function(err){
	// 	return callback(err);
	// });
}
