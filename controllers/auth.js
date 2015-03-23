// Load required packages
var httpError = require('build-http-error');
var passport = require('passport');
var strategy = require('../config/passport');


exports.isAuth = function(req, res, next){ 
	if (!req.isAuthenticated()) 
		next(httpError('You need to be Authenticated first!'));
	else 
		next(); 
};

// Create endpoint /api/login for POST
exports.login = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) return next(httpError(err));
		if (!user) {
			return res.json(403, {
				message: "no user found"
			});
		}

		req.login(user, function(err) {
			if (err) return next(err);
			return res.json({
				message: 'user authenticated',
			});
		});

	})(req, res, next);
};

// Create endpoint /api/logot for POST
exports.logout = function(req, res) {
	req.logout(); 
	res.send(200); 
};