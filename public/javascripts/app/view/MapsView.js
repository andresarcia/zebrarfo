var app = app || {};
app.view = app.view || {};

app.view.MapsView = Backbone.View.extend({

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

		this.data = options.data;

		if(!window.appRouter.currentData.innerData.maps)
			window.appRouter.currentData.innerData.maps = {};

		this.render();
		this.renderCoordinatesMap();
	},

	changeMap: function(evt){
		var self = this;
		var index = $('a[data-toggle="tab"]').index(evt.currentTarget);

		var isEmpty;

		switch (index) {
    		case 0:
    			isEmpty = this.$el.find('#coordinates-tab').is(':empty');
    			if(isEmpty)
    				self.renderCoordinatesMap();
    			break;
    	}
	},

	renderCoordinatesMap: function(){
		this.waitingView.render();

		if(window.appRouter.currentData.innerData.maps.coordinates) {
			this.currentMap = new app.view.GoogleMapCompleteView({
				waitingView: this.waitingView,
				errorView : this.errorView,
				placeId:this.data.id,
				data: window.appRouter.currentData.innerData.maps.coordinates
			});

			this.$el.find('#coordinates-tab').html(this.currentMap.render().el);
			
			this.currentMap.renderMap();
			
		} else {
			var self = this;

			this.currentData = new app.collection.Coordinates({idPlace:this.data.id});
			this.currentData.fetch({
				success: function(e){            
					self.currentMap = new app.view.GoogleMapCompleteView({
						waitingView: self.waitingView,
						errorView : self.errorView,
						placeId:self.data.id,
						data: self.currentData
					});

					window.appRouter.currentData.innerData.maps.coordinates = self.currentData;
					self.$el.find('#coordinates-tab').html(self.currentMap.render().el);
					self.currentMap.renderMap();
			    },
			    error: function(e){  
			     	self.waitingView.closeView();
			     	self.errorView.render(['Occurred an error retrieving the coordinates']);
			    }
			});
		}
	},

	render: function(){
		var html = this.template(this.data);
    	this.$el.html(html);	

		return this;
	},

});