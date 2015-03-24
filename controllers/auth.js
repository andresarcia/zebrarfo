// Load required packages
var app = require('../app');
var httpError = require('build-http-error');
var url = require('url');
var passport = require('passport');
var strategy = require('../config/passport');
var jwt = require('jwt-simple');
var moment = require('moment');


exports.isAuth = function(req, res, next){ 

	var parsed_url = url.parse(req.url, true);
	var token = (req.body && req.body.access_token) || parsed_url.query.access_token || req.headers["x-access-token"];

	if(token) {
		try {
			var decoded = jwt.decode(token, app.get('jwtTokenSecret'));
			if (decoded.exp <= Date.now()) {
				res.end('Access token has expired', 400);
			}

			req.user = decoded.iss;
			next();

		} catch (err) {
			next(httpError(err));
		}
	} else {
		next(httpError('You need to be Authenticated first!'));
	}
};

// Create endpoint /api/login for POST
exports.login = function(req, res, next) {
	passport.authenticate('local',
	function(err, user, info) {
		if (err) return next(httpError(err));
		if (!user) {
			return res.json(403, {
				message: "no user found"
			});
		}

		var expires = moment().add(7, 'days').valueOf();
		var token = jwt.encode({
			iss: user.id,
			exp: expires
		}, app.get('jwtTokenSecret'));

		delete user.password;

		res.json({
			token : token,
			expires: expires,
			user: user
		});

	})(req, res, next);
};

// Create endpoint /api/logot for POST
exports.logout = function(req, res) {
	req.logout(); 
	res.send(200); 
};