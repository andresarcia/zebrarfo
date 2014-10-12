var com = com || {};
com.spantons = com.spantons || {};
com.spantons.model = com.spantons.model || {};

com.spantons.model.PowerFrequencies = Backbone.Model.extend({

	initialize: function(options) {
    	this.idPlace = options.idPlace;
    	this.idCoord = options.idCoord;
  	},

  	urlRoot: function() {
    	return '/api/places/'+ this.idPlace +'/coordinates/' + this.idCoord;
  	},

});