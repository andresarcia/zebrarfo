// Load required modules
// utils module to get the hash password function
var utils = require('./utils');
// user mongo model
var User = require('../models_mongo/user.js');
// get all models of sequelize for mysql
var db = require('../models');
// places modules for save new places for new users
var places = require('../routes/places');


// Create endpoint /api/users for POST
exports.create = function(req, res) {
    // if there is not email or password, return 400 error 
    if(!req.body.email || !req.body.password) {
        console.error("400, Parameters email or password are missing");
        return res.json(400, { message: "Parameters email or password are missing" });
    }

    // hash password
    utils.hash_password(req.body.password, function(err, hash){
        if(err){
            console.error("ERROR: " + err);
            return res.json(500, { 
                message: "There has been a server error. Please try again in a few minutes" 
            });
        }

        // create users for mongo
        // create_mongo_user(req.body.email, hash, req.body.subscribed, function(err, user){
        //     if(err){
        //         console.error("ERROR: " + err);
        //         return res.json(500, { 
        //             message: "There has been a server error. Please try again in a few minutes" 
        //         });
        //     }

            // var jwt = utils.generate_jwt({iss: user._id, role: user.role});
            // res.json({
            //   token : jwt,
            //   user: {email: user.email}
            // });
        // }); /* end create_mongo_user */

        // create users for MySQL
        create_mysql_user(req.body.email, hash, req.body.subscribed, function(err, user){
            if(err){
                console.error("ERROR: " + err);
                return res.json(500, { 
                    message: "There has been a server error. Please try again in a few minutes" 
                });
            }

            var jwt = utils.generate_jwt({iss: user.id, role: user.role});
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
                    res.json({
                        token : jwt,
                        user: {email: user.email}
                    });
                }); /* end save place */

            })
            .catch(function(err) {
                console.error("ERROR: " + err);
                return res.json(500, { 
                    message: "There has been a server error. Please try again in a few minutes" 
                });
            }); /* end find shared place */
            
        }); /* end create_mysql_user */

    }); /* end hash_password */
};


function create_mongo_user(username, password, is_subscribed, callback){
    // create user from model
    var user = new User({
        email: username,
        password: password,
        is_subscribed: is_subscribed,
    });

    // save the user model into DB
    user.save(function(err){
        if(err){
            return callback(err);
        }

        return callback(null, user);
    });
}


function create_mysql_user(username, password, is_subscribed, callback){
    // create and save model
    db.User.create({
        email: username,
        password: password,
        is_subscribed: is_subscribed,
    })
    .then(function(user) {
        user = user.toJSON();
        return callback(null, user);
    })
    .catch(function(err){
        return callback(err);
    });
}