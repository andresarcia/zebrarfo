var app = app || {};
app.view = app.view || {};

app.view.WhiteSpacesView = Backbone.View.extend({

	events: {
		'change #ws-graph-type':'changeGraphType',
		'change #ws-quality-slider':'changeQuality',
		'change #ws-occupation-slider':'changeOccupation',
		'change #ws-threshold-slider':'changeThreshold',
		'change input:radio[name=ws-select-frequency-by]':'changeFrequencyBy',
		'change #ws-frequency-bands':'changeBand',
		'select2-removing #ws-frequency-bands':'checkBands',
		'change #ws-channel-width':'changeChannelWidth',
		'change #ws-range-slider':'changeFrequencyRange',
		'change #ws-select-channels':'changeChannelRange',
		'select2-removing #ws-select-channels':'checkChannelRange',
	},

	reset: function(){
		this.settings = {};
		this.settings.type = 'bar';
		this.settings.quality = {};
		this.settings.quality.crr = app.util.isWifi() ? 1 : 5;
		this.settings.quality.max = 10;
		this.settings.occupation = {};
		this.settings.occupation.dmin = 0;
		this.settings.occupation.dmax = 100;
		this.settings.occupation.max = 100;
		this.settings.threshold = {};
		this.settings.threshold.dmin = window.place.attributes.power.min;
		this.settings.threshold.dmax = window.place.attributes.power.max;
		this.settings.threshold.min = window.place.attributes.power.min;
		this.settings.threshold.max = window.place.attributes.power.max;
		this.settings.frequencies = {};
		this.cameraPosition = {};
		this.cameraPosition.horizontal = 5.4;
		this.cameraPosition.vertical = 0.5;
		this.cameraPosition.distance = 2;
	},

	initialize: function(options){
		var self = this;
		this.errorView = options.errorView;
		this.waitingView = options.waitingView;

		this.data = window.place.attributes;
		this.data3D = null;
		this.reset();

		if(!window.settings.place.charts.channels)
			window.settings.place.charts.channels = [];

		$(window).on('resize', { reference: this }, this.renderComponents);
	},

	renderComponents: function(evt){
		var self;
		if(evt) self = evt.data.reference;
		else {
			self = this;
			this.renderSettings();
		}

		if(window.settings.googleVisualizationApi)
			self.renderGraph(true);
		else {
			Backbone.pubSub.off('event-loaded-google-visualization-api');
			Backbone.pubSub.on('event-loaded-google-visualization-api', function(){
				self.renderGraph(true);
			});
		}
	},

	renderSettings: function(){
		this.$el.find("#ws-graph-type").select2();

		this.qualitySlider = this.$el.find('#ws-quality-slider').noUiSlider({
			start: this.settings.quality.max - this.settings.quality.crr,
			step: 1,
			format: wNumb({
				decimals: 0
			}),
			range: {
				'min': 1,
				'max': 9
			}
		});

		this.$el.find('#ws-quality-slider')
		.Link('lower')
		.to('-inline-<div class="nouislider-tooltip up"></div>', function(value){
			$(this).html('<strong>' + value + '</strong>');
			$(this).css('width', '50px');
			$(this).css('left', '-10px');
		});

		this.occupationSlider = this.$el.find('#ws-occupation-slider').noUiSlider({
			start: 100,
			step: 1,
			behaviour: 'tap-drag',
			connect: 'lower',
			format: wNumb({
				decimals: 0
			}),
			range: {
				'min': 0,
				'max': 100
			}
		});
		this.$el.find('#ws-occupation-slider')
		.Link('lower')
		.to('-inline-<div class="nouislider-tooltip up"></div>', function(value){
			$(this).html('<strong>' + value + ' %</strong>');
			$(this).css('width', '50px');
			$(this).css('left', '-10px');
		});

		this.thresholdSlider = this.$el.find('#ws-threshold-slider').noUiSlider({
			start: [this.settings.threshold.min, this.settings.threshold.max],
			step: 1,
			behaviour: 'tap-drag',
			connect: true,
			format: wNumb({
				decimals: 0
			}),
			range: {
				'min': this.settings.threshold.dmin,
				'max': this.settings.threshold.dmax
			}
		});
		this.$el.find('#ws-threshold-slider')
		.Link('lower')
		.to('-inline-<div class="nouislider-tooltip bottom"></div>', function(value){
			$(this).html('<strong>' + value + ' dBm</strong>');
			$(this).css('width', '70px');
			$(this).css('left', '-20px');
		});
		this.$el.find('#ws-threshold-slider')
		.Link('upper')
		.to('-inline-<div class="nouislider-tooltip up"></div>', function(value){
			$(this).html('<strong>' + value + ' dBm</strong>');
			$(this).css('width', '70px');
			$(this).css('left', '-20px');
		});

		// bands
		var bounds = window.place.attributes.frequencies.bands[window.settings.currBand];
		this.settings.frequencies.dmin = bounds.from / 1000;
		this.settings.frequencies.dmax = bounds.to / 1000;

		if(window.place.attributes.frequencies.bands.length > 1){
			this.$el.find("#ws-frequency-bands").select2({ 
				data: window.place.attributes.frequencies.bands,
				multiple: true,
			});
			this.$el.find("#ws-frequency-bands").select2("val", window.settings.currBand);
		}

		// channels width
		this.$el.find("#ws-channel-width").select2({ 
			data: window.place.attributes.frequencies.width 
		});
		this.$el.find("#ws-channel-width").select2("val", window.settings.currChannel);

		this.renderRangeSlider();
		this.changeFrequencyBy(false);
	},

	renderRangeSlider: function(){
		var bands = _.sortBy(window.settings.currBand),
			from, 
			to;

		if(Number(bands[0]) === 0){
			from = this.data.frequencies.min;
			to = this.data.frequencies.max;
		} else {
			from = window.place.get("frequencies").bands[bands[0]].from / 1000;
			to = window.place.get("frequencies").bands[bands[bands.length - 1]].to / 1000;
		}

		this.settings.frequencies.dmin = from;
		this.settings.frequencies.dmax = to;

		this.rangeSlider = this.$el.find('#ws-range-slider').noUiSlider({
			start: [from, to],
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
		this.$el.find('#ws-range-slider')
		.Link('lower')
		.to('-inline-<div class="nouislider-tooltip up"></div>', function(value){
			$(this).html('<strong>' + value + ' MHz</strong>');
			$(this).css('width', '70px');
			$(this).css('left', '-20px');
		});
		this.$el.find('#ws-range-slider')
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

		this.$el.find('#ws-select-channels').select2({
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

		this.$el.find('#ws-select-channels').select2('val', channels);
	},

	changeFrequencyBy: function(update){
		var val;
		if(update !== false)
			val = this.$el.find('input:radio[name=ws-select-frequency-by]:checked').val();
		else {
			if(window.settings.place.charts.channels.length > 0) val = "channels";
			else val = "range";
		}

		if(val == "channels"){
			this.$el.find('input:radio[name="ws-select-frequency-by"]').filter('[value="channels"]').attr('checked', true);
			this.$el.find('.ws-range-slider-settings').hide();
			this.renderChannelInput();
			this.$el.find('.ws-channels-settings').show();
			if(update !== false) this.changeChannelRange();
			else this.calBoundChannels();

		} else if(val == "range"){
			this.$el.find('input:radio[name="ws-select-frequency-by"]').filter('[value="range"]').attr('checked', true);
			this.$el.find('.ws-channels-settings').hide();
			this.$el.find('.ws-range-slider-settings').show();
			if(update !== false) this.changeFrequencyRange();
			else this.calBoundFrequencies();
		}
	},

	calBoundFrequencies: function(){
		this.boundaries = [];
		this.boundaries.push({
			from: Number(this.rangeSlider.val()[0]),
			to: Number(this.rangeSlider.val()[1])
		});
	},

	changeFrequencyRange: function(){
		this.calBoundFrequencies();
		this.renderGraph(true);
	},

	checkChannelRange: function(evt){
		if(window.settings.place.charts.channels.length == 1)
			evt.preventDefault();
	},

	calBoundChannels: function(){
		var self = this;
		this.boundaries = [];
		var channels = this.$el.find('#ws-select-channels').select2("val");
		Backbone.pubSub.trigger('charts-change-channels',channels);

		_.each(channels, function(item){
			var boundaries = item.split("-");
			self.boundaries.push({
				// if wifi limit the channel width 
				from: app.util.isWifi() ? Number(boundaries[0]) + 11 : Number(boundaries[0]),
				to: app.util.isWifi() ? Number(boundaries[1]) - 11 : Number(boundaries[1]),
			});
		});

		this.boundaries = _.sortBy(this.boundaries, function(item) { return item.to; });
	},

	changeChannelRange: function(){
		this.calBoundChannels();
		this.renderGraph(true);
	},

	changeChannelWidth: function(){
		window.settings.currChannel = this.$el.find("#ws-channel-width").select2("val");
		var channels = [];
		channels.push(window.settings.fixedChannels[window.settings.currChannel][0].from + '-' + window.settings.fixedChannels[window.settings.currChannel][0].to);
		Backbone.pubSub.trigger('charts-change-channels',channels);
		this.renderChannelInput();
		this.changeChannelRange();
	},

	changeGraphType: function(){
		this.settings.type = this.$el.find("#ws-graph-type").select2("val");
		this.renderGraph(true);
	},

	changeQuality: function(){
		this.settings.quality.crr = this.settings.quality.max - this.qualitySlider.val();
		this.renderGraph(true);
	},

	changeOccupation: function(){
		this.settings.occupation.max = Number(this.occupationSlider.val());
		this.renderGraph(true);
	},

	changeThreshold: function(){
		var threshold = this.thresholdSlider.val();
		this.settings.threshold.min = Number(threshold[0]);
		this.settings.threshold.max = Number(threshold[1]);
		this.renderGraph(true);
	},

	changeBand: function(evt){
		window.settings.currBand = this.$el.find("#ws-frequency-bands").select2("val");
		this.renderRangeSlider();
		this.changeFrequencyBy(true);
	},

	checkBands: function(evt){
		if(window.settings.currBand.length == 1) evt.preventDefault();
	},

	calculateData: function(){
		var self = this;
		this.data3D = {};
		this.data3D = new google.visualization.DataTable();
		this.data3D.addColumn('number', 'Power Threshold');
		this.data3D.addColumn('number', 'Frequencies (MHz)');
		this.data3D.addColumn('number', 'Occupation (%)');

		var data = [],
			index = 0,
			fq;

		for (var i = 0; i < this.data.charts.length; i++){
			fq = this.data.charts[i].frequency / 1000;
			if(fq >= this.boundaries[index].from && fq <= this.boundaries[index].to)
				data.push(this.data.charts[i]);

			if(fq > this.boundaries[index].to){
				if(index < this.boundaries.length - 1) index += 1;
				else break;
			}
		}

		data = _.groupBy(data, function(sample){ return sample.frequency; });

		for (var j = this.data.power.max - 1; j >= this.data.power.min; j -= this.settings.quality.crr) {
			_.each(data, function(itemSameFrequency){
				var passed = 0;
				_.each(itemSameFrequency, function(item){
					if(item.power >= j) passed += 1;
				});
				var x = itemSameFrequency[0].frequency / 1000;
				// occupation
				var occupation = (passed/itemSameFrequency.length)*100;
				if(occupation <= self.settings.occupation.max) y = occupation;
				else y = self.settings.occupation.max;
				// threshold
				var threshold = j;
				if(threshold >= self.settings.threshold.min && threshold <= self.settings.threshold.max) z = threshold;
				else if(threshold < self.settings.threshold.min) z = self.settings.threshold.min;
				else if(threshold > self.settings.threshold.max) z = self.settings.threshold.max;

				self.data3D.addRow([ z, x, y ]);
			});
		}
	},

	renderGraph: function(update){
		if(update) {
			this.disableSettings();
			this.calculateData();
		}

		var options = {
			width:  "100%",
			style: this.settings.type, // dot, dot-line, line, grid, surface, bar
			showPerspective: true,
			showGrid: false,
			showShadow: false,
			keepAspectRatio: false,
			verticalRatio: 0.5,
			cameraPosition: this.cameraPosition,
			zMin: this.settings.occupation.dmin,
			zMax: this.settings.occupation.dmax,
			xMin: this.settings.threshold.dmin,
			xMax: this.settings.threshold.dmax,
			yMin: this.settings.frequencies.dmin,
			yMax: this.settings.frequencies.dmax,
		};

		var self = this;
		var graph = new links.Graph3d(document.getElementById('ws-canvas'));
		google.visualization.events.addListener(graph, 'camerapositionchange', onCameraPositionChange);

		// save camera position to redraw in the same position
		function onCameraPositionChange(evt) {
			self.cameraPosition.horizontal = evt.horizontal;
			self.cameraPosition.vertical = evt.vertical;
			self.cameraPosition.distance = evt.distance;
		}

		setTimeout(function(){
			graph.draw(self.data3D, options);
			self.$el.find('.settings').removeClass('disable-container');
			self.$el.find('.ws-controllers').removeClass('disable-container');
		}, 200);
	},

	disableSettings: function(){
		if(!this.$el.find('.settings').hasClass("disable-container"))
			this.$el.find('.settings').addClass('disable-container');

		if(!this.$el.find('.ws-controllers').hasClass("disable-container"))
			this.$el.find('.ws-controllers').addClass('disable-container');
	},

	updateDataByTab: function(){
		this.$el.find("#ws-channel-width").select2("val", window.settings.currChannel);
		if(window.settings.place.charts.channels.length > 0)
			this.$el.find('input:radio[name="ws-select-frequency-by"]').filter('[value="channels"]').attr('checked', true);
		else
			this.$el.find('input:radio[name="ws-select-frequency-by"]').filter('[value="range"]').attr('checked', true);
		this.changeFrequencyBy(true);
	},

	render: function(){
		var template = Zebra.tmpl.white_spaces;
		var html = template({
			place: window.place.attributes, 
			bands: window.place.attributes.frequencies.bands.length > 1 ? true: false
		});
		this.$el.html(html);

		this.disableSettings();
		this.$el.find('#ws-canvas').html(Zebra.tmpl.waiting_component());

		return this;
	},

});