// Load required modules
// module for parse peticion and get the jwt
var url = require('url');
// utils module for JWT
var utils = require('./utils');
// modules for authentication with the strategy
var passport = require('passport');
var strategy = require('../config/passport');


exports.isAuth = function(req, res, next){ 
	// get the JWT from the request
	var parsed_url = url.parse(req.url, true);
	var token = (req.body && req.body.access_token) || parsed_url.query.access_token || req.headers["x-access-token"];

	// if JWT
	if(!token){
		console.error("400, You need to be Authenticated first!");
		return res.json(400, { message: "You need to be Authenticated first!" });
	}

	// decoded the JWT
	var decoded = utils.decode_jwt(token);

	// check the expiration daet
	if (decoded.exp <= Date.now()) {
		console.error("400, Access token has expired");
		return res.json(400, { message: "Access token has expired" });
	}

	// save the user in the request an continue with the request
	req.user = decoded;
	next();
};

// Create endpoint /api/login for POST
exports.login = function(req, res, next) {
	// do the LocalStrategy login register in config/passport.js
	passport.authenticate('local',
	function(err, user, info) {
		// In case of any error return the error (the message is print on config/passport.js)
		if(err){
			console.error("ERROR: " + err);
			return res.json(500, {
				message: "There has been a server error. Please try again in a few minutes" 
			});
		}

		// if not user found
		if (!user) {
			console.error("403, No user found");
			return res.json(403, { message: "No user found" });
		}

		// == MONGO ===================================================================
		// var jwt = utils.generate_jwt({iss: user._id, role: user.role});
		// ============================================================================
		var jwt = utils.generate_jwt({iss: user.id, role: user.role});

		// set the header for not compress
		res.set('x-no-compression', 'true');

		// return the JWT to the client
		res.json({
			token : jwt,
			user: {email: user.email}
		});

	})(req, res, next);
};

// TODO: the jwt should be disable
// Create endpoint /api/logot for POST
exports.logout = function(req, res) {
	res.send(200); 
};