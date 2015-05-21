var app = app || {};
app.view = app.view || {};

app.view.OccupationView = Backbone.View.extend({

	events: {
		'change .slider':'updateChart',
		'change #allocation-channel':'changeAllocationChannel',
		'change #select-channels':'pushChannelsFromInput',
		'select2-removed #select-channels':'popChannelFromInput',
		'click .build-heatmap-btn-container':'changeToHeatmap'
	},

	initialize: function(options){
		var self = this;
		this.errorView = options.errorView;
		this.waitingView = options.waitingView;

		this.data = window.place.attributes;
		this.threshold = this.data.powerAvg;

		this.chart = new app.view.PowerFrequenciesView({
			selector: '#chart_canvas_occupation',
			tooltipTop: 10,
			trackClick: true,
		});

		var isWifi = _.filter(window.place.attributes.frequenciesBands, function(item){
			return item == "2.4 GHz" || item == "5 GHz";
		});

		this.chartOptions = {
			chart: {
				type: isWifi.length > 0 ? 'column': 'areaspline',
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

		if(!window.settings.place.charts.channels)
			window.settings.place.charts.channels = [];

		Backbone.pubSub.off('event-power-frequencies-channel-select');
		Backbone.pubSub.on('event-power-frequencies-channel-select', this.pushChannelsFromGraph, this);
		Backbone.pubSub.off('event-power-frequencies-channel-deselect');
		Backbone.pubSub.on('event-power-frequencies-channel-deselect', this.popChannelsFromGraph, this);
	},

	changeToHeatmap: function(){
		Backbone.pubSub.trigger('single-place-change-to-heatmap');
	},

	changeAllocationChannel: function(){
		window.settings.currChannel = this.$el.find("#allocation-channel").select2("val");
		this.clearChannels();
		this.renderChart();
		this.renderChannelInput();
	},

	updateChart: function(){
		this.threshold = this.slider.val();
		this.renderChart();
	},

	updateDataByTab: function(){
		var self = this;

		if(this.chart.chart)
			this.chart.chart.destroy();

		setTimeout(function(){
			self.renderChart();
		}, 200);

		this.$el.find("#allocation-channel").select2("val", window.settings.currChannel);
		window.settings.currChannel = this.$el.find("#allocation-channel").select2("val");

		this.renderChannelInput();
	},

	pushChannelsFromGraph: function(data){
		var channels = window.settings.place.charts.channels;
		channels.push(data);
		this.$el.find('#select-channels').select2("val",channels);
		Backbone.pubSub.trigger('single-place-charts-change-channels',channels);
	},

	pushChannelsFromInput: function(evt){
		var channels = this.$el.find('#select-channels').select2("val"); 
		Backbone.pubSub.trigger('event-occupation-channel-select',evt.val[evt.val.length - 1]);
		Backbone.pubSub.trigger('single-place-charts-change-channels',channels);
	},

	popChannelsFromGraph: function(data){
		var channels = window.settings.place.charts.channels;
		channels = _.without(channels, data);
		this.$el.find('#select-channels').select2("val",channels);
		Backbone.pubSub.trigger('single-place-charts-change-channels',channels);
	},

	popChannelFromInput: function(evt){
		var channels = this.$el.find('#select-channels').select2("val"); 
		Backbone.pubSub.trigger('event-occupation-channel-deselect',evt.val);
		Backbone.pubSub.trigger('single-place-charts-change-channels',channels);
	},

	clearChannels: function(evt){
		this.$el.find('#select-channels').select2("val",[]);
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

		this.slider = this.$el.find('.slider').noUiSlider({
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

		this.$el.find('.slider')
		.Link('lower')
		.to('-inline-<div class="slider_tooltip up"></div>', function(value){
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

		this.$el.find('#select-channels').select2({
			placeholder: 'Select channels',
			multiple: true,
			data: channelData,
		});

		this.$el.find('#select-channels').select2('val', window.settings.place.charts.channels);
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
		var html = template();
		this.$el.html(html);

		this.$el.find("#allocation-channel").select2();
		this.$el.find("#allocation-channel").select2("val", window.settings.currChannel);
		this.$el.find('.chart_power_frequency').html('<div class="ws-waiting-maps"><div class="spinner-maps"></div></div>');

		return this;
	},

});