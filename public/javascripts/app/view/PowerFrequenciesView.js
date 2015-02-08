var app = app || {};
app.view = app.view || {};

app.view.PowerFrequenciesView = Backbone.View.extend({

	initialize: function(options){
		if (options.selector)
			this.selector = options.selector;
		else
			throw 'any selector';

		this.tooltipTop = options.tooltipTop;
		this.trackClick = options.trackClick;

		$(this.selector).find('.chart_power_frequency').html('<div class="ws-waiting-maps"><div class="spinner-maps"></div></div>');

		Backbone.pubSub.on('event-occupation-channel-select', this.selectChannel, this);
		Backbone.pubSub.on('event-occupation-channel-deselect', this.deselectChannel, this);
	},

	appendChannels: function(chart){
		var self = this;
		
		_.each(window.settings.fixedChannels[window.settings.currentChannelAllocation], function(channel){
			channel.id = channel.from + '-' + channel.to;
			channel.events = {
				mouseover: function(e){
					self.mouseOnBand(e,this);
					self.showTooltip('Channel '+this.options.tooltipText + ' ['+this.options.from+','+this.options.to+']',this.svgElem.d.split(' ')[1]);
				},
				mouseout: function(e){
					self.mouseOnBand(e,this);
					self.hideTooltip();
				},
				click: function(e){
					if(self.trackClick)
						self.clickEvent(e,this);
				},
			};
			chart.xAxis[0].addPlotBand(channel);
		});
	},

	mouseOnBand: function(e,self){
		if (e.type == 'mouseover') {
    		self.svgElem.attr({
        		'stroke-width': 1,
        		stroke: Highcharts.Color(self.options.color).setOpacity(5).get(),
    		});
		} else {
    		self.svgElem.attr({
        		'stroke-width': 1,
        		stroke: 'transparent',
    		});
		}
	},

	showTooltip: function(txt,left){
		var $tooltip = $(this.selector).find('.chart_tooltip');
		$tooltip.children().text(txt);
		$tooltip.css('top', this.tooltipTop + 'px');
		$tooltip.css('left', parseInt(left) + 24 + 'px');
		$tooltip.show();
	},

	selectChannel: function(value){
		var self = this;
		_.each(this.chart.xAxis[0].plotLinesAndBands, function(band){
			if(band.id == value)
				self.selectBand(band);
		});
	},

	deselectChannel: function(value){
		var self = this;
		_.each(this.chart.xAxis[0].plotLinesAndBands, function(band){
			if(band.id == value)
				self.deselectBand(band);
		});
	},

	clickEvent: function(e,self){
		if(self.selected !== true){
			this.selectBand(self);
    		Backbone.pubSub.trigger('event-power-frequencies-channel-select',self.options.id);
		} else {
			this.deselectBand(self);
    		Backbone.pubSub.trigger('event-power-frequencies-channel-deselect',self.options.id);
		}
	},

	selectBand: function(band){
		band.selected = true;
		band.svgElem.attr({
			fill: Highcharts.Color(band.options.color).setOpacity(band.options.color != 'rgba(0, 0, 0, 0)' ? 0.7 : 0.3).get(),
		});
	},

	deselectBand: function(band){
		band.selected = undefined;
		band.svgElem.attr({
    		fill: Highcharts.Color(band.options.color).setOpacity(band.options.color != 'rgba(0, 0, 0, 0)' ? 0.2 : 0).get(),
		});
	},

	hideTooltip: function(){
		$(this.selector).find('.chart_tooltip').hide();
	},

	render: function(data,options){
		var self = this;
		var dataPlot = [];

		var chartOptions = {
			renderTo: $(this.selector).find('.chart_power_frequency')[0],
	        backgroundColor: null,
	        zoomType: 'x'
		};
		chartOptions = _.extend(chartOptions, options.chart);

		_.each(data,function(item){
			if(item.frequency)
				dataPlot.push([Math.round(item.frequency/1000),item.power]);
		});
		
		this.chart = new Highcharts.Chart({	
	        chart: chartOptions,
	        title: {
    			text: '',
    			style: {
        			display: 'none'
    			}
			},
			subtitle: {
            	text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' :
                    'Pinch the chart to zoom in'
        	},
			tooltip: {
				positioner: function(){
					if(options.tooltip.positioner)
                		return options.tooltip.positioner;
            	},
    			formatter: function(){
        			return this.x + '</b> : <b>' + (this.y).toFixed(3);
    			}
			},
	        xAxis: {
	            title: {
	                text: 'Frequencies (MHz)'
	            },
	        },
	        yAxis: options.yAxis,
	        plotOptions: {
	            line: {
	                enableMouseTracking: true
	            },
	            series: {
             	   fillOpacity: 0.35
            	},
	        },
	        series: [{
	        	showInLegend: false,
	            data: dataPlot,
	            states: {
                    hover: false
                },
                marker: {
                	lineWidth: 2,
                	radius: 6
            	},
	        }]
	    });

		this.appendChannels(this.chart);	

		return this;
	},

});