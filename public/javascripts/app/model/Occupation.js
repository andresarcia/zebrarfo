var com = com || {};
com.spantons = com.spantons || {};
com.spantons.model = com.spantons.model || {};

com.spantons.model.Occupation = Backbone.Model.extend({

	initialize: function(options) {
    	this.id = options.idPlace;
  	},

  	urlRoot: function() {
    	return '/api/places/'+ this.id +'/occupation';
  	},

});