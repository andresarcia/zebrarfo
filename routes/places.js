var db = require('../models');

var isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

var UserIdentification = 1;

/*-------------------------------------------------------------------*/
exports.list = function(req,res){
	db.Place.findAll({
		UserId:UserIdentification,
	}).success(function(docs){
		if(docs)
			res.send(docs);
		else
			res.status(200).send('Sorry, we cannot find that!');
	})
	.error(function(err){
		res.status(500).send({ error: err });
	});
};

/*-------------------------------------------------------------------*/
exports.getPlace = function(req,res){
	if(isNumber(req.params.id)){
		db.Place.find({
			where: {
				UserId:UserIdentification,
				id: req.params.id
			}
		}).success(function(place){
			if(place)
				res.send(place);
			else
				res.status(200).send('Sorry, we cannot find that!');
		})
		.error(function(err){
			res.status(500).send({ error: err });
		});
	} else
		res.status(200).send('Sorry, we cannot find that!');
};

/*-------------------------------------------------------------------*/
exports.deletePlace = function(req,res){
	if(isNumber(req.params.id)){
		db.Place.find({
			where: {
				UserId:UserIdentification,
				id: req.params.id
			}
		}).success(function(place){
			if(place)
				place.destroy()
				.success(function() {
				    res.status(200).send({ msg: 'Place '+req.params.id+ ' deleted' });
				}).error(function(err){
					res.status(500).send({ error: err });
				});
			else
				res.status(200).send('Sorry, we cannot find that!');
		}).error(function(err){
			res.status(500).send({ error: err });
		});
	
	} else
		res.status(200).send('Sorry, we cannot find that!');
};

/*-------------------------------------------------------------------*/
exports.getCoordinates = function(req,res){
	if(isNumber(req.params.id)){
		db.Place.find({
			where: {
				UserId:UserIdentification,
				id: req.params.id
			}
		}).success(function(place){
			if(place){
				var options;

				if(isNumber(req.query.offset) && isNumber(req.query.limit))
					options = { where: { PlaceId:place.id }, offset: req.query.offset, limit: req.query.limit };
				else
					options = { where: { PlaceId:place.id }};

	  			db.Coordinate.findAndCountAll(options)
				.success(function(result) {
					var placeObject = {};
					placeObject.total = result.count;
					placeObject.currentPage = result.count;
					placeObject.coordinates = result.rows;
					res.send(placeObject);
				}).error(function(err){
					res.status(500).send({ error: err });
				});

			} else
				res.status(200).send('Sorry, we cannot find that!');
		})
		.error(function(err){
			res.status(500).send({ error: err });
		});
	
	} else
		res.status(200).send('Sorry, we cannot find that!');
};

/*-------------------------------------------------------------------*/
exports.deleteCoordinate = function(req, res){
	if(isNumber(req.params.idPlace) && isNumber(req.params.id)){
		db.Place.find({
			where: {
				UserId:UserIdentification,
				id: req.params.idPlace
			}
		}).success(function(place){
			if(place){
				db.Coordinate.find({
					where: {
						PlaceId:req.params.idPlace,
						id: req.params.id
					}
				}).success(function(coord){
					coord.destroy()
					.success(function() {
						place.numberCoordinates = place.numberCoordinates - 1;
						place.save().success(function(){
							res.status(200).send({ msg: 'Coor '+req.params.id+ ' deleted' });
						})
						.error(function(err){
							res.status(500).send({ error: err });
						});
					}).error(function(err){
						res.status(500).send({ error: err });
					});
				}).error(function(err){
					res.status(500).send({ error: err });
				});

			} else
				res.status(200).send('Sorry, we cannot find that!');
		}).error(function(err){
			res.status(500).send({ error: err });
		});
	}
	else
		res.status(200).send('Sorry, we cannot find that!');
};

/*-------------------------------------------------------------------*/
exports.getPowerFrequency = function(req, res){
	if(isNumber(req.params.idPlace) && isNumber(req.params.id)){
		
		db.Place.find({
			where: {
				UserId:UserIdentification,
				id: req.params.idPlace
			}
		}).success(function(place){
			if(place) {
				var query = 'select frequency, power from (select id from Coordinates where PlaceId = '+req.params.idPlace+' and id = '+req.params.id+' ) as aux, PowerFrequencies where CoordinateId = aux.id';
				db.sequelize
				.query(query).success(function(response) {	
  					res.send(response);
				})
				.error(function(err){
					res.status(500).send({ error: err });
				});
			} else
				res.status(200).send('Sorry, we cannot find that!');
		})
		.error(function(err){
			res.status(500).send({ error: err });
		});

	} else
		res.status(200).send('Sorry, we cannot find that!');
};

/*-------------------------------------------------------------------*/
exports.getOccupation = function(req,res){
	if(isNumber(req.params.id)){
		var query = 'select frequency,power from (select Coordinates.id from (select id from Places where id = '+req.params.id+' and UserId = '+ UserIdentification+' ) as aux, Coordinates where Coordinates.PlaceId = aux.id) as aux, PowerFrequencies where aux.id = PowerFrequencies.CoordinateId order by frequency';

		db.sequelize
		.query(query).success(function(response) {
			res.send(response);
		})
		.error(function(err){
			res.status(500).send({ error: err });
		});
	} else
		res.status(200).send('Sorry, we cannot find that!');	
};

/*-------------------------------------------------------------------*/
exports.getHeatmap = function(req,res){
	if(isNumber(req.params.id)){
		var query = 'select aux.lat,aux.lng,frequency,power from (select Coordinates.latitude as lat, Coordinates.longitude as lng, Coordinates.id from (select id from Places where id = '+req.params.id+' and UserId = '+ UserIdentification+' ) as aux, Coordinates where Coordinates.PlaceId = aux.id) as aux, PowerFrequencies where PowerFrequencies.CoordinateId = aux.id order by lat, lng';

		db.sequelize
		.query(query).success(function(response) {
			var sol = {};
			sol.data = response;
			res.send(sol);
		})
		.error(function(err){
			res.status(500).send({ error: err });
		});
	} else
		res.status(200).send('Sorry, we cannot find that!');
};
