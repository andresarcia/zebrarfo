// Load required packages
var app = require('../app');
var db = require('../models');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');
var moment = require('moment');
var places = require('../routes/places');

// == MONGO ===================================================================
// var User = require('../models_mongo/user.js');
// ============================================================================

// Create endpoint /api/users for POST
exports.create = function(req, res) {
  // if there is not email or password, return 400 error 
  if(!req.body.email || !req.body.password) {
    console.error("400, Parameters email or password are missing");
    return res.json(400, { message: "Parameters email or password are missing" });
  }

  bcrypt.genSalt(5, function(err, salt) {
    if (err){
      console.error("ERROR: " + err);
      return res.json(500, { 
        message: "There has been a server error. Please try again in a few minutes" 
      });
    }

    bcrypt.hash(req.body.password, salt, null, function(err, hash) {
      if (err){
        console.error("ERROR: " + err);
        return res.json(500, { 
          message: "There has been a server error. Please try again in a few minutes" 
        });
      }

      // == MONGO ===================================================================
      // var user = new User({
      //   email: req.body.email,
      //   password: hash,
      //   is_subscribed: req.body.subscribed,
      // });

      // user.save(function(err){
          // if(err){
            // console.error("ERROR: " + err);
            // return res.json(500, { 
            //   message: "There has been a server error. Please try again in a few minutes" 
            // });
          // }

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
        password: hash,
        is_subscribed: req.body.subscribed,
      })
      .then(function(user) {
        user = user.toJSON();
        var expires = moment().add(7, 'days').valueOf();
        delete user.password;

        var token = jwt.encode({
          iss: user.id,
          exp: expires,
          role: user.role,
        }, app.get('jwtTokenSecret'));

        // include new data
        db.SharedPlace.find({
          where: {
            id: 1,
          },
        }).then(function(shared){
          if(!shared){
            console.error("404, New data not found");
            return res.json(404, { message: "New data not found" });
          }

          var data = JSON.parse(shared.dataValues.place);

          places.savePlace(user.id, data, function(err, n){
            // respose the new user to the client
            res.json({
              token : token,
              expires: expires,
              user: user
            });
          });

        }).catch(function(err) {
          console.error("ERROR: " + err);
          return res.json(500, { 
            message: "There has been a server error. Please try again in a few minutes" 
          });
        });


      })
      .catch(function(err){
        console.error("ERROR: " + err);
        return res.json(500, { 
          message: "There has been a server error. Please try again in a few minutes" 
        });
      });

    });
  });
};