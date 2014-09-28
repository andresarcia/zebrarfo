var sanitize = require('validator').sanitize;
var db = require('../models');

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

exports.get = function(req,res){

	if(req.params.id && req.query.offset && req.query.limit){
		var id = sanitize(req.params.id).xss();
		id = sanitize(id).entityDecode();

		var offset = sanitize(req.query.offset).xss();
		offset = sanitize(offset).entityDecode();

		var limit = sanitize(req.query.limit).xss();
		limit = sanitize(limit).entityDecode();

		db.Place.find({
			where: {
				UserId:UserIdentification,
				id: id
			}
		}).success(function(place){
			if(place)
	  			db.Coordinate.findAndCountAll({
	     			where: {
						PlaceId:place.id
					},
	     			offset: offset,
	     			limit: limit
	  			})
				.success(function(result) {
					var placeObject = place.dataValues;
					placeObject.total = result.count;
					placeObject.currentPage = result.count;
					placeObject.coordinates = result.rows;
					res.send(placeObject);
				});
			else
				res.status(404).send('Sorry, we cannot find that!');
		})
		.error(function(err){
			res.status(500).send({ error: err });
		});
	}
};