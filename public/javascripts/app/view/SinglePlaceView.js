var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.SinglePlaceView = Backbone.View.extend({

	el: '#ws-containter',
	coordinates: null,
	coordinatesView: null,
	mapView: null,
	template: Handlebars.compile($("#single-place-template").html()),

	events: {
		'click .delete-link-place': 'deletePlace',
		'click .delete-link-coordinate': 'deleteCoordinate',
		'click .dropdown-trigger' : 'toggleDropdown',
		'click .see-on-map': 'seeOnMap',
		'click #complete-map': 'launchCompleteMap',
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
			this.placeId = options.placeId;
			this.coordinates = new com.spantons.collection.Coordinates({idPlace:options.placeId});
			this.coordinatesView = new com.spantons.view.CoordinatesView();

		} else
			throw 'Any place id';

		this.coordinates.fetch({
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

	deletePlace: function(){
		var self = this;
		this.waitingView.render();
		var place = new com.spantons.model.Place({id:this.placeId});
		place.destroy({
			success: function(model, response) {
  				self.waitingView.closeView();
			},
			error: function(e){
				self.waitingView.closeView();
		     	self.errorView.render(['Sorry, something went wrong try again in a few seconds!']);
			}
		});
	},

	deleteCoordinate: function(evt){
		var self = this;
		this.waitingView.render();
		var index = this.$el.find('.delete-link-coordinate').index(evt.currentTarget);
		var idPlace = this.coordinates.models[0].attributes.coordinates[index].PlaceId;
		var idCoord = this.coordinates.models[0].attributes.coordinates[index].id;
		var coordinate = new com.spantons.model.Coordinate({id:idCoord});
		coordinate.urlRoot = '/api/places/'+idPlace+'/coordinates/';

		coordinate.destroy({
			success: function(model, response) {
  				self.waitingView.closeView();
			},
			error: function(e){
				self.waitingView.closeView();
		     	self.errorView.render(['Sorry, something went wrong try again in a few seconds!']);
			}
		});
	},


	seeOnMap: function(evt){
		if(window.appSettings.googleMapApi){
			var index = $(".see-on-map").index(evt.currentTarget);
			this.mapView.toggleMarker(index);
		} else
			bootbox.alert('Still loading map', function() {
			  // callback luego de cargar el mapa
			});
	},

	toggleDropdown: function(evt){
		var isHidden = $(evt.currentTarget).next().is(":hidden");
		var isEmpty = $(evt.currentTarget).parent().find('.chart_power_frequency').is(':empty');

		if(isHidden && isEmpty){
			var self = this;
			var index = this.$el.find('.dropdown-trigger').index(evt.currentTarget);
			var idPlace = this.coordinates.models[0].attributes.coordinates[index].PlaceId;
			var idCoord = this.coordinates.models[0].attributes.coordinates[index].id;

			var powerFrequenciesChart = new com.spantons.model.PowerFrequencies({
				idPlace: idPlace,
	    		idCoord: idCoord
			});

			var powerFrequenciesView = new com.spantons.view.PowerFrequenciesView({selector: '#coord-id-'+idCoord});
			var options = {
				yAxis: {
		            plotLines:[{
				        value: self.coordinates.models[0].attributes.coordinates[index].powerAvg,
				        color: '#ff0000',
				        width:1,
				        zIndex:4,
				        label:{text:'Average power'}
				    }]
				}
			};
			this.$el.find('.chart_tooltip').css('top','360px');
			powerFrequenciesChart.fetch({
				success: function(e){                      
			       	powerFrequenciesView.render(powerFrequenciesChart.attributes,options);
			    },
			    error: function(e){  
			     	self.waitingView.closeView();
			     	self.errorView.render(['Occurred an error retrieving the place']);
			    }
			});
		}

		$(evt.currentTarget).next().slideToggle();
	},

	renderMap: function(){
		var self = this;

		if(window.appSettings.googleMapApi)
			this.mapView.render(this.coordinates.models[0].attributes.coordinates);		
		else 
			Backbone.pubSub.on('event-loaded-google-map-api', function(){
				self.mapView.render(self.coordinates.models[0].attributes.coordinates);
			});
	},

	renderCoordinates: function(){
		this.$el.find('#coordinates').html(this.coordinatesView.render(this.coordinates.models[0].attributes.coordinates).el);
	},

	renderPagination:  function(index){
		var self = this;
		var container = this.$el.find('.pagination');
		var total = this.coordinates.models[0].attributes.total;
		
		new com.spantons.view.PaginationView({ 
			numberOfPages: Math.ceil(total/self.defaults.limit),
			currentPage: index,
			mainView: self
		});
	},

	fetchData: function(index){
		var self = this;

		this.waitingView.render();
		this.coordinates.fetch({
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
		var html = this.template(this.coordinates.models[0]);
    	this.$el.html(html);	
    
		return this;
	},

	launchCompleteMap: function(){
		window.location.hash = '#places/'+this.coordinates.id+'/coordinates/maps';
	}

});