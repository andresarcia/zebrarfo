var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.OccupationView = Backbone.View.extend({

	template: Handlebars.compile($("#occupation-template").html()),

	initialize: function(options){
		var self = this;
		this.errorView = options.errorView;
		this.errorView.closeView();
		this.waitingView = options.waitingView;
	},

	renderChart: function(modelData){
		var data = [];
		var currentItem = modelData.attributes.occupation[0];
		var sum = 0;
		
		_.each(modelData.attributes.occupation, function(item){
			if(currentItem.frequency == item.frequency){
				if(item.power >= modelData.attributes.place.powerAvg)
					sum += 1;
			
			} else {
				data.push({ frequency:item.frequency, power:sum/modelData.attributes.place.numberPowerFrequency });
				currentItem = item;
				sum = 0;
			}
			sum += 1;
		});
		this.waitingView.closeView();

		var powerFrequenciesView = new com.spantons.view.PowerFrequenciesView({selector: '#chart_canvas_occupation'});
		powerFrequenciesView.render(data,modelData.attributes.place);		
	},

	render: function(){
		var html = this.template();
    	this.$el.html(html);	

		return this;
	},

});