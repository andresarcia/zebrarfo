var db = require('../models');

var isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

var UserIdentification = 1;

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
				res.status(200).send('Sorry, we cannot find that!');
		})
		.error(function(err){
			res.status(500).send({ error: err });
		});
	
	} else
		res.status(200).send('Sorry, we cannot find that!');
};

exports.getPowerFrequency = function(req, res){
	if(isNumber(req.params.idPlace) && isNumber(req.params.id)){
		
		db.Place.find({
			where: {
				UserId:UserIdentification,
				id: req.params.idPlace
			}
		}).success(function(place){
			if(place) {
				var query = 'select frequency, power from (select id	from Coordinates where PlaceId = '+req.params.idPlace+' and id = '+req.params.id+' ) as aux, PowerFrequencies where CoordinateId = aux.id';
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

exports.getOccupation = function(req,res){
	if(isNumber(req.params.id)){
		db.Place.find({
			where: {
				UserId:UserIdentification,
				id: req.params.id
			}
		}).success(function(place){
			if(place) {
				var query = 'select frequency,power from (select Coordinates.id from (select id from Places where id = '+req.params.id+') as aux, Coordinates where Coordinates.PlaceId = aux.id) as aux, PowerFrequencies where aux.id = PowerFrequencies.CoordinateId order by frequency';
	
				db.sequelize
				.query(query).success(function(response) {
					var aux = {};
					aux.place = place;
					aux.occupation = response;
					res.send(aux);
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

exports.getHeatmap = function(req,res){
	if(isNumber(req.params.id)){
		db.Place.find({
			where: {
				UserId:UserIdentification,
				id: req.params.id
			}
		}).success(function(place){
			if(place) {
				var query = 'select aux.lat,aux.lng,frequency,power from (select Coordinates.latitude as lat, Coordinates.longitude as lng, Coordinates.id from (select id from Places where id = '+req.params.id+' ) as aux, Coordinates where Coordinates.PlaceId = aux.id) as aux, PowerFrequencies where PowerFrequencies.CoordinateId = aux.id order by frequency';
	
				db.sequelize
				.query(query).success(function(response) {
					var aux = {};
					aux.place = place;
					aux.occupation = response;
					res.send(aux);
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
