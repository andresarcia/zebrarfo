// Load required packages
var db = require('../models');
var httpError = require('build-http-error');
var bcrypt = require('bcrypt-nodejs');

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
      .then(function(task) {
        res.status(200).send({ message: 'new user added to the community!' });
      })
      .catch(function(err){
        next(httpError(err));
      });
    });
  });
};

// Create endpoint /api/users for GET
exports.getUsers = function(req, res) {
  User.find(function(err, users) {
    if (err)
      res.send(err);

    res.json(users);
  });
};