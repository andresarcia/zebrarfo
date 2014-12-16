var app = app || {};
app.view = app.view || {};

app.view.GoogleMapMarkersWithHeatmapView = Backbone.View.extend({

	markers: null,

	initialize: function(options){
		var self = this;

		if(options.idContainer){
			this.idContainer = options.idContainer;
			$('#'+this.idContainer).html('<div class="ws-waiting-maps"><div class="spinner-maps"></div></div>');

		} else
			throw 'No id container for map canvas';

		this.selected = [];
		
		Backbone.pubSub.on('event-slider-changed-on-edit', function(index){
			self.emptyMakers();

			if(this.selected.length == 1)
				self.disableMarker(this.selected[0].index);
			
			else if(this.selected.length == 2){
				self.disableMarker(this.selected[0].index);
				self.disableMarker(this.selected[1].index);
			}

			if(index.length == 1){
				self.selected = [this.markers[index[0]]];
				self.enableMarker(index[0]);
			
			} else if(index.length == 2){
				self.selected = [this.markers[index[0]],this.markers[index[1]]];
				self.enableMarker(index[0]);
				self.enableMarker(index[1]);
			}

			self.fillMarkers();

		}, this);
	},

	markerClick: function(index,id){
		this.toggleMarker(index);
		Backbone.pubSub.trigger('event-marker-selected-on-google-map-edit', this.selected);
	},

	toggleMarker: function(index){
		if(!this.markers[index].selected){
			this.appendMarker(index);
			this.enableMarker(index);
			this.fillMarkers();
		
		} else {
			this.disableMarker(index);
			this.removeMarker(index);
			this.emptyMakers();
		}
	},

	appendMarker: function(index){
		this.emptyMakers();

		if(this.selected === undefined || this.selected === null)
			this.selected = [];

		if(this.selected.length < 1)
			this.selected.push(this.markers[index]);
		
		else if(this.selected.length == 1){
			if(this.selected[0].index < this.markers[index].index)
				this.selected[1] = this.markers[index];
			else {
				this.selected[1] = this.selected[0];
				this.selected[0] = this.markers[index];
			}
		
		} else if(this.selected.length == 2){
			if(this.selected[0].index < this.markers[index].index){
				this.disableMarker(this.selected[1].index);
				this.selected[1] = this.markers[index];
			
			} else {
				this.disableMarker(this.selected[0].index);
				this.selected[0] = this.markers[index];
			}
		}
	},

	removeMarker: function(index){
		for(var i = this.selected.length; i--;) {
			if(this.selected[i].index === index) 
				this.selected.splice(i, 1);
		}
	},

	enableMarker: function(id){
		this.markers[id].selected = true;
		this.markers[id].setIcon(window.appSettings.markers.iconHover);
		this.markers[id].setAnimation(google.maps.Animation.BOUNCE);
	},

	disableMarker: function(id){
		this.markers[id].selected = false;
		this.markers[id].setIcon(window.appSettings.markers.iconIdle);
		this.markers[id].setAnimation(null);
	},

	fillMarkers: function(){
		if(this.selected.length < 2)
			return;

		for(var i = this.selected[0].index + 1; i < this.selected[1].index; i++){
			this.markers[i].setIcon(window.appSettings.markers.iconHover);
		}
	},

	emptyMakers: function(){
		var self = this;
		if(this.selected.length < 1)
			return;
		
		if(this.selected.length == 1){
			_.each(this.markers, function(item){
				if(self.selected[0].index != item.index)
					item.setIcon(window.appSettings.markers.iconIdle);
			});
		}
			
		if(this.selected.length == 2){
			for(var i = this.selected[0].index + 1; i < this.selected[1].index; i++){
				if(this.selected[0].index != this.markers[i].index && this.selected[1].index != this.markers[i].index)
					this.markers[i].setIcon(window.appSettings.markers.iconIdle);
			}
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

  		_.each(data, function(coordinate, index){
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

			google.maps.event.addListener(marker, 'click', function() {
		    	self.markerClick(marker.index,marker.id);
			});

			self.markers.push(marker);
			bounds.extend(marker.position);
  		});

  		map.fitBounds(bounds);
	}

});