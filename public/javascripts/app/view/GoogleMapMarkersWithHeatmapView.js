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

	changeMarkersByDistance: function(distance,unit){
		if(this.markers.length < 1)
			return;

		var self = this;
		var spreadDistance;
		if(unit == "m")
			spreadDistance = distance / 1000;
		else if(unit == "km")
			spreadDistance = Number(distance);
		else
			spreadDistance = 0;

		var ids = [];
		var lastSaved = {};
		lastSaved.lat = this.markers[0].position.k;
		lastSaved.lng = this.markers[0].position.D;
		_.each(this.markers, function(item, i){
			if(item.visibleCount > 0)
				return;

			var lat = item.position.k;
			var lng = item.position.D;

			d = app.util.GetDistanceFromLatLonInKm(lastSaved.lat,lastSaved.lng,lat,lng);

			if(d && d < spreadDistance && i != 0){
				item.setIcon(window.settings.markers.iconHover);
				item.setAnimation(google.maps.Animation.BOUNCE);
				ids.push(item.id);
			
			} else {
				item.setIcon(window.settings.markers.iconIdle);
				item.setAnimation(null);
			}

			lastSaved.lat = lat;
			lastSaved.lng = lng;
		});

		return ids;
	},

	changeMarkers: function(v){
		var self = this;
		n = [];
		_.each(v, function(item){
			n.push(self.markers[item]);
		});

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
					this.markers[i].setIcon(window.settings.markers.iconIdle);
			}  

			if(o[1].index > n[1].index){
				for(var j = n[1].index + 1; j <= o[1].index; j++)
					this.markers[j].setIcon(window.settings.markers.iconIdle);
			}
		
		} else {
			for(var k = o[0].index; k <= o[1].index; k++)
				this.markers[k].setIcon(window.settings.markers.iconIdle);

			if(n.length == 1)
				this.markers[n[0].index].setIcon(window.settings.markers.iconHover);
		}
	},

	fillMarkers: function(n){
		if(n.length === 0)
			return;

		else if(n.length == 1)
			this.markers[n[0].index].setIcon(window.settings.markers.iconHover);

		else if(n.length == 2){
			for(var i = n[0].index + 1; i < n[1].index; i++)
				this.markers[i].setIcon(window.settings.markers.iconHover);
		}
	},

	paintMarkersHeaders: function(o,n){
		if(n.length === 0){
			_.each(o,function(item){
				item.setAnimation(null);
				item.setIcon(window.settings.markers.iconIdle);
			});
		
		} else {
			_.each(o, function(item){
				if(item.index != n[0].index && n[1] === undefined)
					item.setAnimation(null);
				
				else if(item.index != n[0].index && n[1] !== undefined && item.index != n[1].index)
					item.setAnimation(null);

				if(item.index < n[0].index || n.length == 1)
					item.setIcon(window.settings.markers.iconIdle);
				if(n[1] !== undefined && item.index > n[1].index)
					item.setIcon(window.settings.markers.iconIdle);
			});

			_.each(n, function(item){
				item.setIcon(window.settings.markers.iconHover);
				if(item.animation === null)
					item.setAnimation(google.maps.Animation.BOUNCE);
			});
		}
	},

	hideMarkers: function(v,range){
		if(v.length === 0)
			return;

		if(range){
			if(v.length == 1){
				this.markers[v[0]].setVisible(false);
				this.markers[v[0]].visibleCount += 1;

			} else if(v.length == 2){
				for(var i = v[0]; i <= v[1]; i++){
					this.markers[i].setVisible(false);
					this.markers[i].visibleCount += 1;
				}
			}
		} else {
			var self = this;
			_.each(v, function(i){
				self.markers[i].setVisible(false);
				self.markers[i].visibleCount += 1;
			});
		}

		this.reTakeHeatmapData();
	},

	showMarkers: function(v, range){
		if(v.length === 0)
			return;

		if(range){
			if(v.length == 1){
				this.markers[v[0]].visibleCount -= 1;
				if(this.markers[v[0]].visibleCount === 0)
					this.markers[v[0]].setVisible(true);
			}

			else if(v.length == 2){
				for(var i = v[0]; i <= v[1]; i++){
					this.markers[i].visibleCount -= 1;
					if(this.markers[i].visibleCount === 0)
						this.markers[i].setVisible(true);
				}
			}
		} else {
			var self = this;
			_.each(v, function(i){
				self.markers[i].visibleCount -= 1;
				if(self.markers[i].visibleCount === 0)
					self.markers[i].setVisible(true);
			});
		}

		this.reTakeHeatmapData();
	},

	cleanAllMarkers: function(){
		_.each(this.markers, function(item){
			item.setIcon(window.settings.markers.iconIdle);
			item.setAnimation(null);
		});
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

  		this.map = new google.maps.Map(mapCanvas, mapOptions);  
  		var bounds = new google.maps.LatLngBounds();

  		_.each(data, function(coordinate, index){
  			var infowindow = new google.maps.InfoWindow({
  				content: 'Latitude: ' + coordinate.latitude + '<br>Longitude: ' + coordinate.longitude,
  			});
  			
  			var latLng = new google.maps.LatLng(coordinate.latitude,coordinate.longitude);
  			var marker = new google.maps.Marker({
			    position: latLng,
		      	map: self.map,
		      	icon: window.settings.markers.iconIdle,
		      	animation: null,
		      	id: coordinate.id,
		      	index: index,
		      	visibleCount: 0,
		  	});

			google.maps.event.addListener(marker, 'click', function() {
		    	self.markerClick(marker.index);
			});

			self.markers.push(marker);
			bounds.extend(marker.position);

			self.heatmapData.push(latLng);
  		});

  		google.maps.event.addListenerOnce(self.map, 'idle', function(){
            google.maps.event.trigger(self.map, 'resize');
            self.map.fitBounds(bounds);
  			self.renderHeatmap();
        });
        
	},

	renderHeatmap: function(){
		this.heatmap = new google.maps.visualization.HeatmapLayer({
    		data: this.heatmapData,
    		radius: 60,
    		opacity: 0.85,
    		gradient: [
      			'rgba(0, 0, 0, 0)',
      			'#00013E',
      			'#63328D',
      			'#145DF5',
      			'#00DADD',
			]
  		});

  		this.heatmap.setMap(this.map);
	},

	reTakeHeatmapData: function(){
		var self = this;
		this.heatmapData = [];
		this.heatmap.setMap(null);
		
		_.each(this.markers, function(marker){
			if(marker.visible === true)
				self.heatmapData.push(marker.position);
		});

		google.maps.event.trigger(this.map, 'resize');
		this.renderHeatmap();
	},

});