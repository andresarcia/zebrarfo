var app = app || {};
app.model = app.model || {};

app.model.ChartsData = Backbone.Model.extend({

	initialize: function(options) {
		this.id = options.idPlace;
	},

	urlRoot: function() {
		return '/api/places/'+ this.id +'/charts';
	},

});