var db = require('../models');
var utils = require('./utils/Utils');

var UserIdentification = 1;

/*-------------------------------------------------------------------*/
exports.get = function(req, res){
	if(utils.isNumber(req.params.idPlace) && utils.isNumber(req.params.id)){
		
		db.Place.find({
			where: {
				UserId:UserIdentification,
				id: req.params.idPlace,
				visible: true
			}
		}).success(function(place){
			if(!place){
				res.status(404).send('Sorry, we cannot find that!');
				return;
			}

			place.getCoordinates({ 
				where: {
					id: req.params.id,
					visible: true
				}
			}).success(function(coord){
				if(coord.length == 0){
					res.status(404).send('Sorry, we cannot find that!');
					return;
				}

				coord[0].getCaptures({
					attributes: ['frequency', 'power'],
				}).success(function(data){
					if(data.length == 0){
						res.status(404).send('Sorry, we cannot find that!');
						return;
					}

					res.status(200).send(data);

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

		}).error(function(err){
			if (process.env.NODE_ENV === 'development')
				res.status(500).send(err);
			else if (process.env.NODE_ENV === 'production')
				res.status(500).send('something blew up');
		});

	} else
		res.status(404).send('Sorry, we cannot find that!');
};