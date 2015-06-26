var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


var userShema = new Schema({
    email: {
        type: String,
        required: true,
        index: { 
            unique: true 
        }
    },

    password: { 
        type: String, 
        required: true 
    },

    admin: {
        type: Boolean,
        default: false
    },

    isSubscribed: {
        type: Boolean,
    },

    createdAt: { 
        type: Date, 
        default: Date.now 
    },

    lastLogin: { 
        type: Date, 
        default: Date.now 
    },

});

module.exports = mongoose.model('User', userShema);