var app = app || {};
app.view = app.view || {};

app.view.HeatmapView = Backbone.View.extend({

	reset: function(){
		this.heatmap = {};
		this.heatmap.map = null;
		this.heatmap.bounds = null;
		this.heatmap.heatmap = null;
		this.heatmap.data = [];
		this.heatmap.markers = [];
		this.heatmap.settings = {};
		this.heatmap.settings.dataFunction = "avg";
		this.heatmap.settings.opacity = 80;
		this.heatmap.settings.radius = 15;
		this.heatmap.settings.currentMarkerItem = 0;
		this.heatmap.settings.markersCount = 0;
		this.heatmap.settings.distance = 0;
		this.heatmap.settings.distanceUnit = "m";
	},

	events: {
		'change .slider':'changeFrequencyRange',
		'change #select-channels':'changeChannelRange',
		'select2-removing #select-channels':'checkChannelRange',
		'change #select-function-operate':'changeDataFunction',
		'change .max-intensity-slider':'changeMaxIntensity',
		'change input:radio[name=select-change-data-by]':'changeFrequencyBy',
		'change .opacity-slider':'changeOpacity',
		'change .radius-slider':'changeRadius',
		'slide .markers-slider':'changeMarker',
		'change .spread-distance-slider':'changeSpreadDistance',
		'change #spread-distance-unit-slider':'changeSpreadDistance',
		'change #allocation-channel':'changeAllocationChannel',
	},
	
	initialize: function(options){
		var self = this;
		this.reset();
		this.errorView = options.errorView;
		this.waitingView = options.waitingView;
		
		this.data = window.place.attributes;
		this.heatmapDataProcessor = new app.util.HeatmapDataProcessor();
		this.heatmapDataProcessor.require({
			place: this.data,
			data: this.data.charts
		});

		if(!window.settings.place.charts.channels)
			window.settings.place.charts.channels = [];
	},

	renderComponents: function(){
		this.renderSettings();
		this.renderMap();
	},

	renderMap: function(){
		var self = this;
		
		if(window.settings.googleMapApi)
			self._renderMap();
		else {
			Backbone.pubSub.off('event-loaded-google-map-api');
			Backbone.pubSub.on('event-loaded-google-map-api', function(){
				self._renderMap();
			});
		}
	},

	renderSettings: function(){
		var self = this;
		this.$el.find("#select-function-operate").select2();

		this.opacitySlider = this.$el.find('.opacity-slider').noUiSlider({
			start: this.heatmap.settings.opacity,
			step: 1,
			format: wNumb({
				decimals: 0
			}),
			range: {
				'min': 0,
				'max': 100
			}
		});
		this.$el.find('.opacity-slider').Link('lower').to('-inline-<div class="slider_tooltip slider_tooltip_down" style="width:50px;"></div>', function(value) {
			$(this).html(
				'<strong>' + value + '%</strong>'
			);
		});

		this.radiusSlider = this.$el.find('.radius-slider').noUiSlider({
			start: this.heatmap.settings.radius,
			step: 1,
			format: wNumb({
				decimals: 0
			}),
			range: {
				'min': 10,
				'max': 25
			}
		});
		this.$el.find('.radius-slider').Link('lower').to('-inline-<div class="slider_tooltip slider_tooltip_down" style="width:50px;"></div>', function(value) {
			$(this).html(
				'<strong>' + value + 'px</strong>'
			);
		});

		this.$el.find("#allocation-channel").select2();
		this.$el.find("#allocation-channel").select2("val", 
			window.settings.currentChannelAllocation);
		this.$el.find('.heatmap-select-channels').hide();

		var tail = Math.round((this.data.frequencyMax - this.data.frequencyMin) * 0.10);
		this.slider = this.$el.find('.slider').noUiSlider({
			start: [this.data.frequencyMin + tail, this.data.frequencyMax - tail],
			step: 1,
			behaviour: 'tap-drag',
			connect: true,
			format: wNumb({
				decimals: 0
			}),
			range: {
				'min': this.data.frequencyMin,
				'max': this.data.frequencyMax
			}
		});
		this.$el.find('.slider').Link('lower').to('-inline-<div class="slider_tooltip slider_tooltip_up" style="top:-24px;left:-27px"></div>', function(value) {
			$(this).html(
				'<strong>' + value + ' MHz</strong>'
			);
		});
		this.$el.find('.slider').Link('upper').to('-inline-<div class="slider_tooltip slider_tooltip_up" style="top:-24px;left:-27px"></div>', function(value) {
			$(this).html(
				'<strong>' + value + ' MHz</strong>'
			);
		});

		this.changeFrequencyBy(false);

		this.spreadSliderUnit = this.$el.find("#spread-distance-unit-slider").select2();

		this.spreadSlider = this.$el.find('.spread-distance-slider').noUiSlider({
			start: this.heatmap.settings.distance,
			connect: "lower",
			format: wNumb({
				decimals: 1
			}),
			range: {
				'min': [ 0 ],
				'33.33%': [ 10, 10 ],
				'66.33%': [ 100, 100 ],
				'max': [ 1000 ]
			}
		});

		this.$el.find('.spread-distance-slider').noUiSlider_pips({
			mode: 'range',
			density: 3.33
		});
	},

	changeFrequencyBy: function(update){
		var val;
		if(update !== false)
			val = this.$el.find('input:radio[name=select-change-data-by]:checked').val();
		else {
			if(window.settings.place.charts.channels.length > 0)
				val = "channels";
			else
				val = "frequency";
		}

		if(val == "channels"){
			this.$el.find('input:radio[name="select-change-data-by"]').filter('[value="channels"]').attr('checked', true);
			this.$el.find('.heatmap-slider-container').hide();
			this.renderChannelInput();
			this.$el.find('.heatmap-select-channels').show();
			if(update !== false)
				this.changeChannelRange();
			else
				this.calBoundChannels();

		} else if(val == "frequency"){
			this.$el.find('input:radio[name="select-change-data-by"]').filter('[value="frequency"]').attr('checked', true);
			this.$el.find('.heatmap-select-channels').hide();
			this.$el.find('.heatmap-slider-container').show();
			if(update !== false)
				this.changeFrequencyRange();
			else
				this.calBoundFrequencies();
		}
	},

	renderChannelInput: function(){
		var channelData = [];
		_.each(window.settings.fixedChannels[window.settings.currentChannelAllocation], function(channel){
			channelData.push({
				id: channel.from + '-' + channel.to,
				text: 'Channel ' + channel.tooltipText + ' [' + channel.from + '-' + channel.to + ']'});
		});

		this.$el.find('#select-channels').select2({
			placeholder: 'Select channels',
			multiple: true,
			data: channelData,
		});

		var channels = window.settings.place.charts.channels;

		if(channels === undefined || channels.length < 1){
			channels = [];
			channels.push(window.settings.fixedChannels[window.settings.currentChannelAllocation][0].from + '-' + window.settings.fixedChannels[window.settings.currentChannelAllocation][0].to);
			Backbone.pubSub.trigger('single-place-charts-change-channels',channels);
		}

		this.$el.find('#select-channels').select2('val', channels);
	},

	changeDataFunction: function(){
		this.heatmap.settings.dataFunction = this.$el.find("#select-function-operate").select2("val");
		this.renderHeatmap(true);
	},

	changeMaxIntensity: function(){
		this.heatmap.settings.maxIntensity = this.heatmapDataProcessor.normalizeValue(this.maxIntensitySlider.val());
		if(this.heatmap.settings.maxIntensity < 1)
			this.heatmap.settings.maxIntensity = 1;
		this.renderHeatmap();
	},

	changeAllocationChannel: function(){
		window.settings.currentChannelAllocation = this.$el.find("#allocation-channel").select2("val");
		var channels = [];
		channels.push(window.settings.fixedChannels[window.settings.currentChannelAllocation][0].from + '-' + window.settings.fixedChannels[window.settings.currentChannelAllocation][0].to);
		Backbone.pubSub.trigger('single-place-charts-change-channels',channels);
		this.renderChannelInput();
		this.changeChannelRange();
	},

	changeFrequencyRange: function(){
		this.calBoundFrequencies();
		this.renderHeatmap(true);
	},

	calBoundFrequencies: function(){
		this.boundaries = [];
		this.boundaries.push({
			from: Number(this.slider.val()[0]),
			to: Number(this.slider.val()[1])
		});
	},

	checkChannelRange: function(evt){
		if(window.settings.place.charts.channels.length == 1)
			evt.preventDefault();
	},

	changeChannelRange: function(){
		var self = this;
		this.calBoundChannels();
		this.renderHeatmap(true);
	},

	calBoundChannels: function(){
		var self = this;
		this.boundaries = [];
		var channels = this.$el.find('#select-channels').select2("val"); 
		Backbone.pubSub.trigger('single-place-charts-change-channels',channels);

		_.each(channels, function(item){
			var boundaries = item.split("-");
			self.boundaries.push({
				from: Number(boundaries[0]),
				to: Number(boundaries[1])
			});
		});

		this.boundaries = _.sortBy(this.boundaries, function(item) { return item.to; });
	},

	changeSpreadDistance: function(){
		this.disableMarker();
		this.heatmap.settings.currentMarkerItem = 0;
		this.markersSlider.val(0);
		this.heatmap.settings.distance = this.spreadSlider.val();
		this.heatmap.settings.distanceUnit = this.$el.find("#spread-distance-unit-slider").select2("val");
		this.renderHeatmap(true);
	},

	changeOpacity: function(){
		this.heatmap.settings.opacity = this.opacitySlider.val();
		this.renderHeatmap();
	},

	changeRadius: function(){
		this.heatmap.settings.radius = this.radiusSlider.val();
		this.renderHeatmap();
	},

	changeMarker: function(){
		var marker = this.heatmap.markers[this.heatmap.settings.currentMarkerItem];
		if(marker === undefined)
			return;

		marker.setVisible(false);

		this.heatmap.settings.currentMarkerItem = this.markersSlider.val();
		marker = this.heatmap.markers[this.heatmap.settings.currentMarkerItem];
		marker.setVisible(true);
	},

	disableMarker: function(){
		var marker = this.heatmap.markers[this.heatmap.settings.currentMarkerItem];
		if(marker === undefined)
			return;

		marker.setVisible(false);
	},

	_renderMap: function(){
		var self = this;

		var myOptions = {
			mapTypeId: google.maps.MapTypeId.HYBRID,
			scaleControl: true,
			panControl: false,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.LARGE,
				position: google.maps.ControlPosition.RIGHT_CENTER
			},
		};
		
		this.heatmap.map = new google.maps.Map(document.getElementById("map_canvas_heatmap"), myOptions);
		this.heatmap.bounds = new google.maps.LatLngBounds();
		google.maps.event.addListenerOnce(self.heatmap.map, 'idle', function(){
			google.maps.event.trigger(self.heatmap.map, 'resize');
			self.renderHeatmap(true,true);
		});

		this.waitingView.hide();
	},

	renderHeatmap: function(updateData,center){
		var self = this;

		if (this.heatmap.heatmap)
			this.heatmap.heatmap.setMap(null);

		if(updateData){
			var data = this.heatmapDataProcessor.process(
				this.boundaries, 
				this.heatmap.settings.dataFunction,
				this.heatmap.settings.distance,
				this.heatmap.settings.distanceUnit
			);

			this.disableMarker();
			this.heatmap.data = [];
			this.heatmap.markers = [];

			_.each(data.data, function(item, index) {
				var location = new google.maps.LatLng(item.lat, item.lng);

				self.heatmap.data.push({
					location: location, 
					weight: item.count 
				});

				var infowindow = new google.maps.InfoWindow({
					content: 'Latitude: ' + item.lat + '<br>Longitude: ' + item.lng + '<br>Power: ' + self.heatmapDataProcessor.denormalizeValue(item.count) + ' dBm',
				});

				var marker = new google.maps.Marker({
					position: location,
					map: self.heatmap.map,
					icon: window.settings.markers.iconNormal,
					index: index,
				});

				google.maps.event.addListener(marker, 'mouseover', function() {
					infowindow.open(self.heatmap.map, marker);
				});

				google.maps.event.addListener(marker, 'mouseout', function() {
					infowindow.close();
				});

				if(index != self.heatmap.settings.currentMarkerItem)
					marker.setVisible(false);

				self.heatmap.markers.push(marker);
				self.heatmap.bounds.extend(marker.position);
			});
			
			this.heatmap.settings.maxIntensity = this.heatmapDataProcessor.normalizeValue(this.data.powerMax);
			this.renderMaxSuggestedSlider();
			this.renderMarkersSlider(data.data.length - 1);

			if(center)
				this.heatmap.map.fitBounds(this.heatmap.bounds);
		}

		this.heatmap.heatmap = new google.maps.visualization.HeatmapLayer({
			data: this.heatmap.data,
			maxIntensity: this.heatmap.settings.maxIntensity,
			radius: Number(self.heatmap.settings.radius),
			opacity: self.heatmap.settings.opacity/100,
			gradient: ['rgba(0, 0, 0, 0)','#000000','#63328D','#145DF5','#00DADD','#00F24F','#FEF252','#FF8D33','#EE1F1A'],
		});

		this.heatmap.heatmap.setMap(this.heatmap.map);
		this.$el.find('.heatmap-settings').removeClass('disable-container');
	},

	renderMaxSuggestedSlider: function(){
		this.maxIntensitySlider = this.$el.find('.max-intensity-slider').noUiSlider({
			start: this.data.powerMax,
			step: 1,
			format: wNumb({
				decimals: 0
			}),
			range: {
				'min': -120,
				'max': 0
			}
		}, true);

		this.maxIntensitySlider.val(this.data.powerMax);
		this.$el.find('.max-intensity-slider').Link('lower').to('-inline-<div class="slider_tooltip slider_tooltip_down" style="width:65px;"></div>', function(value) {
			$(this).html(
				'<strong>' + value + ' dBm</strong>'
			);
		});
	},

	renderMarkersSlider: function(max){
		this.markersSlider = this.$el.find('.markers-slider').noUiSlider({
			start: this.heatmap.settings.currentMarkerItem,
			step: 1,
			orientation: "vertical",
			format: wNumb({
				decimals: 0
			}),
			range: {
				'min': 0,
				'max': max
			}
		}, true);

		this.$el.find('.heatmap-controllers-container').slideDown(100);
	},

	updateDataByTab: function(){
		this.$el.find("#allocation-channel").select2("val", window.settings.currentChannelAllocation);
		if(window.settings.place.charts.channels.length > 0)
			this.$el.find('input:radio[name="select-change-data-by"]').filter('[value="channels"]').attr('checked', true);
		else
			this.$el.find('input:radio[name="select-change-data-by"]').filter('[value="frequency"]').attr('checked', true);
		this.changeFrequencyBy(true);
	},

	render: function(){
		var template = Zebra.tmpl.heatmap;
		var html = template();
		this.$el.html(html);

		this.$el.find('.heatmap-settings').addClass('disable-container');
		this.$el.find('#map_canvas_heatmap').html('<div class="ws-waiting-maps"><div class="spinner-maps"></div></div>');

		return this;
	}

});