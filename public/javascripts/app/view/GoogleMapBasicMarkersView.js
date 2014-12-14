var app = app || {};
app.view = app.view || {};

app.view.GoogleMapBasicMarkersView = Backbone.View.extend({

	markers: null,
	lastMarkerToggle: null,

	initialize: function(options){
		if(options.idContainer){
			this.idContainer = options.idContainer;
			$('#'+this.idContainer).html('<div class="ws-waiting-maps"><div class="spinner-maps"></div></div>');

		} else
			throw 'No id container for map canvas';
	},

	markerClick: function(id){
		var targetId = '#coord-id-'+id;
		$('#coordinates .list-group-item').removeClass('active');
		$(targetId).addClass('active');

		if($(document).width() < 768){
			$('html, body').stop().animate({  
		        scrollTop: $(targetId).offset().top - ($('#vertical-nav').height() + $('.navbar-fixed-top').height() + 5)  
		    }, 1000);
		
		} else {
			$('html, body').stop().animate({  
		        scrollTop: $(targetId).offset().top - ($('.navbar-fixed-top').height() + 10)
		    }, 1000);
		}
	},

	toggleMarker: function(id){
		var self = this;

		if(this.lastMarkerToggle !== null && id !== this.lastMarkerToggle)
			this.markers[this.lastMarkerToggle].setAnimation(null);

		if (this.markers[id].getAnimation() !== null) 
        	this.markers[id].setAnimation(null);
      	else {
        	this.markers[id].setAnimation(google.maps.Animation.BOUNCE);
        	this.lastMarkerToggle = id;

        	if($(document).width() < 768){
				$('html, body').stop().animate({  
			        scrollTop: $('#'+self.idContainer).offset().top - ($('#vertical-nav').height() + $('.navbar-fixed-top').height() + 5)  
			    }, 1000);
			
			} else {
				$('html, body').stop().animate({  
			        scrollTop: $('#'+self.idContainer).offset().top - ($('.navbar-fixed-top').height() + 10)
			    }, 1000);
			}

	    	$('#coordinates .list-group-item').removeClass('active');
	    	var targetId = '#coord-id-'+this.markers[id].id;
			$(targetId).addClass('active');
      	}
	},

	render: function(data){
		var self = this;
		this.markers = [];

    	var mapCanvas = document.getElementById(this.idContainer);
  		var mapOptions = {
    		scrollwheel: false,
    		mapTypeId: google.maps.MapTypeId.ROADMAP
  		};

  		var map = new google.maps.Map(mapCanvas, mapOptions);  
  		var bounds = new google.maps.LatLngBounds();

  		_.each(data, function(coordinate){
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
		    	self.markerClick(marker.id);
			});

			self.markers.push(marker);
			bounds.extend(marker.position);
  		});

  		map.fitBounds(bounds);
	}

});