var mongoose = require('mongoose');
var Schema = mongoose.Schema;


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

    is_subscribed: {
        type: Boolean,
    },

    is_active: {
        type: Boolean,
        required: true,
        default: true,
    },

    role: { 
        type: String, 
        required: true,
        default: "contributor",
    },

    created_at: { 
        type: Date, 
        default: Date.now 
    },

    last_login: { 
        type: Date, 
        default: Date.now 
    },

    /* - ROLES ---------------------------------
        - superadmin
        - admin
        - editor: somebody who can write and manage their own places, unlimited (pay).
        - contributor: somebody who can write and manage their own places but limited.
        - subscriber: somebody who can only view shared places
    --------------------------------------------
    */

});

module.exports = mongoose.model('User', userShema);