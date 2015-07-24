var app = app || {};
app.model = app.model || {};

app.model.Place = Backbone.Model.extend({

	urlRoot: '/api/places/',

	parse: function(model){

		if(typeof model.frequencies !== 'object')
			model.frequencies = JSON.parse(model.frequencies);

		// divided by 1000 for better visualization
		model.frequencies.min = Number(Math.ceil(model.frequencies.values[0]/1000));
		model.frequencies.max = Number(
			Math.ceil(model.frequencies.values[model.frequencies.values.length - 1]/1000));

		if(typeof model.power !== 'object')
			model.power = JSON.parse(model.power);

		model.power.avg = Number(model.power.avg.toFixed(1));
		model.power.max = Number(model.power.max.toFixed(1));
		model.power.min = Number(model.power.min.toFixed(1));
		model.power.sd = Number(model.power.sd.toFixed(1));

		if(typeof model.distance !== 'object')
			model.distance = JSON.parse(model.distance);

		model.distance.total = Number(model.distance.total.toFixed(2));

		// parse captures and build chart data
		model.charts = [];
		_.each(model.coordinates, function(item){
			if(typeof item.cap !== 'object')
				item.cap = JSON.parse(item.cap);

			var data = [];
			_.each(item.cap, function(cap, i){
				data.push({
					id: item.id, 
					power: cap,
					frequency: model.frequencies.values[i],
					lat: item.lat,
					lng: item.lng,
				});
			});
			model.charts = model.charts.concat(data);
		});
		model.charts = _.sortBy(model.charts, 'frequency');

		// model.updatedAt "2014-09-07 17:13:56"
		var friendly = moment(model.updatedAt).fromNow();
		model.friendlyDate = friendly;

		return model;
	}
});