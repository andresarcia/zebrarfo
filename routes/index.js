var express = require('express');
var router = express.Router();
var passport = require('passport');

var users = require('../controllers/users');
var auth = require('../controllers/auth');
var places = require('./places');
var coordinates = require('./coordinates');
var outliers = require('./outliers');
var placeUtils = require('./utils/PlaceUtils');

var auth = function(req, res, next){ 
	if (!req.isAuthenticated()) res.send(401); 
	else next(); 
};

/* AUTH --------------------------------------------------------------*/
router.post('/login', 
	passport.authenticate('local'),
	function(req, res) {
		res.status(200).send(req.user);
	});

router.post('/logout', 
	function(req, res){ 
		req.logOut(); 
		res.send(200); 
	});

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
