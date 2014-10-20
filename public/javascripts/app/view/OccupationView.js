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
					this.sum += 1;
			
			} else {
				data.push([item.frequency, sum]);
				console.log(this.sum);
				currentItem = item;
				this.sum = 0;
			}
			sum += 1;
		});

		console.log(sum);



		this.waitingView.closeView();
		var options = {		
			
		};

		// chart_canvas_occupation
	},

	render: function(){
		var html = this.template();
    	this.$el.html(html);	

		return this;
	},

});