var db = require('../models');

var isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

var UserIdentification = 1;

exports.list = function(req,res){

	db.Place.findAll({
		UserId:UserIdentification,
	}).success(function(docs){
		res.send(docs);
	})
	.error(function(err){
		res.status(500).send({ error: err });
	});
	
};

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
					var placeObject = place.dataValues;
					placeObject.total = result.count;
					placeObject.currentPage = result.count;
					placeObject.coordinates = result.rows;
					res.send(placeObject);
				});

			} else
				res.status(404).send('Sorry, we cannot find that!');
		})
		.error(function(err){
			res.status(500).send({ error: err });
		});
	}
};

exports.getOccupation = function(req,res){
	if(isNumber(req.params.id)){

		var query = 'select frequency / 1000 as frequency, potency from (select coordinates.id from (select id, potencyAvg from Places where UserId = '+UserIdentification+' AND id = '+req.params.id+') as aux, Coordinates where Coordinates.PlaceId = aux.id) as aux, PotencyFrequencies where PotencyFrequencies.CoordinateId = aux.id';
		db.sequelize
		.query(query).success(function(response) {
  			res.send(response);
		})
		.error(function(err){
			res.status(500).send({ error: err });
		});
	}
};