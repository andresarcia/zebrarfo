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
router.get('/places', isAuth, places.list);
router.get('/places/:id', isAuth, places.get);
router.put('/places/:id', isAuth, places.update);
router.post('/places', isAuth, places.create);
router.delete('/places/:id', isAuth, places.delete);
router.post('/places/:id/download', isAuth, places.download);

/*-------------------------------------------------------------------*/
router.get('/places/:id/coordinates', isAuth, coordinates.list);

/*-------------------------------------------------------------------*/
router.get('/places/:idPlace/coordinates/:id', isAuth, coordinates.get);

/*-------------------------------------------------------------------*/
router.get('/places/:id/outliers', isAuth, outliers.list);
router.delete('/places/:idPlace/outliers/:id', isAuth, outliers.delete);

/*-------------------------------------------------------------------*/
router.get('/', function(req, res) {
	res.status(200).send({
		message: 'Wellcome to API',
	});
});

module.exports = router;
