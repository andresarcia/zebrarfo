var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.PowerFrequenciesView = Backbone.View.extend({

	initialize: function(options){
		if (options.idCoord)
			this.idCoord = options.idCoord;
		else
			throw 'any idCoord';

		$('#coord-id-'+this.idCoord).find('.chart_power_frequency').html('<div class="ws-waiting-maps"><div class="spinner-maps"></div></div>');
		this.americanChannels = true;
	},

	appendChannels: function(chart){
		var self = this;
		var channels;

		if(this.americanChannels)
			channels = americanChannels;
		else
			channels = europeanChannels;
			
		_.each(channels, function(channel){
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
		var $tooltip = $('#coord-id-'+this.idCoord).find('.chart_tooltip');
		$tooltip.children().text(txt);
		$tooltip.css('left', parseInt(left) + 24 + 'px');
		$tooltip.show();
	},

	hideTooltip: function(){
		$('#coord-id-'+this.idCoord).find('.chart_tooltip').hide();
	},

	render: function(data,coordData){
		var self = this;
		var dataPlot = [];

		_.each(data,function(item){
			if(item.frequency)
				dataPlot.push([Math.round(item.frequency/1000),item.power]);
		});

		var chart = new Highcharts.Chart({	
	        chart: {
	        	renderTo: $('#coord-id-'+this.idCoord).find('.chart_power_frequency')[0],
	            type: 'line',
	            backgroundColor: null,
	            zoomType: 'x'
	        },
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
	                text: 'Frequencies (Mhz)'
	            },
	        },
	        yAxis: {
	            title: {
	                text: 'Power (dBm)'
	            },
	            plotLines:[{
			        value: coordData.powerAvg,
			        color: '#ff0000',
			        width:1,
			        zIndex:4,
			        label:{text:'Average power'}
			    }],
	        },
	        plotOptions: {
	            line: {
	                enableMouseTracking: true
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