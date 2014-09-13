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
			
  			db.Coordinate.findAndCountAll({
     			where: {
					PlaceId:place.id
				},
     			offset: 1,
     			limit: 5
  			})
			.success(function(result) {
				var placeObject = place.dataValues;
				placeObject.total = result.count;
				placeObject.coordinates = result.rows;
				res.send(placeObject);
			});

		})
		.error(function(err){
			res.status(500).send({ error: err });
		});
	}
};