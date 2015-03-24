// Load required packages
var app = require('../app');
var db = require('../models');
var httpError = require('build-http-error');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');
var moment = require('moment');

// Create endpoint /api/users for POST
exports.create = function(req, res, next) {
  if(!req.body.email || !req.body.password)
    return next(httpError(404));

  bcrypt.genSalt(5, function(err, salt) {
    if (err) return next(httpError(err));

    bcrypt.hash(req.body.password, salt, null, function(err, hash) {
      if (err) return next(httpError(err));
      var password = hash;
      
      db.User.create({
        email: req.body.email,
        password: password
      })
      .then(function(user) {
        user = user.toJSON();
        var expires = moment().add(7, 'days').valueOf();
        delete user.password;

        var token = jwt.encode({
          iss: user.id,
          exp: expires
        }, app.get('jwtTokenSecret'));

        res.json({
          token : token,
          expires: expires,
          user: user
        });
      })
      .catch(function(err){
        next(httpError(err));
      });
    });
  });
};