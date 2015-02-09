var app = app || {};
app.model = app.model || {};

app.model.Outlayer = Backbone.Model.extend({

	parse: function(model){

		model.power = Number(model.power.toFixed(1));

		// model.updatedAt "2014-09-07 17:13:56"
		var friendly = moment(model.updatedAt, "YYYY MM DD HH:mm:ss").fromNow();
		model.friendlyDate = friendly;

		return model;
	}

});