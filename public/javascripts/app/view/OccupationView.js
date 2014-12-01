var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.OccupationView = Backbone.View.extend({

	template: Handlebars.compile($("#occupation-template").html()),

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
		this.errorView.closeView();
		this.waitingView = options.waitingView;

		this.place = options.place.attributes;
		this.occupation = options.data.attributes;
		this.threshold = this.place.powerAvg;

		this.chart = new com.spantons.view.PowerFrequenciesView({
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
            	max: 1.1,
            	
            	endOnTick: false,
            	showLastLabel: false,

            	tickInterval: 0.1,
            	title: {
	                text: 'Power (dBm)'
	            }
			}
		};

		if(options.channels)
			this.channels = options.channels;
		else
			this.channels = [];

		Backbone.pubSub.on('event-power-frequencies-channel-select', this.pushChannelsFromGraph, this);
		Backbone.pubSub.on('event-power-frequencies-channel-deselect', this.popChannelsFromGraph, this);
	},

	changeToHeatmap: function(){
		Backbone.pubSub.trigger('single-place-change-to-heatmap');
	},

	changeAllocationChannel: function(){
		window.appSettings.currentChannelAllocation = this.$el.find("#allocation-channel").select2("val");
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

		this.chart.chart.destroy();
		setTimeout(function(){
        	self.renderChart();
        }, 200);

		this.$el.find("#allocation-channel").select2("val", window.appSettings.currentChannelAllocation);
		window.appSettings.currentChannelAllocation = this.$el.find("#allocation-channel").select2("val");
		

		if((this.channels === undefined || this.channels.length < 1) && data.frequencyBy === 'channels'){
            this.channels = [];
            this.channels.push(window.appSettings.fixedChannels[window.appSettings.currentChannelAllocation][0].from + '-' + window.appSettings.fixedChannels[window.appSettings.currentChannelAllocation][0].to);
        
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
		this.renderSlider();
		this.renderChannelInput();
		this.renderChart();
	},

	renderSlider: function(){
		var self = this;

		this.slider = this.$el.find('.slider').noUiSlider({
			start: this.place.powerAvg,
			step: 1,
			range: {
				'min': self.place.powerMin,
				'max': self.place.powerMax
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
        _.each(window.appSettings.fixedChannels[window.appSettings.currentChannelAllocation], function(channel){
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
		var currentItem = this.occupation[0];
		var sum = 0;
		var numberEachFrequency = 0;

		_.each(this.occupation, function(item){
			if(currentItem.frequency == item.frequency){
				if(item.power >= self.threshold)
					sum += 1;
				numberEachFrequency += 1;

			} else {
				if(sum === 0){
					numberEachFrequency = 1;
					if(item.power >= self.threshold)
						sum = 1;
				}

				data.push({ frequency:item.frequency, power:sum/numberEachFrequency });
				currentItem = item;
				sum = 0;
				numberEachFrequency = 0;
			}
		});

		this.chart.render(data,this.chartOptions);		

		_.each(this.channels,function(item){
			Backbone.pubSub.trigger('event-occupation-channel-select',item);
		});

		this.waitingView.closeView();
	},

	render: function(){
		var html = this.template();
    	this.$el.html(html);	

    	this.$el.find("#allocation-channel").select2();
    	this.$el.find("#allocation-channel").select2("val", window.appSettings.currentChannelAllocation);

		return this;
	},

});