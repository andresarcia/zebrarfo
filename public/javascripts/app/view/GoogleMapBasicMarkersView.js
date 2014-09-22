var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.GoogleMapBasicMarkersView = Backbone.View.extend({

	initialize: function(options){
		if(options.idContainer){
			this.idContainer = options.idContainer;

			this.icon1 = "../../../images/marker_red.png";
			this.icon2 = "../../../images/marker_green.png";
			this.mapZoom = 15;	

			$('#'+this.idContainer).html('<div class="ws-waiting-maps"><div class="spinner-maps"></div></div>');

		} else
			throw 'No id container for map canvas';
	},

	markerClick: function(id){
		var targetId = '#coord-id-'+id;
		$('body').scrollspy({ target: targetId });
	},

	render: function(data){
		var self = this;

    	var mapCanvas = document.getElementById(this.idContainer);
    	var centerCoord = new google.maps.LatLng(data[0].latitude,data[0].longitude);
  		var mapOptions = {
    		zoom: this.mapZoom,
    		center: centerCoord,
    		mapTypeId: google.maps.MapTypeId.ROADMAP
  		};

  		var map = new google.maps.Map(mapCanvas, mapOptions);  

  		_.each(data, function(coordinate){
  			var infowindow = new google.maps.InfoWindow({
  				content: 'Latitude: ' + coordinate.latitude + '<br>Longitude: ' + coordinate.longitude,
  			});
  			
  			var latLng = new google.maps.LatLng(coordinate.latitude,coordinate.longitude);
  			var marker = new google.maps.Marker({
			    position: latLng,
		      	map: map,
		      	icon: self.icon1,
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

			google.maps.event.addListener(marker, 'click', function(evt) {
		    	self.markerClick(marker.id);
			});
  		});
	}

});