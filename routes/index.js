var express = require('express');
var router = express.Router();

var users = require('./users');
var places = require('./places');
var coordinates = require('./coordinates');
var upload = require('./upload');

router.route('/users')
	.post(users.create);

router.route('/places')
	.post(places.create);

router.route('/coordinates')
	.post(coordinates.create);

router.route('/upload')
	.post(upload.create);

router.get('/', function(req, res) {
 	res.send({
  		message: 'Wellcome to API',
	});
});

module.exports = router;
