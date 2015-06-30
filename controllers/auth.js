// Load required packages
var app = require('../app');
var httpError = require('build-http-error');
var url = require('url');
var passport = require('passport');
var strategy = require('../config/passport');
var jwt = require('jwt-simple');
var moment = require('moment');


exports.isAuth = function(req, res, next){ 
	// get the JWT from the request
	var parsed_url = url.parse(req.url, true);
	var token = (req.body && req.body.access_token) || parsed_url.query.access_token || req.headers["x-access-token"];

	// if JWT
	if(token) {
		try {
			// decoded the JWT
			var decoded = jwt.decode(token, app.get('jwtTokenSecret'));

			// check the expiration daet
			if (decoded.exp <= Date.now()) {
				res.json(400, { message: "Access token has expired" });
			}

			// save the user in the request an continue with the request
			req.user = decoded;
			next();

		} catch (err) {
			console.error(err);
			res.json(500, { 
				message: 'There has been a server error. Please try again in a few minutes' 
			});
		}
	// if not JWT found
	} else {
		res.json(400, { message: "You need to be Authenticated first!" });
	}
};

// Create endpoint /api/login for POST
exports.login = function(req, res, next) {
	// do the LocalStrategy login register in config/passport.js
	passport.authenticate('local',
	function(err, user, info) {
		// In case of any error return the error (the message is print on config/passport.js)
		if (err){
			return next(httpError(err));

		// if not user found
		} if (!user) {
			console.error("No user found");
			return res.json(403, { message: "No user found" });
		}

		// add the expire time for the JWT
		var expires = moment().add(7, 'days').valueOf();
		// var expires = moment().add(1, 'm').valueOf();

		// create the JWT
		var token = jwt.encode({
			// == MONGO ===================================================================
			// iss: user._id,
			// ============================================================================
			iss: user.id,
			// ============================================================================
			role: user.role,
			exp: expires
		}, app.get('jwtTokenSecret'));

		// delete the password from the model
		delete user.password;

		// set the header for not compress
		res.set('x-no-compression', 'true');

		// return the JWT to the client
		res.json({
			token : token,
			expires: expires,
			user: user
		});

	})(req, res, next);
};

// Create endpoint /api/logot for POST
exports.logout = function(req, res) {
	// in this point the jwt should be disable
	res.send(200); 
};