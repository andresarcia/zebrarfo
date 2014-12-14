var app = app || {};
app.view = app.view || {};

app.view.SinglePlaceView = Backbone.View.extend({

	el: '#ws-containter',
	coordinates: null,
	coordinatesView: null,
	mapView: null,
	template: Handlebars.compile($("#single-place-template").html()),

	events: {
		'change #allocation-channel':'changeAllocationChannel',
		'click .delete-link-place': 'deletePlace',
		'click .delete-link-coordinate': 'deleteCoordinate',
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
		this.data = options.data;
		this.coordinates = new app.collection.Coordinates({idPlace:this.data.id});
		this.coordinatesView = new app.view.CoordinatesView();

		this.coordinates.fetch({
			data: { 
				offset: self.defaults.offset,
				limit: self.defaults.limit
			},

			success: function(e){          
				self.waitingView.closeView();
		        self.render();
		        self.mapView = new app.view.GoogleMapBasicMarkersView({
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
		var deleteFunction = function(){
			self.waitingView.render();
			var place = new app.model.Place({id:self.data.id});
			place.destroy({
				success: function(model, response) {
	  				self.waitingView.closeView();
	  				window.location.hash = '#places';
				},
				error: function(e){
					self.waitingView.closeView();
			     	self.errorView.render(['Sorry, something went wrong try again in a few seconds!']);
				}
			});
		};

		bootbox.dialog({
	  		message: '<h4>Are you sure to delete <b>' + this.data.attributes.name + '</b>?</h4>',
	  		buttons: {
	  			main: {
	      			label: "Cancel",
	    		},
	    		danger: {
	      			label: "Delete!",
	      			className: "btn-danger",
	      			callback: deleteFunction
	    		},
	  		}
		});
	},

	deleteCoordinate: function(evt){
		var self = this;
		this.waitingView.render();
		var index = this.$el.find('.delete-link-coordinate').index(evt.currentTarget);
		var idPlace = this.coordinates.models[0].attributes.coordinates[index].PlaceId;
		var idCoord = this.coordinates.models[0].attributes.coordinates[index].id;
		var coordinate = new app.model.Coordinate({id:idCoord});
		coordinate.urlRoot = '/api/places/'+idPlace+'/coordinates/';

		coordinate.destroy({
			success: function(model, response) {
				self.coordinates.models[0].attributes.coordinates.splice(index, 1);
  				self.data.attributes.numberCoordinates -= 1;

  				self.waitingView.closeView();
  				self.render();
  				self.renderMap();
		        self.renderCoordinates();
		        self.renderPagination();
			},
			error: function(e){
				self.waitingView.closeView();
		     	self.errorView.render(['Sorry, something went wrong try again in a few seconds!']);
			}
		});
	},

	changeAllocationChannel: function(){
		window.appSettings.currentChannelAllocation = this.$el.find("#allocation-channel").select2("val");
		this.renderCoordinates();
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

			var powerFrequenciesChart = new app.model.PowerFrequencies({
				idPlace: idPlace,
	    		idCoord: idCoord
			});

			var powerFrequenciesView = new app.view.PowerFrequenciesView({
				selector: '#coord-id-'+idCoord,
				tooltipTop: 310,
			});
			var options = {
				yAxis: {
		            plotLines:[{
				        value: self.coordinates.models[0].attributes.coordinates[index].powerAvg,
				        color: '#ff0000',
				        width:1,
				        zIndex:4,
				        label:{text:'Average power'}
				    }]
				},
				tooltip: {
					positioner: {
						x: 80, 
						y: 0 
					}
				},
			};
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
		
		new app.view.PaginationView({ 
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
		var html = this.template(this.data);
    	this.$el.html(html);	

    	this.$el.find("#allocation-channel").select2();
    	this.$el.find("#allocation-channel").select2("val", window.appSettings.currentChannelAllocation);
    
		return this;
	}

});