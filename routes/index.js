var express = require('express');
var router = express.Router();

var users = require('./users');
var places = require('./places');
var upload = require('./upload');

router.route('/users')
	.post(users.create);

router.route('/places')
	.get(places.list);

router.route('/places/:id/coordinates')
	.get(places.getCoordinates);

router.route('/places/:idPlace/coordinates/:id')
	.get(places.getPowerFrequency);

router.route('/places/:id/occupation')
	.get(places.getOccupation);

router.route('/places/:id/heatmap')
	.get(places.getHeatmap);

router.route('/places/upload')
	.post(upload.createPlace);

router.get('/', function(req, res) {
 	res.send({
  		message: 'Wellcome to API',
	});
});

module.exports = router;
