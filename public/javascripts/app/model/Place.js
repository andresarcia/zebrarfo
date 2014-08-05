var com = com || {};
com.spantons = com.spantons || {};
com.spantons.model = com.spantons.model || {};

com.spantons.model.Place = Backbone.Model.extend({
	
	urlRoot: '/api/upload/',

	defaults: {
    	name: null,
		numberCoordinates : 0,
		potencyMin : null,
		potencyMax : null,
		potencyAvg : null,
		sdPotencyAvg : null,
		placePotencySD_X : null,
		placePotencySD_M : null,
		avgPotencySD : null,
		coordinates : []
	}
});