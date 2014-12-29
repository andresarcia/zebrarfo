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
		
		Backbone.pubSub.on('event-slider-changed-on-edit', function(indexArray){
			var self = this;
			n = [];
			_.each(indexArray, function(item){
				n.push(self.markers[item]);
			});

			this.paintMarkers(n);
		}, this);
	},

	markerClick: function(i){
		this.changeMarkersHeader(i);
		Backbone.pubSub.trigger('event-marker-selected-on-google-map-edit', this.selected);
	},

	changeMarkersHeader: function(i){
		var n = [];

		if(this.selected === undefined || this.selected === null)
			this.selected = [];

		if(this.selected.length < 1)
			n.push(this.markers[i]);
		
		else if(this.selected.length == 1){
			if(this.selected[0].index == this.markers[i].index)
				n = [];

			else if(this.selected[0].index < this.markers[i].index){
				n[0] = this.selected[0];
				n[1] = this.markers[i];
			
			} else {
				n[0] = this.markers[i];
				n[1] = this.selected[0];
			}
		
		} else if(this.selected.length == 2){
			if(this.selected[0].index == this.markers[i].index)
				n[0] = this.selected[1];

			else if(this.selected[1].index == this.markers[i].index)
				n[0] = this.selected[0];

			else if(this.selected[0].index < this.markers[i].index){
				n[0] = this.selected[0];
				n[1] = this.markers[i];
			
			} else {
				n[0] = this.markers[i];
				n[1] = this.selected[1];
			}
		}

		this.paintMarkers(n);
	},

	paintMarkers: function(n){
		var o = this.selected;
		this.cleanMarkers(o,n);
		this.fillMarkers(n);
		this.paintMarkersHeaders(o,n);
		this.selected = n;
	},

	cleanMarkers: function(o,n){
		if(o.length < 2)
			return;

		if(n.length == 2){

			if(o[0].index < n[0].index){
				for(var i = o[0].index; i < n[0].index; i++)
					this.markers[i].setIcon(window.appSettings.markers.iconIdle);
			}  

			if(o[1].index > n[1].index){
				for(var j = n[1].index + 1; j <= o[1].index; j++)
					this.markers[j].setIcon(window.appSettings.markers.iconIdle);
			}
		
		} else {
			for(var k = o[0].index; k <= o[1].index; k++)
				this.markers[k].setIcon(window.appSettings.markers.iconIdle);

			if(n.length == 1)
				this.markers[n[0].index].setIcon(window.appSettings.markers.iconHover);
		}
	},

	fillMarkers: function(n){
		if(n.length === 0)
			return;

		else if(n.length == 1)
			this.markers[n[0].index].setIcon(window.appSettings.markers.iconHover);

		else if(n.length == 2){
			for(var i = n[0].index + 1; i < n[1].index; i++)
				this.markers[i].setIcon(window.appSettings.markers.iconHover);
		}
	},

	paintMarkersHeaders: function(o,n){
		if(n.length === 0){
			_.each(o,function(item){
				item.setAnimation(null);
				item.setIcon(window.appSettings.markers.iconIdle);
			});
		
		} else {
			_.each(o, function(item){
				if(item.index != n[0].index && n[1] === undefined)
					item.setAnimation(null);
				
				else if(item.index != n[0].index && n[1] !== undefined && item.index != n[1].index)
					item.setAnimation(null);

				if(item.index < n[0].index || n.length == 1)
					item.setIcon(window.appSettings.markers.iconIdle);
				if(n[1] !== undefined && item.index > n[1].index)
					item.setIcon(window.appSettings.markers.iconIdle);
			});

			_.each(n, function(item){
				item.setIcon(window.appSettings.markers.iconHover);
				if(item.animation === null)
					item.setAnimation(google.maps.Animation.BOUNCE);
			});
		}
	},

	render: function(data){
		var self = this;
		this.markers = [];
		this.heatmapData = [];

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
		    	self.markerClick(marker.index);
			});

			self.markers.push(marker);
			bounds.extend(marker.position);

			self.heatmapData.push(latLng);
  		});

  		map.fitBounds(bounds);
  		
  		var heatmap = new google.maps.visualization.HeatmapLayer({
    		data: this.heatmapData,
    		radius: 60,
    		gradient: [
				'rgba(0, 255, 255, 0)',
				'rgba(0, 255, 255, 1)',
				'rgba(0, 191, 255, 1)',
				'rgba(0, 127, 255, 1)',
				'rgba(0, 63, 255, 1)',
				'rgba(0, 0, 255, 1)',
				'rgba(0, 0, 223, 1)',
				'rgba(0, 0, 191, 1)',
				'rgba(0, 0, 159, 1)',
				'rgba(0, 0, 127, 1)',
				'rgba(63, 0, 91, 1)',
				'rgba(127, 0, 63, 1)',
				'rgba(191, 0, 31, 1)',
				'rgba(255, 0, 0, 1)'
			]
  		});

  		heatmap.setMap(map);
	}

});