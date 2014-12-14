var app = app || {};
app.view = app.view || {};

app.view.GoogleMapCompleteView = Backbone.View.extend({

	template: Handlebars.compile($("#coordinates-map-template").html()),
	lastIndex: null,
	lastIdCoordinate: null,
	currentPowerFrequencies: {},
	events: {
		'click .delete-link-coordinate': 'deleteCoordinate',
		'change #allocation-channel':'changeAllocationChannel',
	},

	initialize: function(options){
		var self = this;

		if(options.placeId)
			this.placeId = options.placeId;
		else
			throw 'Any place id';

		this.coordinates = options.data;

		this.errorView = options.errorView;
		this.errorView.closeView();
		this.waitingView = options.waitingView;
		self.waitingView.closeView();

		this.powerFrequenciesView = new app.view.PowerFrequenciesView({
			selector: '#complete-map-info',
			tooltipTop: 260
		});
	},

	markerClick: function(index,idCoord){
		var self = this;

		this.lastIdCoordinate = idCoord;

		this.toggleMarker(index);
		var template = Handlebars.compile($("#complete-map-coordinate-template").html());
		var html = template(this.coordinates.models[0].attributes.coordinates[index]);
		this.$el.find('#select-complete-map-info').html(html);
		this.$el.find("#allocation-channel").select2();
		this.$el.find("#allocation-channel").select2("val", window.appSettings.currentChannelAllocation);

		this.currentPowerFrequencies.data = new app.model.PowerFrequencies({
			idPlace: self.placeId,
    		idCoord: idCoord
		});

		this.currentPowerFrequencies.options = {
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

		this.waitingView.render();
		this.currentPowerFrequencies.data.fetch({
			success: function(e){         
				self.waitingView.closeView();
		       	self.renderPowerFrequencies();
		    },
		    error: function(e){  
		     	self.waitingView.closeView();
		     	self.errorView.render(['Occurred an error retrieving the place']);
		    }
		});
	},

	toggleMarker: function(id){
		if(this.lastIndex !== null && id !== this.lastIndex)
			this.markers[this.lastIndex].setAnimation(null);

		if (this.markers[id].getAnimation() !== null) 
        	this.markers[id].setAnimation(null);
      	else {
        	this.markers[id].setAnimation(google.maps.Animation.BOUNCE);
        	this.lastIndex = id;
      	}
	},

	changeAllocationChannel: function(){
		window.appSettings.currentChannelAllocation = this.$el.find("#allocation-channel").select2("val");
		this.renderPowerFrequencies();
    },

	deleteCoordinate: function(){
		var self = this;
		this.waitingView.render();

		var coordinate = new app.model.Coordinate({id:this.lastIdCoordinate});
		coordinate.urlRoot = '/api/places/'+this.placeId+'/coordinates/';

		coordinate.destroy({
			success: function(model, response) {
				self.coordinates.models[0].attributes.coordinates.splice(self.lastIndex, 1);
				self.lastIndex = null;
				self.lastIdCoordinate = null;
  				self.waitingView.closeView();
  				self.render();
  				self._renderMap();
			},
			error: function(e){
				self.waitingView.closeView();
		     	self.errorView.render(['Sorry, something went wrong try again in a few seconds!']);
			}
		});
	},

	render: function(){
		var html = this.template();
    	this.$el.html(html);	
    	
    	return this;
	},

	renderPowerFrequencies: function(){
		this.powerFrequenciesView.render(this.currentPowerFrequencies.data.attributes,this.currentPowerFrequencies.options);
       	$('html, body').stop().animate({  
	        scrollTop: $('.chart_power_frequency').offset().top
	    }, 1000);
	},

	renderMap: function(){
		var self = this;
		
		if(window.appSettings.googleMapApi)
			self._renderMap();
		else 
			Backbone.pubSub.on('event-loaded-google-map-api', function(){
				self._renderMap();
			});
	},

	_renderMap: function(){
		var self = this;
		this.markers = [];
    
    	var mapCanvas = document.getElementById('map_canvas_coordinates');
  		var mapOptions = {
    		mapTypeId: google.maps.MapTypeId.ROADMAP
  		};
  		var map = new google.maps.Map(mapCanvas, mapOptions);  
  		var bounds = new google.maps.LatLngBounds();

  		_.each(this.coordinates.models[0].attributes.coordinates, function(coordinate,index){
  			var infowindow = new google.maps.InfoWindow({
  				content: 'Latitude: ' + coordinate.latitude + '<br>Longitude: ' + coordinate.longitude,
  			});
  			
  			var latLng = new google.maps.LatLng(coordinate.latitude,coordinate.longitude);
  			var marker = new google.maps.Marker({
			    position: latLng,
		      	map: map,
		      	icon: window.appSettings.markers.iconIdle,
		      	animation: null,
		      	id: coordinate.id,
		      	index: index,
		  	});

		  	google.maps.event.addListener(marker, 'mouseover', function() {
		    	marker.setIcon(window.appSettings.markers.iconHover);
		    	infowindow.open(map, marker);
			});

			google.maps.event.addListener(marker, 'mouseout', function() {
		    	marker.setIcon(window.appSettings.markers.iconIdle);
		    	infowindow.close();
			});

			google.maps.event.addListener(marker, 'click', function() {
		    	self.markerClick(marker.index,marker.id);
			});

			self.markers.push(marker);
			bounds.extend(marker.position);
  		});

		map.fitBounds(bounds);
	}

});