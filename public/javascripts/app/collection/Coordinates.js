var com = com || {};
com.spantons = com.spantons || {};
com.spantons.collection = com.spantons.collection || {};

com.spantons.collection.Coordinates = Backbone.Collection.extend({
  
 	model: com.spantons.model.Coordinate,

  	initialize: function(options) {
    	this.id = options.idPlace;
  	},

  	url: function() {
    	return '/api/places/'+ this.id +'/coordinates';
  	},

});