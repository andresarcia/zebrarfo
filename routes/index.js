var express = require('express');
var router = express.Router();

var users = require('./users');
var places = require('./places');
var coordinates = require('./coordinates');
var power_mode = require('./power_mode');
var placeUtils = require('./utils/PlaceUtils');

/*-------------------------------------------------------------------*/
router.route('/users')
	.post(users.create);

/*-------------------------------------------------------------------*/
router.route('/places/upload')
	.post(places.create);

router.route('/places')
	.get(places.list);

router.route('/places/:id')
	.get(places.get);

router.route('/places/:id')
	.put(places.update);

router.route('/places/:id')
	.delete(places.delete);

/*-------------------------------------------------------------------*/
router.route('/places/:id/coordinates')
	.get(coordinates.list);

/*-------------------------------------------------------------------*/
router.route('/places/:idPlace/coordinates/:id')
	.get(coordinates.get);

/*-------------------------------------------------------------------*/
router.route('/places/:id/outliers')
	.get(power_mode.list);

router.route('/places/:idPlace/outliers/:id')
	.delete(power_mode.delete);

/*-------------------------------------------------------------------*/
router.route('/places/:id/charts')
	.get(placeUtils.getOccupationHetmapData);

/*-------------------------------------------------------------------*/
router.get('/', function(req, res) {
 	res.status(200).send({
  		msg: 'Wellcome to API',
	});
});

module.exports = router;
