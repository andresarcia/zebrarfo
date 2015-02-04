var express = require('express');
var router = express.Router();

var users = require('./users');
var places = require('./places');
var coordinates = require('./coordinates');
var captures = require('./captures');
var placeUtils = require('./utils/PlaceUtils');
var upload = require('./upload');

/*-------------------------------------------------------------------*/
router.route('/users')
	.post(users.create);

/*-------------------------------------------------------------------*/
router.route('/places/upload')
	.post(upload.createPlace);

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
	.get(coordinates.get);

/*-------------------------------------------------------------------*/
router.route('/places/:idPlace/coordinates/:id')
	.get(captures.get);

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
