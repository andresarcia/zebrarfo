var db = require('../models');

var isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

var UserIdentification = 1;

/*-------------------------------------------------------------------*/
exports.list = function(req,res){
	db.Place.findAll({
		where: {
			UserId:UserIdentification,
			visible: true
		}
	}).success(function(docs){
		if(docs)
			res.status(200).send(docs);
		else
			res.status(200).send('Sorry, we cannot find that!');
	})
	.error(function(err){
		res.status(404).send({ error: err });
	});
};

/*-------------------------------------------------------------------*/
exports.getPlace = function(req,res){
	if(isNumber(req.params.id)){
		db.Place.find({
			where: {
				UserId:UserIdentification,
				id: req.params.id,
				visible: true
			}
		}).success(function(place){
			if(place)
				res.status(200).send(place);
			else
				res.status(404).send('Sorry, we cannot find that!');
		})
		.error(function(err){
			res.status(500).send({ error: err });
		});
	} else
		res.status(404).send('Sorry, we cannot find that!');
};

/*-------------------------------------------------------------------*/
exports.updatePlace = function(req,res){
	if(isNumber(req.params.id)){
	
	} else
		res.status(404).send('Sorry, we cannot find that!');
};

/*-------------------------------------------------------------------*/
exports.deletePlace = function(req,res){
	if(isNumber(req.params.id)){
		db.Place.find({
			where: {
				UserId:UserIdentification,
				id: req.params.id,
				visible: true
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
				res.status(404).send('Sorry, we cannot find that!');
		}).error(function(err){
			res.status(500).send({ error: err });
		});
	
	} else
		res.status(404).send('Sorry, we cannot find that!');
};

/*-------------------------------------------------------------------*/
exports.getCoordinates = function(req,res){
	if(isNumber(req.params.id)){
		db.Place.find({
			where: {
				UserId:UserIdentification,
				id: req.params.id,
				visible: true
			}
		}).success(function(place){
			if(place){
				var options;

				if(isNumber(req.query.offset) && isNumber(req.query.limit))
					options = { 
								where: { 
									PlaceId:place.id, 
									visible: true 
								}, 
								offset: req.query.offset, 
								limit: req.query.limit 
							};
				else
					options = { 
								where: { 
									PlaceId:place.id, 
									visible: true 
								}
							};

	  			db.Coordinate.findAndCountAll(options)
				.success(function(result) {
					var placeObject = {};
					placeObject.total = result.count;
					placeObject.currentPage = result.count;
					placeObject.coordinates = result.rows;
					res.status(200).send(placeObject);
				}).error(function(err){
					res.status(500).send({ error: err });
				});

			} else
				res.status(404).send('Sorry, we cannot find that!');
		})
		.error(function(err){
			res.status(500).send({ error: err });
		});
	
	} else
		res.status(404).send('Sorry, we cannot find that!');
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
  					res.status(200).send(response);
				})
				.error(function(err){
					res.status(500).send({ error: err });
				});
			} else
				res.status(404).send('Sorry, we cannot find that!');
		})
		.error(function(err){
			res.status(500).send({ error: err });
		});

	} else
		res.status(404).send('Sorry, we cannot find that!');
};

/*-------------------------------------------------------------------*/
exports.getChartsData = function(req,res){
	if(isNumber(req.params.id)){
		var query = 'select aux.id, aux.lat,aux.lng,frequency,power from (select Coordinates.latitude as lat, Coordinates.longitude as lng, Coordinates.id from (select id from Places where id = '+req.params.id+' and UserId = '+ UserIdentification+' ) as aux, Coordinates where Coordinates.PlaceId = aux.id) as aux, PowerFrequencies where PowerFrequencies.CoordinateId = aux.id order by frequency';

		db.sequelize
		.query(query).success(function(response) {
			res.status(200).send({ data: response });
		})
		.error(function(err){
			res.status(500).send({ error: err });
		});
	} else
		res.status(404).send('Sorry, we cannot find that!');	
};