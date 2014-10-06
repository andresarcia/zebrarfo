var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.GoogleMapCompleteView = Backbone.View.extend({

	template: Handlebars.compile($("#coordinates-map-template").html()),
	lastMarkerToggle: null,

	initialize: function(options){
		var self = this;
		this.errorView = options.errorView;
		this.errorView.closeView();
		this.waitingView = options.waitingView;

		self.icon1 = "../../../images/marker_red.png";
		self.icon2 = "../../../images/marker_green.png";
		self.mapZoom = 15;	
	},

	markerClick: function(id){
		this.toggleMarker(id-1);
		var template = Handlebars.compile($("#complete-map-coordinate-template").html());
		var html = template(this.coordinates.models[0].attributes.coordinates[id-1]);
		this.$el.find('#select-complete-map-info').html(html);
	},

	toggleMarker: function(id){
		if(this.lastMarkerToggle !== null && id !== this.lastMarkerToggle)
			this.markers[this.lastMarkerToggle].setAnimation(null);

		if (this.markers[id].getAnimation() !== null) 
        	this.markers[id].setAnimation(null);
      	else {
        	this.markers[id].setAnimation(google.maps.Animation.BOUNCE);
        	this.lastMarkerToggle = id;
      	}
	},

	render: function(){
		var html = this.template();
    	this.$el.html(html);	

    	return this;
	},

	renderMap: function(data){
		var self = this;
		this.coordinates = data;

		if(appRouter.googleMapApi)
			self.renderMap_();
		else 
			Backbone.pubSub.on('event-loaded-google-map-api', function(){
				self.renderMap_();
			});
	},

	renderMap_: function(){
		var self = this;
		this.markers = [];
		this.waitingView.closeView();
    
		var coordinatesLength = this.coordinates.models[0].attributes.coordinates.length;
		var middleCoordinate = this.coordinates.models[0].attributes.coordinates[Math.round(coordinatesLength/2)];
		var centerCoord = new google.maps.LatLng(middleCoordinate.latitude,middleCoordinate.longitude);

    	var mapCanvas = document.getElementById('map_canvas_coordinates');
  		var mapOptions = {
    		zoom: this.mapZoom,
    		center: centerCoord,
    		mapTypeId: google.maps.MapTypeId.ROADMAP
  		};
  		var map = new google.maps.Map(mapCanvas, mapOptions);  

  		_.each(this.coordinates.models[0].attributes.coordinates, function(coordinate){
  			var infowindow = new google.maps.InfoWindow({
  				content: 'Latitude: ' + coordinate.latitude + '<br>Longitude: ' + coordinate.longitude,
  			});
  			
  			var latLng = new google.maps.LatLng(coordinate.latitude,coordinate.longitude);
  			var marker = new google.maps.Marker({
			    position: latLng,
		      	map: map,
		      	icon: self.icon1,
		      	animation: null,
		      	id: coordinate.id,
		      	title: 'lat:'+coordinate.latitude+' lng:'+coordinate.longitude,
		  	});

		  	google.maps.event.addListener(marker, 'mouseover', function() {
		    	marker.setIcon(self.icon2);
		    	infowindow.open(map, marker);
			});

			google.maps.event.addListener(marker, 'mouseout', function() {
		    	marker.setIcon(self.icon1);
		    	infowindow.close();
			});

			google.maps.event.addListener(marker, 'click', function() {
		    	self.markerClick(marker.id);
			});

			self.markers.push(marker);
  		});
	}

});