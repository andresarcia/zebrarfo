// Load required packages
var app = require('../app');
var db = require('../models');
var httpError = require('build-http-error');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');
var moment = require('moment');

// == MONGO ===================================================================
var User = require('../models_mongo/user.js');
// ============================================================================

// Create endpoint /api/users for POST
exports.create = function(req, res, next) {
  // if there is not email or password, return 400 error 
  if(!req.body.email || !req.body.password) {
    return next(httpError(400, 'Parameters email or password are missing'));
  }

  bcrypt.genSalt(5, function(err, salt) {
    if (err){
      console.error(err);
      return next(500, 'There has been a server error. Please try again in a few minutes');
    }

    bcrypt.hash(req.body.password, salt, null, function(err, hash) {
      if (err){
        console.error(err);
        return next(500, 'There has been a server error. Please try again in a few minutes');
      }

      // == MONGO ===================================================================
      // var user = new User({
      //   email: req.body.email,
      //   password: hash,
      //   is_subscribed: req.body.subscribed,
      // });

      // user.save(function(err){
      //     if(err){
      //       console.error(err);
      //       return next(httpError(err));
      //     }

      //     user = user.toJSON();
      //     var expires = moment().add(7, 'days').valueOf();
      //     delete user.password;

      //     var token = jwt.encode({
      //       iss: user._id,
      //       exp: expires
      //     }, app.get('jwtTokenSecret'));

      //     res.json({
      //       token : token,
      //       expires: expires,
      //       user: user
      //     });
      // });
      // ============================================================================

      db.User.create({
        email: req.body.email,
        password: password,
        is_subscribed: req.body.subscribed,
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