var app = app || {};
app.collection = app.collection || {};

app.collection.Coordinates = Backbone.Collection.extend({
  
 	model: app.model.Coordinate,

  	initialize: function(options) {
    	this.id = options.idPlace;
  	},

  	url: function() {
    	return '/api/places/'+ this.id +'/coordinates';
  	},

});