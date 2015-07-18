// Load required modules
// module for generate a salt and hash password
var bcrypt = require('bcrypt-nodejs');
// module for generate JWT
var jwt = require('jwt-simple');
// module for generates expirations dates 
var moment = require('moment');
// _ module to join jwt payload with expiration date
var _ = require('underscore');
// app variable for get token secret needed in jwt creation
var app = require('../app');


exports.hash_password = function(password, callback){
    _generate_salt(function(err, salt){
        if(err){
            return callback(err);
        }

        bcrypt.hash(password, salt, null, function(err, hash) {
            if(err){
                return callback(err);
            }
            return callback(null, hash);
        });
    });
};


function _generate_salt(callback){
    bcrypt.genSalt(5, function(err, salt) {
        if (err){
            return callback(err);
        }
        return callback(null, salt);
    });
}


// TODO: set params for expiration date
exports.generate_jwt = function(payload){
    // expiration date of 7 days
    var expires = moment().add(7, 'days').valueOf();
    // expiration date of 1 minute for testing
    // var expires = moment().add(1, 'm').valueOf();

    var newPayload = _.extend(payload, {exp: expires});
    return jwt.encode(newPayload, app.get('jwtTokenSecret'));
};


exports.decode_jwt = function(token){
    return jwt.decode(token, app.get('jwtTokenSecret'));
};
