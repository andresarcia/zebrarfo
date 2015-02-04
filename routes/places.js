var db = require('../models');
var utils = require('./utils/Utils');

var UserIdentification = 1;

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
