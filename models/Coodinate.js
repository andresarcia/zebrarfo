// models/Coordinate.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var FrequencyPotency = new Schema({
    frequency : {
        type: Number,
        required: true, 
    },
    potency : {
        type: Number,
        required: true, 
    },
});

var CoordinateSchema = new Schema({

    latitude: {
        type: Number,
        min: -90,
        max: 90,
        required: true, 
    },

	longitude: {
        type: Number,
        min: -180,
        max: 180,
        required: true, 
    },

    placeId: {
    	type: Schema.ObjectId,
    	required: true, 
    	index: true,
    },

    numberPotencyFrequency: {
      type: Number,
      default : 0,
    },

    data : [FrequencyPotency],

    potencyMin : Number,

    potencyMax : Number,

    potencyAvg : Number,

    potencySd : Number,

    createdDate : String,

});

CoordinateSchema.plugin(findOrCreate);
module.exports = mongoose.model('Coordinate', CoordinateSchema);