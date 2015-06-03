var app = app || {};
app.view = app.view || {};

app.view.OccupationView = Backbone.View.extend({

	events: {
		'change #o-frequency-bands':'changeBand',
		'select2-removing #o-frequency-bands':'checkBands',
		'change #o-channel-width':'changeAllocationChannel',
		'change #o-threshold-slider':'updateChart',
		'change #o-select-channels':'pushChannelsFromInput',
		'select2-removed #o-select-channels':'popChannelFromInput',
		'click #o-heatmap-btn':'changeToHeatmap'
	},

	initialize: function(options){
		var self = this;
		this.errorView = options.errorView;
		this.waitingView = options.waitingView;

		this.data = window.place.attributes;
		this.threshold = this.data.powerAvg;

		this.chart = new app.view.CapturesView({
			selector: '#o-chart',
			tooltipTop: 10,
			trackClick: true,
		});

		this.chartOptions = {
			chart: {
				type: app.util.isWifi() ? 'column': 'areaspline',
				events: {
					load: function(event) {

					}
				},
			},
			tooltip: {
				positioner: {
					x: 80,
					y: 40
				}
			},
			xAxis: {
				tickPositions: app.util.isWifi() ? [2412, 2417, 2422, 2427, 2432, 2437, 2442, 2447, 2452, 2457, 2462, 2467, 2472, 2484, 5170, 5180, 5190, 5200, 5210, 5220, 5230, 5240, 5260, 5280, 5300, 5320, 5500, 5520, 5540, 5560, 5580, 5600, 5620, 5640, 5660, 5680, 5700, 5745, 5765, 5785, 5805, 5825] : undefined,
			},
			yAxis: {
				min: 0,
				max: 110,
				endOnTick: false,
				showLastLabel: false,
				tickInterval: 10,
				title: {
					text: 'Occupation (%)'
				}
			}
		};

		if(!window.settings.place.charts.channels) window.settings.place.charts.channels = [];

		Backbone.pubSub.off('event-power-frequencies-channel-select');
		Backbone.pubSub.on('event-power-frequencies-channel-select', this.pushChannelsFromGraph, this);
		Backbone.pubSub.off('event-power-frequencies-channel-deselect');
		Backbone.pubSub.on('event-power-frequencies-channel-deselect', this.popChannelsFromGraph, this);
	},

	changeToHeatmap: function(){
		Backbone.pubSub.trigger('single-place-change-to-heatmap');
	},

	changeAllocationChannel: function(){
		window.settings.currChannel = this.$el.find("#o-channel-width").select2("val");
		this.clearChannels();
		this.renderChart();
		this.renderChannelInput();
	},

	changeBand: function(){
		window.settings.currBand = this.$el.find("#o-frequency-bands").select2("val");
		this.renderChart();
	},

	checkBands: function(evt){
		if(window.settings.currBand.length == 1) evt.preventDefault();
	},

	updateChart: function(){
		this.threshold = this.thresholdSlider.val();
		this.renderChart();
	},

	updateDataByTab: function(){
		var self = this;

		if(this.chart.chart) this.chart.chart.destroy();
		setTimeout(function(){
			self.renderChart();
		}, 200);

		this.$el.find("#o-channel-width").select2("val", window.settings.currChannel);
		this.renderChannelInput();
	},

	pushChannelsFromGraph: function(data){
		var channels = window.settings.place.charts.channels;
		channels.push(data);
		this.$el.find('#o-select-channels').select2("val",channels);
		Backbone.pubSub.trigger('single-place-charts-change-channels',channels);
	},

	pushChannelsFromInput: function(evt){
		var channels = this.$el.find('#o-select-channels').select2("val"); 
		Backbone.pubSub.trigger('event-occupation-channel-select',evt.val[evt.val.length - 1]);
		Backbone.pubSub.trigger('single-place-charts-change-channels',channels);
	},

	popChannelsFromGraph: function(data){
		var channels = window.settings.place.charts.channels;
		channels = _.without(channels, data);
		this.$el.find('#o-select-channels').select2("val",channels);
		Backbone.pubSub.trigger('single-place-charts-change-channels',channels);
	},

	popChannelFromInput: function(evt){
		var channels = this.$el.find('#o-select-channels').select2("val"); 
		Backbone.pubSub.trigger('event-occupation-channel-deselect',evt.val);
		Backbone.pubSub.trigger('single-place-charts-change-channels',channels);
	},

	clearChannels: function(evt){
		this.$el.find('#o-select-channels').select2("val",[]);
		Backbone.pubSub.trigger('single-place-charts-change-channels',[]);
	},

	renderComponents: function(){
		var self = this;

		setTimeout(function(){
			self.renderSlider();
			self.renderChannelInput();
			self.renderChart();
		}, 200);
	},

	renderSlider: function(){
		var self = this;

		this.thresholdSlider = this.$el.find('#o-threshold-slider').noUiSlider({
			start: this.data.powerAvg,
			step: 1,
			range: {
				'min': self.data.powerMin,
				'max': self.data.powerMax
			},
			format: wNumb({
				decimals: 0
			}),
		});

		this.$el.find('#o-threshold-slider')
		.Link('lower')
		.to('-inline-<div class="nouislider-tooltip bottom"></div>', function(value){
			$(this).html('<strong>' + value + ' dBm</strong>');
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

		this.$el.find('#o-select-channels').select2({
			placeholder: 'Select channels',
			multiple: true,
			data: channelData,
		});

		this.$el.find('#o-select-channels').select2('val', window.settings.place.charts.channels);
	},

	renderChart: function(){
		var self = this;
		var data = [];

		var dataGrouped = _.groupBy(this.data.charts, function(sample){
			return sample.frequency;
		});

		_.each(dataGrouped, function(itemSameFrequency){
			var passed = 0;
			_.each(itemSameFrequency, function(item){
				if(item.power >= self.threshold) passed += 1;
			});
			data.push({ frequency:itemSameFrequency[0].frequency, power:(passed/itemSameFrequency.length)*100 });
		});

		this.chart.render(data,this.chartOptions);

		_.each(window.settings.place.charts.channels,function(item){
			Backbone.pubSub.trigger('event-occupation-channel-select',item);
		});
	},

	render: function(){
		var template = Zebra.tmpl.occupation;
		var html = template({
			place: window.place.attributes, 
			bands: window.place.attributes.frequenciesBands.length > 1 ? true: false
		});
		this.$el.html(html);

		this.$el.find("#o-channel-width").select2({ 
			data: window.place.attributes.frequenciesChannelWidth 
		});
		this.$el.find("#o-channel-width").select2("val", window.settings.currChannel);
		this.$el.find('.captures-chart').html('<div class="ws-waiting-maps"><div class="spinner-maps"></div></div>');

		if(window.place.attributes.frequenciesBands.length > 1){
			this.$el.find("#o-frequency-bands").select2({ 
				data: window.place.attributes.frequenciesBands,
				multiple: true,
			});
			this.$el.find("#o-frequency-bands").select2("val", window.settings.currBand);
		}

		return this;
	},

});