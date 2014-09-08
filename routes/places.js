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
	if(req.params.id){
		var id = sanitize(req.params.id).xss();
		id = sanitize(id).entityDecode();

		db.Place.find({
			where: {
				UserId:UserIdentification,
				id: id
			}
		}).success(function(place){
			
			db.Coordinate.findAll({
				where: {
					PlaceId:place.id
				}
			}).success(function(coordinates){
				
				var placeObject = place.dataValues;
				placeObject.coordinates = JSON.parse(JSON.stringify(coordinates));
				res.send(placeObject);

			})
			.error(function(err){
				res.status(500).send({ error: err });
			});

		})
		.error(function(err){
			res.status(500).send({ error: err });
		});
	}
};