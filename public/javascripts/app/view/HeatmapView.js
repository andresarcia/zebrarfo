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
		'change #h-function-operate':'changeDataFunction',
		'change #h-max-intensity-slider':'changeMaxIntensity',
		'change input:radio[name=h-select-frequency-by]':'changeFrequencyBy',
		'change #h-opacity-slider':'changeOpacity',
		'change #h-radius-slider':'changeRadius',
		'change #h-frequency-bands':'changeBand',
		'select2-removing #h-frequency-bands':'checkBands',
		'change #h-channel-width':'changeChannelWidth',
		'slide #h-markers-slider':'changeMarker',
		'change #h-range-slider':'changeFrequencyRange',
		'change #h-select-channels':'changeChannelRange',
		'select2-removing #h-select-channels':'checkChannelRange',
		'change #h-spreader-unit':'changeSpreadDistance',
		'change #h-spreader-slider':'changeSpreadDistance',
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
		this.$el.find("#h-function-operate").select2();

		this.opacitySlider = this.$el.find('#h-opacity-slider').noUiSlider({
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
		this.$el.find('#h-opacity-slider')
		.Link('lower')
		.to('-inline-<div class="nouislider-tooltip bottom"></div>', function(value){
			$(this).html('<strong>' + value + '%</strong>');
			$(this).css('width', '50px');
			$(this).css('left', '-10px');
		});

		this.radiusSlider = this.$el.find('#h-radius-slider').noUiSlider({
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
		this.$el.find('#h-radius-slider')
		.Link('lower')
		.to('-inline-<div class="nouislider-tooltip bottom"></div>', function(value){
			$(this).html('<strong>' + value + 'px</strong>');
			$(this).css('width', '60px');
			$(this).css('left', '-15px');
		});

		// bands
		if(window.place.attributes.frequenciesBands.length > 1){
			this.$el.find("#h-frequency-bands").select2({ 
				data: window.place.attributes.frequenciesBands,
				multiple: true,
			});
			this.$el.find("#h-frequency-bands").select2("val", window.settings.currBand);
		}

		// channels width
		this.$el.find("#h-channel-width").select2({ 
			data: window.place.attributes.frequenciesChannelWidth 
		});
		this.$el.find("#h-channel-width").select2("val", window.settings.currChannel);

		// select by frequency
		this.renderRangeSlider();
		this.changeFrequencyBy(false);

		// spreader
		this.spreadSliderUnit = this.$el.find("#h-spreader-unit").select2();
		this.spreadSlider = this.$el.find('#h-spreader-slider').noUiSlider({
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

		this.$el.find('#h-spreader-slider').noUiSlider_pips({
			mode: 'range',
			density: 3.33
		});
	},

	changeFrequencyBy: function(update){
		var val;
		if(update !== false)
			val = this.$el.find('input:radio[name=h-select-frequency-by]:checked').val();
		else {
			if(window.settings.place.charts.channels.length > 0) val = "channels";
			else val = "range";
		}

		if(val == "channels"){
			this.$el.find('input:radio[name="h-select-frequency-by"]').filter('[value="channels"]').attr('checked', true);
			this.$el.find('.h-range-slider-settings').hide();
			this.renderChannelInput();
			this.$el.find('.h-channels-settings').show();
			if(update !== false) this.changeChannelRange();
			else this.calBoundChannels();

		} else if(val == "range"){
			this.$el.find('input:radio[name="h-select-frequency-by"]').filter('[value="range"]').attr('checked', true);
			this.$el.find('.h-channels-settings').hide();
			this.$el.find('.h-range-slider-settings').show();
			if(update !== false) this.changeFrequencyRange();
			else this.calBoundFrequencies();
		}
	},

	renderRangeSlider: function(){
		var bands = _.sortBy(window.settings.currBand),
			from, 
			to;

		if(Number(bands[0]) === 0){
			from = this.data.frequencyMin;
			to = this.data.frequencyMax;
		} else {
			from = window.place.attributes.frequenciesBands[bands[0]].from / 1000;
			to = window.place.attributes.frequenciesBands[bands[bands.length - 1]].to / 1000;
		}
		var tail = Math.round((to - from) * 0.10),
			start = [from + tail, to - tail];

		this.rangeSlider = this.$el.find('#h-range-slider').noUiSlider({
			start: start,
			step: 1,
			behaviour: 'tap-drag',
			connect: true,
			format: wNumb({
				decimals: 0
			}),
			range: {
				'min': from,
				'max': to
			}
		}, true);
		this.$el.find('#h-range-slider')
		.Link('lower')
		.to('-inline-<div class="nouislider-tooltip up"></div>', function(value){
			$(this).html('<strong>' + value + ' MHz</strong>');
			$(this).css('width', '70px');
			$(this).css('left', '-20px');
		});
		this.$el.find('#h-range-slider')
		.Link('upper')
		.to('-inline-<div class="nouislider-tooltip bottom"></div>', function(value){
			$(this).html('<strong>' + value + ' MHz</strong>');
			$(this).css('width', '70px');
			$(this).css('left', '-20px');
		});
	},

	renderChannelInput: function(){
		var channelData = [];

		_.each(window.settings.fixedChannels[window.settings.currChannel], function(channel){
			channelData.push({
				id: channel.from + '-' + channel.to,
				text: 'Channel ' + channel.tooltipText + ' [' + channel.from + '-' + channel.to + ']'});
		});

		this.$el.find('#h-select-channels').select2({
			placeholder: 'Select channels',
			multiple: true,
			data: channelData,
		});

		var channels = window.settings.place.charts.channels;

		if(channels === undefined || channels.length < 1){
			channels = [];
			channels.push(window.settings.fixedChannels[window.settings.currChannel][0].from + '-' + window.settings.fixedChannels[window.settings.currChannel][0].to);
			Backbone.pubSub.trigger('charts-change-channels',channels);
		}

		this.$el.find('#h-select-channels').select2('val', channels);
	},

	changeDataFunction: function(){
		this.heatmap.settings.dataFunction = this.$el.find("#h-function-operate").select2("val");
		this.renderHeatmap(true);
	},

	changeMaxIntensity: function(){
		this.heatmap.settings.maxIntensity = this.heatmapDataProcessor.normalizeValue(this.maxIntensitySlider.val());
		if(this.heatmap.settings.maxIntensity < 1)
			this.heatmap.settings.maxIntensity = 1;
		this.renderHeatmap();
	},

	changeBand: function(evt){
		window.settings.currBand = this.$el.find("#h-frequency-bands").select2("val");
		this.renderRangeSlider();
		this.changeFrequencyBy(true);
	},

	checkBands: function(evt){
		if(window.settings.currBand.length == 1) evt.preventDefault();
	},

	changeChannelWidth: function(){
		window.settings.currChannel = this.$el.find("#h-channel-width").select2("val");
		var channels = [];
		channels.push(window.settings.fixedChannels[window.settings.currChannel][0].from + '-' + window.settings.fixedChannels[window.settings.currChannel][0].to);
		Backbone.pubSub.trigger('charts-change-channels',channels);
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
			from: Number(this.rangeSlider.val()[0]),
			to: Number(this.rangeSlider.val()[1])
		});
	},

	checkChannelRange: function(evt){
		if(window.settings.place.charts.channels.length == 1)
			evt.preventDefault();
	},

	changeChannelRange: function(){
		this.calBoundChannels();
		this.renderHeatmap(true);
	},

	calBoundChannels: function(){
		var self = this;
		this.boundaries = [];
		var channels = this.$el.find('#h-select-channels').select2("val"); 
		Backbone.pubSub.trigger('charts-change-channels',channels);

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
		this.heatmap.settings.distanceUnit = this.$el.find("#h-spreader-unit").select2("val");
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
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			scaleControl: true,
			panControl: false,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.LARGE,
				position: google.maps.ControlPosition.RIGHT_CENTER
			},
			styles: 
				[{"elementType":"labels","stylers":[{"visibility":"off"}]},{"elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#000000"}]},{"featureType":"landscape","stylers":[{"color":"#ffffff"},{"visibility":"on"}]},{}],
		};
		this.heatmap.map = 
			new google.maps.Map(document.getElementById("h-canvas"), myOptions);
		this.heatmap.bounds = new google.maps.LatLngBounds();

		google.maps.event.addListenerOnce(self.heatmap.map, 'idle', function(){
			google.maps.event.trigger(self.heatmap.map, 'resize');
			self.renderHeatmap(true,true);
		});
	},

	renderHeatmap: function(update,center){
		var self = this;
		if(this.heatmap.heatmap) this.heatmap.heatmap.setMap(null);

		if(update){
			this.disableSettings();
			var settings = this.heatmap.settings;
			var data = this.heatmapDataProcessor.process(
				this.boundaries, 
				settings.dataFunction,
				settings.distance,
				settings.distanceUnit
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

				// just show one marker (current) 
				if(index != self.heatmap.settings.currentMarkerItem) marker.setVisible(false);

				self.heatmap.markers.push(marker);
				self.heatmap.bounds.extend(marker.position);
			});
			
			this.heatmap.settings.maxIntensity = this.heatmapDataProcessor.normalizeValue(
				this.data.powerMax);
			this.renderMaxSuggestedSlider();
			this.renderMarkersSlider(data.data.length - 1);

			if(center) this.heatmap.map.fitBounds(this.heatmap.bounds);
		}

		this.heatmap.heatmap = new google.maps.visualization.HeatmapLayer({
			data: this.heatmap.data,
			maxIntensity: this.heatmap.settings.maxIntensity,
			radius: Number(self.heatmap.settings.radius),
			opacity: self.heatmap.settings.opacity/100,
			gradient: [
				'RGBA(0, 0, 0, 0)',
				'RGBA(4, 3, 5, 1)',
				'RGBA(3, 4, 105, 1)',
				'RGBA(11, 52, 185, 1)',
				'RGBA(69, 233, 254, 1)',
				'RGBA(57, 183, 0, 1)',
				'RGBA(255, 252, 0, 1)',
				'RGBA(255, 141, 51, 1)',
				'RGBA(247, 26, 8, 1)'],
		});

		this.heatmap.heatmap.setMap(this.heatmap.map);
		this.$el.find('.settings').removeClass('disable-container');
		this.waitingView.hide();
	},

	renderMaxSuggestedSlider: function(){
		this.maxIntensitySlider = this.$el.find('#h-max-intensity-slider').noUiSlider({
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
		this.$el.find('#h-max-intensity-slider')
		.Link('lower')
		.to('-inline-<div class="nouislider-tooltip bottom"></div>', function(value){
			$(this).html('<strong>' + value + ' dBm</strong>');
			$(this).css('width', '70px');
			$(this).css('left', '-20px');
		});
	},

	renderMarkersSlider: function(max){
		this.markersSlider = this.$el.find('#h-markers-slider').noUiSlider({
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

		this.$el.find('.h-controllers').slideDown(100);
	},

	updateDataByTab: function(){
		this.$el.find("#h-channel-width").select2("val", window.settings.currChannel);
		if(window.settings.place.charts.channels.length > 0)
			this.$el.find('input:radio[name="h-select-frequency-by"]').filter('[value="channels"]').attr('checked', true);
		else
			this.$el.find('input:radio[name="h-select-frequency-by"]').filter('[value="range"]').attr('checked', true);
		this.changeFrequencyBy(true);
	},

	disableSettings: function(){
		if(!this.$el.find('.settings').hasClass("disable-container"))
			this.$el.find('.settings').addClass('disable-container');
	},

	render: function(){
		var template = Zebra.tmpl.heatmap;
		var html = template({
			place: window.place.attributes, 
			bands: window.place.attributes.frequenciesBands.length > 1 ? true: false
		});
		this.$el.html(html);

		this.disableSettings();
		this.$el.find('#h_canvas').html('<div class="ws-waiting-maps"><div class="spinner-maps"></div></div>');

		return this;
	}

});