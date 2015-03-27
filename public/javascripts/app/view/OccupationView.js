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
		this.chartOptions = {
			chart: {
				type: 'areaspline',
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

		if(options.channels)
			this.channels = options.channels;
		else
			this.channels = [];

		Backbone.pubSub.off('event-power-frequencies-channel-select');
		Backbone.pubSub.on('event-power-frequencies-channel-select', this.pushChannelsFromGraph, this);
		Backbone.pubSub.off('event-power-frequencies-channel-deselect');
		Backbone.pubSub.on('event-power-frequencies-channel-deselect', this.popChannelsFromGraph, this);
	},

	changeToHeatmap: function(){
		Backbone.pubSub.trigger('single-place-change-to-heatmap');
	},

	changeAllocationChannel: function(){
		window.settings.currentChannelAllocation = this.$el.find("#allocation-channel").select2("val");
		this.clearChannels();
		this.renderChart();
		this.renderChannelInput();
	},

	updateChart: function(){
		this.threshold = this.slider.val();
		this.renderChart();
	},

	updateDataByTab: function(data){
		var self = this;
		this.channels = data.channels;
		
		if(this.chart.chart)
			this.chart.chart.destroy();

		setTimeout(function(){
			self.renderChart();
		}, 200);

		this.$el.find("#allocation-channel").select2("val", window.settings.currentChannelAllocation);
		window.settings.currentChannelAllocation = this.$el.find("#allocation-channel").select2("val");
		
		if((this.channels === undefined || this.channels.length < 1) && data.frequencyBy === 'channels'){
			this.channels = [];
			this.channels.push(window.settings.fixedChannels[window.settings.currentChannelAllocation][0].from + '-' + window.settings.fixedChannels[window.settings.currentChannelAllocation][0].to);
		
		} else if(this.channels === undefined)
			this.channels = [];

		this.renderChannelInput();
	},

	pushChannelsFromGraph: function(data){
		var channels = this.channels;
		channels.push(data);
		this.channels = channels;
		this.$el.find('#select-channels').select2("val",this.channels);
		Backbone.pubSub.trigger('single-place-charts-change-channels',this.channels);
	},

	pushChannelsFromInput: function(evt){
		this.channels = this.$el.find('#select-channels').select2("val"); 
		Backbone.pubSub.trigger('event-occupation-channel-select',evt.val[evt.val.length - 1]);
		Backbone.pubSub.trigger('single-place-charts-change-channels',this.channels);
	},

	popChannelsFromGraph: function(data){
		var channels = this.channels;
		channels = _.without(channels, data);
		this.channels = channels;
		this.$el.find('#select-channels').select2("val",this.channels);
		Backbone.pubSub.trigger('single-place-charts-change-channels',this.channels);
	},

	popChannelFromInput: function(evt){
		this.channels = this.$el.find('#select-channels').select2("val"); 
		Backbone.pubSub.trigger('event-occupation-channel-deselect',evt.val);
		Backbone.pubSub.trigger('single-place-charts-change-channels',this.channels);
	},

	clearChannels: function(evt){
		this.channels = [];
		this.$el.find('#select-channels').select2("val",this.channels);
		Backbone.pubSub.trigger('single-place-charts-change-channels',this.channels);
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
		.to('-inline-<div class="slider_tooltip" style="top:-26px;left:-20px"></div>',function(value){
			$(this).html(
				'<strong>' + value + ' dBm</strong>'
			);
		});
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

		this.$el.find('#select-channels').select2('val', this.channels);
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

		_.each(this.channels,function(item){
			Backbone.pubSub.trigger('event-occupation-channel-select',item);
		});
	},

	render: function(){
		var template = Zebra.tmpl.occupation;
		var html = template();
		this.$el.html(html);

		this.$el.find("#allocation-channel").select2();
		this.$el.find("#allocation-channel").select2("val", window.settings.currentChannelAllocation);
		this.$el.find('.chart_power_frequency').html('<div class="ws-waiting-maps"><div class="spinner-maps"></div></div>');

		return this;
	},

});