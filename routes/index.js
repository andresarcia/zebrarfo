var express = require('express');
var router = express.Router();

var auth = require('../controllers/auth');
var users = require('../controllers/users');
var isAuth = auth.isAuth;

var places = require('./places');
var coordinates = require('./coordinates');
var outliers = require('./outliers');
var placeUtils = require('./utils/PlaceUtils');

/* AUTH --------------------------------------------------------------*/
router.post('/login', auth.login);
router.post('/logout', isAuth, auth.logout);

/* USERS -------------------------------------------------------------*/
router.post('/users', users.create);

/* PLACES ------------------------------------------------------------*/
router.post('/places', places.create);
router.get('/places', places.list);
router.get('/places/:id', places.get);
router.put('/places/:id', places.update);
router.delete('/places/:id', places.delete);
router.get('/places/:id/download', places.download);

/*-------------------------------------------------------------------*/
router.route('/places/:id/coordinates')
	.get(coordinates.list);

/*-------------------------------------------------------------------*/
router.route('/places/:idPlace/coordinates/:id')
	.get(coordinates.get);

/*-------------------------------------------------------------------*/
router.route('/places/:id/outliers')
	.get(outliers.list);

router.route('/places/:idPlace/outliers/:id')
	.delete(outliers.delete);

/*-------------------------------------------------------------------*/
router.route('/places/:id/charts')
	.get(placeUtils.getOccupationHetmapData);

/*-------------------------------------------------------------------*/
router.get('/', function(req, res) {
	res.status(200).send({
		message: 'Wellcome to API',
	});
});

module.exports = router;
