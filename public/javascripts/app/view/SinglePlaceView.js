var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.SinglePlaceView = Backbone.View.extend({

	el: '#ws-containter',
	coodinates: null,
	coordinatesView: null,
	mapView: null,
	template: Handlebars.compile($("#single-place-template").html()),

	events: {
		'click .dropdown-trigger' : 'toggleDropdown',
		'click .see-on-map': 'seeOnMap'
	},

	defaults: {
		offset: 0,
		limit: 5,
	},
	
	initialize: function(options){
		var self = this;

		this.errorView = options.errorView;
		this.waitingView = options.waitingView;
		this.waitingView.render();

		if(options.placeId){
			this.coodinates = new com.spantons.collection.Coordinates({idPlace:options.placeId});
			this.coordinatesView = new com.spantons.view.CoordinatesView();

		} else
			throw 'Any place id';

		this.coodinates.fetch({
			data: { 
				offset: self.defaults.offset,
				limit: self.defaults.limit
			},

			success: function(e){          
				self.waitingView.closeView();
		        self.render();
		        self.mapView = new com.spantons.view.GoogleMapBasicMarkersView({
					idContainer: 'basic-markers-map'
				});
		        self.renderMap();
		        self.renderCoordinates();
		        self.renderPagination();
		     },
		     error: function(e){  
		     	self.waitingView.closeView();
		     	self.errorView.render(['Sorry, we cannot find that!']);
		     }
		});
	},

	seeOnMap: function(evt){
		if(appRouter.googleMapApi){
			var index = $(".see-on-map").index(evt.currentTarget);
			this.mapView.toggleMarker(index);
		} else
			bootbox.alert('Still loading map', function() {
			  // callback luego de cargar el mapa
			});
	},

	toggleDropdown: function(evt){
		$(evt.currentTarget).next().slideToggle();
	},

	renderMap: function(){
		var self = this;

		if(appRouter.googleMapApi)
			this.mapView.render(this.coodinates.models[0].attributes.coordinates);		
		else 
			Backbone.pubSub.on('event-loaded-google-map-api', function(){
				self.mapView.render(self.coodinates.models[0].attributes.coordinates);
			});
	},

	renderCoordinates: function(){
		this.$el.find('#coordinates').html(this.coordinatesView.render(this.coodinates.models[0].attributes.coordinates).el);
	},

	renderPagination:  function(index){
		var self = this;
		var container = this.$el.find('.pagination');
		var total = this.coodinates.models[0].attributes.total;
		
		new com.spantons.view.PaginationView({ 
			numberOfPages: Math.ceil(total/self.defaults.limit),
			currentPage: index,
			mainView: self
		});
	},

	fetchData: function(index){
		var self = this;

		this.waitingView.render();
		this.coodinates.fetch({
			data: { 
				offset: (index - 1) * self.defaults.limit,
				limit: self.defaults.limit				
			},

			success: function(e){                      
		        self.waitingView.closeView();
		        self.renderMap();
		        self.renderCoordinates();
		     },
		     error: function(e){  
		     	self.waitingView.closeView();
		     	self.errorView.render(['Occurred an error retrieving the place']);
		     }
		});
	},

	render: function(){
		var html = this.template(this.coodinates.models[0]);
    	this.$el.html(html);	

		return this;
	},

});