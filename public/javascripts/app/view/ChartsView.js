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
		var self = this;
		this.errorView = options.errorView;
		this.errorView.closeView();
		this.waitingView = options.waitingView;
		this.data = options.data;

		Backbone.pubSub.on('changeChart', function(index){
			self.changeChart(null,index);
		});

		this.render();
		this.renderOccupation();
	},

	changeChart: function(evt,index){
		var self = this;

		if(index === undefined)
			index = $('a[data-toggle="tab"]').index(evt.currentTarget);
		else 
			$('#charts-tabs li:eq('+index+') a').tab('show');

		var isEmpty;

		switch (index) {
    		case 0:
    			isEmpty = this.$el.find('#occupation-tab').is(':empty');
    			if(isEmpty)
    				self.renderOccupation();
    			break;
    		case 1:
    			isEmpty = this.$el.find('#heatmap-tab').is(':empty');
    			if(isEmpty)
    				self.renderHeatmap();
    			break;
    	}
	},

	renderOccupation: function(){
		var self = this;
		this.waitingView.render();

		this.currentData = new com.spantons.model.Occupation({idPlace:this.data.id});
		this.currentData.fetch({
			success: function(e){                      
				self.currentChart = new com.spantons.view.OccupationView({
					waitingView: self.waitingView,
					errorView : self.errorView,
					place: self.data,
					data: self.currentData
				});
				self.$el.find('#occupation-tab').html(self.currentChart.render().el);
				self.currentChart.renderComponents();
		    },
		    error: function(e){  
		     	self.waitingView.closeView();
		     	self.errorView.render(['Occurred an error retrieving the coordinates']);
		    }
		});
	},

	renderHeatmap: function(){
		var self = this;
		this.waitingView.render();
		
		this.currentData = new com.spantons.model.Heatmap({idPlace:this.data.id});
		this.currentData.fetch({
			success: function(e){       
				self.currentChart = new com.spantons.view.HeatmapView({
					waitingView: self.waitingView,
					errorView : self.errorView,
					place: self.data,
					data: self.currentData
				});               
				self.$el.find('#heatmap-tab').html(self.currentChart.render().el);
				self.currentChart.renderComponents();
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