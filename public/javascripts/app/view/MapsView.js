var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.MapsView = Backbone.View.extend({

	el: '#ws-containter',
	template: Handlebars.compile($("#maps-template").html()),
	currentData: null,
	currentMap: null,

	events: {
		'click a[data-toggle="tab"]': 'changeMap'
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
		this.renderCoordinatesMap();
	},

	changeMap: function(evt){
		var self = this;
		var index = $('a[data-toggle="tab"]').index(evt.currentTarget);

		switch (index) {
    		case 0:
    			self.renderCoordinatesMap();
    			break;
    		case 1:
    			self.renderHeatmap();
    			break;
    	}
	},

	renderCoordinatesMap: function(){
		var self = this;
		this.waitingView.render();
		this.currentMap = new com.spantons.view.GoogleMapCompleteView({
			waitingView: self.waitingView,
			errorView : self.errorView,
		});

		this.currentData = new com.spantons.collection.Coordinates({idPlace:this.placeId});
		this.currentData.fetch({
			success: function(e){                      
				self.$el.find('#coordinates-tab').html(self.currentMap.render().el);
				self.currentMap.renderMap(self.currentData);
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
		this.currentMap = new com.spantons.view.HeatmapView({
			waitingView: self.waitingView,
			errorView : self.errorView
		});

		this.currentData = new com.spantons.model.Heatmap({idPlace:this.placeId});
		this.currentData.fetch({
			success: function(e){                      
				self.$el.find('#heatmap-tab').html(self.currentMap.render().el);
				self.currentMap.renderMap(self.currentData);
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