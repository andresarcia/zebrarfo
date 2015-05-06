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

	markerClick: function(index,id){
		this.toggleMarker(index);
		Backbone.pubSub.trigger('event-marker-selected-on-google-map-main',{index:index, id:id});
	},

	toggleMarker: function(id){
		if(this.lastMarkerToggle !== null && id !== this.lastMarkerToggle){
			this.markers[this.lastMarkerToggle].setAnimation(null);
			this.markers[this.lastMarkerToggle].setIcon(window.settings.markers.iconIdle);
		}

		if (this.markers[id].getAnimation() !== null) {
			this.markers[id].setAnimation(null);
			this.markers[id].setIcon(window.settings.markers.iconIdle);
		
		} else {
			this.markers[id].setAnimation(google.maps.Animation.BOUNCE);
			this.markers[id].setIcon(window.settings.markers.iconHover);
			this.lastMarkerToggle = id;
		}
	},

	render: function(data){
		var self = this;
		this.markers = [];

		var mapCanvas = document.getElementById(this.idContainer);
		var mapOptions = {
			scrollwheel: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
		};

		var map = new google.maps.Map(mapCanvas, mapOptions);
		var bounds = new google.maps.LatLngBounds();

		_.each(data, function(coordinate, index){
			var infowindow = new google.maps.InfoWindow({
				content: 'Latitude: ' + coordinate.latitude + '<br>Longitude: ' + coordinate.longitude,
			});
			
			var latLng = new google.maps.LatLng(coordinate.latitude,coordinate.longitude);
			var marker = new google.maps.Marker({
				position: latLng,
				map: map,
				icon: window.settings.markers.iconIdle,
				animation: null,
				id: coordinate.id,
				index: index,
			});

			google.maps.event.addListener(marker, 'mouseover', function() {
				marker.setIcon(window.settings.markers.iconHover);
				infowindow.open(map, marker);
			});

			google.maps.event.addListener(marker, 'mouseout', function() {
				if(marker.getAnimation() === null)
					marker.setIcon(window.settings.markers.iconIdle);
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