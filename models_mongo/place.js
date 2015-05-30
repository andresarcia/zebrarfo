var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var Schema = mongoose.Schema;

var placeShema = new Schema({
	name: {
		type: String,
		required: true, 
	},
	frequencies: {
		values: [{
			type: Number,
			min: 0
		}],
		bands: [{
			id: {
				type: Number,
				required: true,
			},
			text: {
				type: String,
				required: true, 
			},
			from: {
				type: Number,
				required: true,
			},
			to: {
				type: Number,
				required: true,
			},
		}],
		width: [{
			id: {
				type: Number,
				required: true,
			},
			text: {
				type: String,
				required: true, 
			},
		}],
	},
	power: {
		min: {
			type: Number,
			required: true,
		},
		max: {
			type: Number,
			required: true,
		},
		avg: {
			type: Number,
			required: true,
		},
		sd: {
			type: Number,
			required: true,
			min: 0
		}
	},
	distance: {
		total: {
			type: Number,
			required: true,
			min: 0
		},
		avg: {
			type: Number,
			required: true,
			min: 0
		},
		max: {
			type: Number,
			required: true,
			min: 0
		},
		min: {
			type: Number,
			required: true,
			min: 0
		}
	},
	coordinates: {
		index: true,
		type: [{
			lat: {
				type: Number,
				required: true,
				min: -90,
				max: 90
			},
			lng: {
				type: Number,
				required: true,
				min: -180,
				max: 180
			},
			cap: [Number],
			date: String,
			power: {
				min: {
					type: Number,
					required: true,
				},
				max: {
					type: Number,
					required: true,
				},
				avg: {
					type: Number,
					required: true,
				},
				sd: {
					type: Number,
					required: true,
					min: 0
				}
			},
			createdAt: { 
				type: Date, 
				default: Date.now 
			},
			updatedAt: { 
				type: Date,
				default: Date.now 
			},
			visible: { 
				type: Boolean,
				required: true,
				default: true 
			},
		}]
	},
	outliers: [{
		power: {
			type: Number,
			required: true,
		},
		frequency: {
			type: Number,
			required: true,
			min: 0
		}
	}],
	createdAt: { 
		type: Date, 
		default: Date.now 
	},
	updatedAt: { 
		type: Date, 
		default: Date.now 
	},
	visible: { 
		type: Boolean,
		required: true,
		default: true 
	},
});

placeShema.plugin(findOrCreate);
module.exports = mongoose.model('Place', placeShema);