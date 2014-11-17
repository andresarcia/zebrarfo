var com = com || {};
com.spantons = com.spantons || {};
com.spantons.model = com.spantons.model || {};

com.spantons.model.Place = Backbone.Model.extend({

	urlRoot: '/api/places/',

	parse: function(model){

		model.frequencyMin = Number(Math.ceil(model.frequencyMin/1000));
		model.frequencyMax = Number(Math.ceil(model.frequencyMax/1000));

		model.powerAvg = Number(model.powerAvg.toFixed(1));
		model.powerMax = Number(model.powerMax.toFixed(1));
		model.powerMin = Number(model.powerMin.toFixed(1));
		model.sdPowerAvg = Number(model.sdPowerAvg.toFixed(1));
		model.avgPowerSD = Number(model.avgPowerSD.toFixed(1));

		// model.updatedAt "2014-09-07 17:13:56"
		var friendly = moment(model.updatedAt, "YYYY MM DD HH:mm:ss").fromNow();
		model.friendlyDate = friendly;

		return model;
	}
});