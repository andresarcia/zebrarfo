var app = app || {};
app.model = app.model || {};

app.model.Capture = Backbone.Model.extend({

	initialize: function(options) {
		this.idPlace = options.idPlace;
		this.idCoord = options.idCoord;
	},

	urlRoot: function() {
		return '/api/places/'+ this.idPlace +'/coordinates/' + this.idCoord;
	},

});