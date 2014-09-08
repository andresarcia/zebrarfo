var com = com || {};
com.spantons = com.spantons || {};
com.spantons.model = com.spantons.model || {};

com.spantons.model.Place = Backbone.Model.extend({

	urlRoot: '/api/places/',

	parse: function(model){
		// model.updatedAt "2014-09-07 17:13:56"
		var friendly = moment(model.updatedAt, "YYYY MM DD HH:mm:ss").fromNow();
		model.friendlyDate = friendly;
		return model;
	}

});