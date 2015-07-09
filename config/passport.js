// Load required packages
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var db = require('../models');

// == MONGO ===================================================================
// var User = require('../models_mongo/user.js');
// ============================================================================

/* LOCAL -------------------------------------------------------------*/
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {

    // // == MONGO ===================================================================
    // // check in mongo if a user with username exists or not
    // User.findOne({ email: email }, function(err, user){
    //   // In case of any error, return using the done method
    //   if (err) {
    //     console.error(err);
    //     return done(err); 
    //   }
    //   // Username does not exist
    //   if (!user) { 
    //     console.error("Incorrect email.");
    //     return done(null, false, { message: 'Incorrect email.' }); 
    //   }

    //   // check the password
    //   bcrypt.compare(password, user.toJSON().password, function(err, isMatch) {
    //     if (err) {
    //       console.error(err);
    //       return done(err); 
    //     }

    //     // Password did not match
    //     if (!isMatch) { 
    //       console.error("Incorrect password.");
    //       return done(null, false, { message: 'Incorrect password.' }); 
    //     }

    //     // Success
    //     return done(null, user.toJSON());
    //   });

    // });
    // ============================================================================

    db.User.findOne({
      where: {
        email: email
      },
    }).then(function(user){
      // No user found with that email
      if (!user) { return done(null, false, { message: 'Incorrect email.' }); }

      // Make sure the password is correct
      bcrypt.compare(password, user.toJSON().password, function(err, isMatch) {
        if (err) return done(err);

        // Password did not match
        if (!isMatch) { return done(null, false, { message: 'Incorrect password.' }); }

        // Success
        return done(null, user.toJSON());
      });

    }).catch(function(err){
      if (err) { return done(err); }
    });

  }
));