var app = app || {};
app.collection = app.collection || {};

app.collection.Outliers = Backbone.Collection.extend({
  
 	model: app.model.Outlier,

  	initialize: function(options) {
    	this.id = options.idPlace;
  	},

  	url: function() {
    	return '/api/places/'+ this.id +'/outliers';
  	},

});