var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.ChartsView = Backbone.View.extend({

	el: '#ws-containter',
	template: Handlebars.compile($("#charts-template").html()),
	currentData: null,
	currentChart: null,

	events: {
		'click a[data-toggle="tab"]': 'changeChart'
	},

	initialize: function(options){
		this.errorView = options.errorView;
		this.errorView.closeView();
		this.waitingView = options.waitingView;

		if(options.placeId)
			this.placeId = options.placeId;
		else
			throw 'Any place id';

		this.render();
		this.renderOccupation();
	},

	changeChart: function(evt){
		var self = this;
		var index = $('a[data-toggle="tab"]').index(evt.currentTarget);
	},

	renderOccupation: function(){
		var self = this;
		this.waitingView.render();
		this.currentChart = new com.spantons.view.OccupationView({
			waitingView: self.waitingView,
			errorView : self.errorView,
		});

		this.currentData = new com.spantons.model.Occupation({idPlace:this.placeId});
		this.currentData.fetch({
			success: function(e){                      
				self.$el.find('#occupation-tab').html(self.currentChart.render().el);
				self.currentChart.renderChart(self.currentData);
		    },
		    error: function(e){  
		     	self.waitingView.closeView();
		     	self.errorView.render(['Occurred an error retrieving the coordinates']);
		    }
		});
	},

	render: function(){
		var html = this.template();
    	this.$el.html(html);	

		return this;
	},

});