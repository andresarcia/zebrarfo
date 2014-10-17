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
	},

	transformToX: function(){

	},

	render: function(data,coordData){
		var dataPlot = [];

		_.each(data,function(item){
			if(item.frequency)
				dataPlot.push([Math.round(item.frequency/1000),item.power]);
		});

		$('#coord-id-'+this.idCoord).find('.chart_power_frequency').highcharts({
	        chart: {
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
	            plotBands: americanChannels
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

		return this;
	},

});