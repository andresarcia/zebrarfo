// models/Place.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var FrequencyPotencySchema = new Schema({
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
        // required: true, 
    },

    longitude: {
        type: Number,
        min: -180,
        max: 180,
        // required: true, 
    },

    numberPotencyFrequency: {
      type: Number,
      default : 0,
    },

    data : [FrequencyPotencySchema],

    potencyMin : Number,

    potencyMax : Number,

    potencyAvg : Number,

    potencySD : Number,

    createdDate : String,

});

var PlaceSchema = new Schema({

	name: { 
    	type: String, 
    	required: true, 
    	index: true,
    },

    userId: {
    	type: Schema.ObjectId,
    	required: true, 
    	index: true,
    },

    numberCoordinates: {
      type: Number,
      default : 0,
    },

    potencyMin : Number,

    potencyMax : Number,

    potencyAvg : Number,

    sdPotencyAvg : Number,

    avgPotencySD : Number,

    coordinates: [CoordinateSchema]

});

PlaceSchema.plugin(findOrCreate);
module.exports = mongoose.model('Coordinate', CoordinateSchema);
module.exports = mongoose.model('Place', PlaceSchema);