var db = require('../models');
var utils = require('./utils/Utils');
var builder = require('./utils/NewPlaceBuilder');
var placeUtils = require('./utils/PlaceUtils');
var coordinate = require('./coordinates');
var mode = require('./power_mode');

var UserIdentification = 1;

/*-------------------------------------------------------------------*/
exports.create = function(req,res){
	if(Object.keys(req.body).length === 0)
		res.status(404).send('something blew up with your browser, try to update it');
	
	else {
		if(req.body.json){
			console.log('* CREATING NEW PLACE *');
			builder.create(req.body, function(err, place){
				if(err)
					res.status(404).send(err);

				db.Place.findOrCreate({
					UserId:UserIdentification,
					name: place.name, 

				}).success(function(n, created){
					if(created) {
						console.log('* SAVING PLACE *');
						n.numberCoordinates = place.numberCoordinates;
						n.powerMin = place.powerMin;
						n.powerMax = place.powerMax;
						n.powerAvg = place.powerAvg;
						n.sdPowerAvg = place.sdPowerAvg;
						n.avgPowerSD = place.avgPowerSD;
						n.frequencyMin = place.frequencyMin;
						n.frequencyMax = place.frequencyMax;
						n.numberPowerFrequency = place.numberPowerFrequency;
						n.totalDistance = place.totalDistance;
						n.distaceAvg = place.distaceAvg;
						n.distaceMin = place.distaceMin;
						n.distaceMax = place.distaceMax;

						n.save()
						.success(function(){
							coordinate.save(n.id,place.coordinates,function(err){
								if(err)
									res.status(500).send(err);

								mode.save(n.id,place.mode,true,function(err){
									if(err)
										res.status(500).send(err);
									
									res.status(200).send(n);
								});
							});

						}).error(function(err){
							if (process.env.NODE_ENV === 'development')
								res.status(500).send(err);
							else if (process.env.NODE_ENV === 'production')
								res.status(500).send('something blew up');
						});
					
					} else {
						console.log('* UPDATING OLD PLACE *');
						coordinate.save(n.id,place.coordinates,function(err){
							if(err)
								res.status(500).send(err);

							mode.save(n.id,place.mode,false,function(err){
								if(err)
									res.status(500).send(err);
								
								placeUtils.takeStatisticsFromOldPlace(n.id,place,function(err,n){
									if (err)
										res.status(500).send(err);

									res.status(200).send(n);
								});
								
							});
						});
					}

				}).error(function(err){
					if (process.env.NODE_ENV === 'development')
						res.status(500).send(err);
					else if (process.env.NODE_ENV === 'production')
						res.status(500).send('something blew up');
				});
			});
		
		} else	
			res.status(404).send('please update your browser!!');
	}
};

/*-------------------------------------------------------------------*/
exports.list = function(req,res){
	db.Place.findAll({
		where: {
			UserId:UserIdentification,
			visible: true
		}
	}).success(function(places){
		res.status(200).send(places);
	})
	.error(function(err){
		if (process.env.NODE_ENV === 'development')
			res.status(500).send(err);
		else if (process.env.NODE_ENV === 'production')
			res.status(500).send('something blew up');
	});
};

/*-------------------------------------------------------------------*/
exports.get = function(req,res){
	if(utils.isNumber(req.params.id)){
		db.Place.find({
			where: {
				UserId:UserIdentification,
				id: req.params.id,
				visible: true
			},
			include: [{ 
				model: db.Coordinate, 
				where: {
					visible: true
				} 
    		}]
		}).success(function(place){
			if(!place){
				res.status(404).send('Sorry, we cannot find that!');
				return;
			}
			
			res.status(200).send(place);	
		
		}).error(function(err){
			if (process.env.NODE_ENV === 'development')
				res.status(500).send(err);
			else if (process.env.NODE_ENV === 'production')
				res.status(500).send('something blew up');
		});
	} else
		res.status(404).send('Sorry, we cannot find that!');
};

/*-------------------------------------------------------------------*/
exports.update = function(req,res){
	if(utils.isNumber(req.body.id)){








		
		console.log(req.body);
	} else
		res.status(404).send('Sorry, we cannot find that!');
};

/*-------------------------------------------------------------------*/
exports.delete = function(req,res){
	if(utils.isNumber(req.params.id)){
		db.Place.find({
			where: {
				UserId:UserIdentification,
				id: req.params.id,
				visible: true
			}
		}).success(function(place){
			if(!place){
				res.status(404).send('Sorry, we cannot find that!');
				return;
			}

			place.destroy()
			.success(function() {
				res.status(200).send({ msg:'Place '+req.params.id+ ' deleted' });
			}).error(function(err){
				if (process.env.NODE_ENV === 'development')
					res.status(500).send(err);
				else if (process.env.NODE_ENV === 'production')
					res.status(500).send('something blew up');
			});

		}).error(function(err){
			if (process.env.NODE_ENV === 'development')
				res.status(500).send(err);
			else if (process.env.NODE_ENV === 'production')
				res.status(500).send('something blew up');
		});
	
	} else
		res.status(404).send('Sorry, we cannot find that!');
};
