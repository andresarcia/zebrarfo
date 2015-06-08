var app = app || {};
app.view = app.view || {};

/*
	## PUBSUB Specification ##
	### Events triggers ###
	- MapView:MarkerSelected
		Fires when a marker was clicked on the map, return a list with the coordinates selected
	- MapView:Rendered
		Fires when the map is ready

	### Events Listener ###
	- Google:MapAPILoaded
*/

app.view.MapView = Backbone.View.extend({

	reset: function(){
		// map
		this.map = {};
		this.heatmap = {};
		this.bounds = {};
		// data
		this.markers = [];
		this.selected = [];
		this.spreader = {};
		// options
		this.mapOptions = {};
		this.mapOptions.showMarkers = true;
		this.mapOptions.crrMarkerShow = 'all'; // all or index of marker to show
		this.heatmapOptions = {};
		this.selectOptions = {};
		this.selectOptions.range = false;
		this.selectOptions.click = true;
		this.selectOptions.mouseover = false;
		this.selectOptions.spreader = false;
	},

	initialize: function(options){
		if(options.mapOptions.container){
			this.reset();
			this.mapOptions = _.extend(this.mapOptions, options.mapOptions);
			this.heatmapOptions = _.extend(this.heatmapOptions, options.heatmapOptions);
			this.selectOptions = _.extend(this.selectOptions, options.selectOptions);

			// render waiting screen
			$('#'+this.mapOptions.container).html(Zebra.tmpl.waiting_component());
			// render map
			this.render();

		} else throw 'No id container for map canvas';
	},

	changeMarkers: function(v){
		var self = this;
		n = [];
		_.each(v, function(item){
			n.push(self.markers[item]);
		});
		this._paintMarkers(n);
	},

	changeMarkersBySpreaderDistance: function(distance, unit){
		if(this.markers.length < 1) return;
		this.cleanAllMarkers();
		return this.spreader.spread(distance,unit);
	},

	_markerClick: function(index,id){
		this._selectMarkers(index);
		Backbone.pubSub.trigger('MapView:MarkerSelected', this.selected);
	},

	_selectMarkers: function(i){
		var n = [];
		// if no range activated
		if(!this.selectOptions.range) n.push(this.markers[i]);
		// else make range
		else {
			// if there is not marker selected yet
			if(this.selected.length < 1) n.push(this.markers[i]);

			// if there one marker selected
			else if(this.selected.length == 1){
				// if the marker already selected is the same of the new selected remove it
				if(this.selected[0].index == this.markers[i].index) n = [];
				// else if the already selected is lower than new, put the new at bottom
				else if(this.selected[0].index < this.markers[i].index){
					n[0] = this.selected[0];
					n[1] = this.markers[i];
				// else if already selected is upper than new, put the new at head and old to bottom
				} else {
					n[0] = this.markers[i];
					n[1] = this.selected[0];
				}
			// if there already a range
			} else if(this.selected.length == 2){
				// if the marker in the head of range is the same of the new selected, remove it and change the marker in the bottom of range to the heat
				if(this.selected[0].index == this.markers[i].index)
					n[0] = this.selected[1];
				// else if the marker in the bottom of range is the same of the new selected remove it
				else if(this.selected[1].index == this.markers[i].index)
					n[0] = this.selected[0];
				// else if the marker in the head of range is lower than new, replace the bottom by the new selected
				else if(this.selected[0].index < this.markers[i].index){
					n[0] = this.selected[0];
					n[1] = this.markers[i];
				// else if the marker in the head of range is upper than new, replace the head by the new selected
				} else {
					n[0] = this.markers[i];
					n[1] = this.selected[1];
				}
			}
		}

		this._paintMarkers(n);
	},

	_paintMarkers: function(n){
		var o = this.selected;
		this._cleanRange(o,n);
		this._fillMarkers(n);
		this._paintHeaders(o,n);
		this.selected = n;
	},

	_cleanRange: function(o,n){
		// if old selected is not a range, return
		if(o.length < 2) return;
		// if new is a range
		if(n.length == 2){
			// if old head is lower than new head, clean all between the all and new head
			if(o[0].index < n[0].index){
				for(var i = o[0].index; i < n[0].index; i++)
					this.markers[i].setIcon(window.settings.markers.iconIdle);
			}
			// if old tail is upper than new tail, clean all between the tails
			if(o[1].index > n[1].index){
				for(var j = n[1].index + 1; j <= o[1].index; j++)
					this.markers[j].setIcon(window.settings.markers.iconIdle);
			}
		// if new is not a range clean the old range between head and tail
		} else {
			for(var k = o[0].index; k <= o[1].index; k++)
				this.markers[k].setIcon(window.settings.markers.iconIdle);
		}
	},

	_fillMarkers: function(n){
		// if new is empty, return
		if(n.length === 0) return;
		// else if new is not range, paint the head
		else if(n.length == 1)
			this.markers[n[0].index].setIcon(window.settings.markers.iconHover);
		// else if new is range, paint all between head and tail
		else if(n.length == 2){
			for(var i = n[0].index + 1; i < n[1].index; i++)
				this.markers[i].setIcon(window.settings.markers.iconHover);
		}
	},

	_paintHeaders: function(o,n){
		// if new is equal to 0, remove all old
		if(n.length === 0){
			_.each(o,function(item){
				item.setAnimation(null);
				item.setIcon(window.settings.markers.iconIdle);
			});
		// if new if greather than 0
		} else {
			_.each(o, function(item){
				// [1] first remove old animation
				// if crr old is not the same than new head and new is not range, remove old 
				if(item.index != n[0].index && n.length == 1)
					item.setAnimation(null);
				// else if crr old is not the same than new head and new is range and crr old is not the same than new tail, remove old 
				else if(item.index != n[0].index && n.length == 2 && item.index != n[1].index)
					item.setAnimation(null);
				// [2] if old is out of new range, set idle
				// if crr old if lower than new head or new is not range, set crr to idle
				if(item.index < n[0].index || n.length == 1)
					item.setIcon(window.settings.markers.iconIdle);
				// if crr old if upper than new tail and new is range, set crr to idle
				if(n.length == 2 && item.index > n[1].index)
					item.setIcon(window.settings.markers.iconIdle);
			});
			// set icon and animation to new headers
			_.each(n, function(item){
				item.setIcon(window.settings.markers.iconHover);
				if(item.animation === null)
					item.setAnimation(google.maps.Animation.BOUNCE);
			});
		}
	},

	hideMarkers: function(v, range, isBuild){
		// if not markers to hide return
		if(v.length === 0) return;
		// if v is a range
		if(range){
			// if range just have head, hide the head
			if(v.length == 1){
				this.markers[v[0]].setVisible(false);
				this.markers[v[0]].visibleCount += 1;
			// else hide all marker between head and tail range
			} else if(v.length == 2){
				for(var i = v[0]; i <= v[1]; i++){
					this.markers[i].setVisible(false);
					this.markers[i].visibleCount += 1;
				}
			}
		// if v is not a range, hide all the markers inside v
		} else {
			var self = this;
			_.each(v, function(i){
				self.markers[i].setVisible(false);
				self.markers[i].visibleCount += 1;
			});
		}
		// if heatmap then rebuild it
		if(_.keys(this.heatmapOptions).length > 0 && isBuild) this.buildHeatmap([],true);
	},

	showMarkers: function(v, range, isBuild){
		// if not markers to show return
		if(v.length === 0) return;
		// if v is a range
		if(range){
			// if range just have head, show the head
			if(v.length == 1){
				this.markers[v[0]].visibleCount -= 1;
				if(this.markers[v[0]].visibleCount === 0)
					this.markers[v[0]].setVisible(true);
			}
			// else show all marker between head and tail range
			else if(v.length == 2){
				for(var i = v[0]; i <= v[1]; i++){
					this.markers[i].visibleCount -= 1;
					if(this.markers[i].visibleCount === 0)
						this.markers[i].setVisible(true);
				}
			}
		// if v is not a range, show all the markers inside v
		} else {
			var self = this;
			_.each(v, function(i){
				self.markers[i].visibleCount -= 1;
				if(self.markers[i].visibleCount === 0)
					self.markers[i].setVisible(true);
			});
		}

		// if heatmap then rebuild it
		if(_.keys(this.heatmapOptions).length > 0 && isBuild) this.buildHeatmap([],true);
	},

	cleanAllMarkers: function(){
		_.each(this.markers, function(item){
			item.setIcon(window.settings.markers.iconIdle);
			item.setAnimation(null);
		});
	},

	zoom2Fit: function(){
		// if not markers selected to zoom return
		if(this.selected.length < 1) return;

		var bounds = new google.maps.LatLngBounds();
		// if seleted is just head, put it inside the bounds
		if(this.selected.length == 1) bounds.extend(this.selected[0].position);
		// else, put all the selected inside the bounds
		else if(this.selected.length == 2){
			for(var i = this.selected[0].index; i <= this.selected[1].index; i++)
				bounds.extend(this.markers[i].position);
		}
		// adjust map to bounds
		this.map.fitBounds(bounds);
	},

	zoomOut: function(){
		if(this.markers.length < 1) return;
		// adjust the map to all bounds
		this.map.fitBounds(this.bounds);
	},

	enterFullScrenn: function(){
		// var width = '100%';
		// var height = '100%';
		// $('#'+this.mapOptions.container).css("position", 'fixed').
		// css('z-index', 100).
		// css('top', '0px').
		// css('left', '0px').
		// css("width", '100%').
		// css("height", '100%');
		// google.maps.event.trigger(this.map, 'resize');
		// this.map.fitBounds(this.bounds);
	},

	render: function(){
		var self = this;

		if(window.settings.googleMapApi){
			this._render();
			Backbone.pubSub.trigger('MapView:Rendered');
		} else {
			Backbone.pubSub.off('Google:MapAPILoaded');
			Backbone.pubSub.on('Google:MapAPILoaded', function(){
				self._render();
				Backbone.pubSub.trigger('MapView:Rendered');
			});
		}
	},

	_render: function(){
		var self = this,
			isHeatmap = _.keys(this.heatmapOptions).length > 0 ? true: false;

		var heatmapData = {};
		heatmapData.data = [];

		this.map = new google.maps.Map(
			document.getElementById(this.mapOptions.container), this.mapOptions);
		this.bounds = new google.maps.LatLngBounds();

		_.each(this.mapOptions.data, function(coord, index){
			var infowindow = new google.maps.InfoWindow({
				content: 'Latitude: ' + coord.lat + '<br>Longitude: ' + coord.lng,
			});
			
			// default setting for markers all visibles 
			var visibleCount = 0;
			if(!self.mapOptions.showMarkers) visibleCount = 1;

			var latLng = new google.maps.LatLng(coord.lat, coord.lng);
			var marker = new google.maps.Marker({
				position: latLng,
				map: self.map,
				icon: window.settings.markers.iconIdle,
				animation: null,
				id: coord.id,
				index: index,
				// marker property for count the number of erased times, when the visibleCount is equeal to 0 then the marker can be is visible in the map
				visibleCount: visibleCount,
			});

			// if show markers
			if(self.mapOptions.showMarkers){
				// if crr marker to show if index, show just one
				if(self.mapOptions.crrMarkerShow !== 'all'){
					if(index != Number(self.mapOptions.crrMarkerShow)) marker.setVisible(false);
					marker.visibleCount = 1;
				}

				// if mouse over event
				if(self.selectOptions.mouseover){
					google.maps.event.addListener(marker, 'mouseover', function() {
						marker.setIcon(window.settings.markers.iconHover);
						infowindow.open(self.map, marker);
					});

					google.maps.event.addListener(marker, 'mouseout', function() {
						if(marker.getAnimation() === null)
							marker.setIcon(window.settings.markers.iconIdle);
						infowindow.close();
					});
				}

				// if click event
				if(self.selectOptions.click){
					google.maps.event.addListener(marker, 'click', function() {
						self._markerClick(marker.index, marker.id);
					});
				}
			// hide markers
			} else marker.setVisible(false);

			self.markers.push(marker);
			self.bounds.extend(marker.position);

			if(isHeatmap) heatmapData.data.push({
				location: latLng,
				weight: coord.count ? Number(coord.count) : 1,
			});
		});

		google.maps.event.addListenerOnce(this.map, 'idle', function(){
			google.maps.event.trigger(self.map, 'resize');
			self.map.fitBounds(self.bounds);
			if(heatmapData.data.length > 0) self.buildHeatmap(heatmapData);
		});

		if(this.selectOptions.spreader){
			this.spreader = new app.util.SpreadMarkers();
			this.spreader.initialize(this.markers);
		}
	},

	buildHeatmap: function(data, isVisible){
		if(!data || data.length === 0){
			var self = this;
			data = {};
			data.data = [];
			_.each(this.mapOptions.data, function(coord, index){
				var item = {
					location: new google.maps.LatLng(coord.lat, coord.lng),
					weight: coord.count ? Number(coord.count) : 1,
				};
				if(isVisible && self.markers[index].visible === true) data.data.push(item);
				else if(!isVisible || isVisible === false) data.data.push(item);
			});
		}

		google.maps.event.trigger(this.map, 'resize');
		this.renderHeatmap(data);
	},

	renderHeatmap: function(data){
		var options = _.extend(this.heatmapOptions, data);
		// fix overlap heatmap layer over the same map
		if(_.keys(this.heatmap).length > 0) this.heatmap.setMap(null);
		this.heatmap = new google.maps.visualization.HeatmapLayer(options);
		this.heatmap.setMap(this.map);
	},

});