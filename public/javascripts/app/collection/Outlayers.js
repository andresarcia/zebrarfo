var app = app || {};
app.collection = app.collection || {};

app.collection.Outlayers = Backbone.Collection.extend({
  
 	model: app.model.Outlayer,

  	initialize: function(options) {
    	this.id = options.idPlace;
  	},

  	url: function() {
    	return '/api/places/'+ this.id +'/outlayers';
  	},

});