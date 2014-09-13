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
	.get(places.get);

router.route('/upload')
	.post(upload.create);

router.get('/', function(req, res) {
 	res.send({
  		message: 'Wellcome to API',
	});
});

module.exports = router;
