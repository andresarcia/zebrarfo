// Load required packages
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var db = require('../models');

/* LOCAL -------------------------------------------------------------*/
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
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