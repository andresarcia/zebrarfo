var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.PowerFrequenciesView = Backbone.View.extend({

	initialize: function(options){
		if (options.selector)
			this.selector = options.selector;
		else
			throw 'any selector';

		$(this.selector).find('.chart_power_frequency').html('<div class="ws-waiting-maps"><div class="spinner-maps"></div></div>');
		this.americanChannels = true;
	},

	appendChannels: function(chart){
		var self = this;
			
		_.each(window.appSettings.channels[window.appSettings.currentChannelAllocation], function(channel){
			channel.events = {
				mouseover: function(e){
					self.mouseOnBand(e,this);
					self.showTooltip(this.options.tooltipText,this.svgElem.d.split(' ')[1]);
				},
				mouseout: function(e){
					self.mouseOnBand(e,this);
					self.hideTooltip();
				}
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
		$tooltip.css('left', parseInt(left) + 24 + 'px');
		$tooltip.show();
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
		
		var chart = new Highcharts.Chart({	
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
    			formatter: function() {
        			return this.x + '</b> : <b>' + this.y;
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
            	}
	        },
	        series: [{
	        	showInLegend: false,
	            data: dataPlot
	        }]
	    });

		this.appendChannels(chart);
		
		return this;
	},

});