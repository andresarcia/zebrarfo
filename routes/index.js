var express = require('express');
var router = express.Router();

var users = require('./users');
var places = require('./places');
var upload = require('./upload');

/*-------------------------------------------------------------------*/
router.route('/users')
	.post(users.create);

/*-------------------------------------------------------------------*/
router.route('/places')
	.get(places.list);

router.route('/places/upload')
	.post(upload.createPlace);

/*-------------------------------------------------------------------*/
router.route('/places/:id')
	.get(places.getPlace);

router.route('/places/:id')
	.delete(places.deletePlace);

router.route('/places/:id/coordinates')
	.get(places.getCoordinates);

router.route('/places/:idPlace/coordinates/:id')
	.get(places.getPowerFrequency);

router.route('/places/:idPlace/coordinates/:id')
	.delete(places.deleteCoordinate);

router.route('/places/:id/charts')
	.get(places.getChartsData);

/*-------------------------------------------------------------------*/
router.get('/', function(req, res) {
 	res.send({
  		message: 'Wellcome to API',
	});
});

module.exports = router;
