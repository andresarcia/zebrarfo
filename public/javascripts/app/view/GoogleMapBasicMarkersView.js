var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.GoogleMapBasicMarkersView = Backbone.View.extend({

	markers: null,
	lastMarkerToggle: null,

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
    	var centerCoord = new google.maps.LatLng(data[0].latitude,data[0].longitude);
  		var mapOptions = {
    		zoom: this.mapZoom,
    		scrollwheel: false,
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