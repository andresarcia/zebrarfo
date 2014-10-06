var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.OccupationView = Backbone.View.extend({

	el: '#ws-containter',
	// template: Handlebars.compile($("#occupation-template").html()),

	initialize: function(options){
		var self = this;
		this.errorView = options.errorView;
		this.errorView.closeView();
		this.waitingView = options.waitingView;
		this.waitingView.render();

		if(options.placeId)
			this.occupation = new com.spantons.model.Occupation({idPlace:options.placeId});
	
		this.occupation.fetch({
			success: function(e){                      
				self.waitingView.closeView();
				self.processData(self.occupation.attributes.place.potencyAvg);
				self.render();
		    },
		    error: function(e){  
		     	self.waitingView.closeView();
		     	self.errorView.render(['Occurred an error retrieving the coordinates']);
		    }
		});
	},

	processData: function(threshold){
		threshold = Math.floor(threshold);
		var processData = [];		
		var currentData = this.occupation.attributes.occupation[0];
		var sum = 0;
		
		// _.each(this.occupation.attributes.occupation, function(data){
			// if(currentData.frequency == data.frequency){
			// 	if(data.potency > -70);
			// 		sum += 1;
				
			// } else {
			// 	console.log(sum);
			// 	processData.push({
			// 		frequency: currentData.frequency,
			// 		total: sum / 111
			// 	});
			// 	currentData = data;
			// 	sum = 0;
			// }
		// });
		// console.log(this.occupation);
		// console.log(processData);
	},

	render: function(){
		// var html = this.template();
  //   	this.$el.html(html);	

		// return this;
	},

});