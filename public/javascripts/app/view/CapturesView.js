var app = app || {};
app.view = app.view || {};

app.view.CapturesView = Backbone.View.extend({

	initialize: function(options){
		if (options.selector)
			this.selector = options.selector;
		else
			throw 'any selector';

		this.tooltipTop = options.tooltipTop;
		this.trackClick = options.trackClick;

		$(this.selector).find('.captures-chart').html(Zebra.tmpl.waiting_component());

		Backbone.pubSub.off('event-occupation-channel-select');
		Backbone.pubSub.on('event-occupation-channel-select', this.selectChannel, this);
		Backbone.pubSub.off('event-occupation-channel-deselect');
		Backbone.pubSub.on('event-occupation-channel-deselect', this.deselectChannel, this);
	},

	appendChannels: function(chart){
		var self = this;
		_.each(window.settings.fixedChannels[window.settings.currChannel], function(channel){
			channel.id = channel.from + '-' + channel.to;
			channel.events = {
				mouseover: function(e){
					self.mouseOnBand(e,this);
					// if wifi fix the channel width
					if(app.util.isWifi()){
						self.showTooltip('Channel '+this.options.tooltipText + ' ['+(this.options.from - 10)+','+(this.options.to + 10)+']',this.svgElem.d.split(' ')[1]);
					} else {
						self.showTooltip('Channel '+this.options.tooltipText + ' ['+this.options.from+','+this.options.to+']',this.svgElem.d.split(' ')[1]);
					}
				},
				mouseout: function(e){
					self.mouseOnBand(e,this);
					self.hideTooltip();
				},
				click: function(e){
					if(self.trackClick) self.clickEvent(e,this);
				},
			};

			// if wifi reduce the ch width for no overlap
			if(app.util.isWifi()){
				var ch = _.clone(channel);
				ch.from = ch.from + 10;
				ch.to = ch.to - 10;
				// don't plot ch for wifi line chart
				if(chart.options.chart.type){
					chart.xAxis[0].addPlotBand(ch);
					// set stroke to dashed
					var svg = _.last(chart.xAxis[0].plotLinesAndBands).svgElem;
					svg.attr({
						'stroke-width': 1,
						'stroke': "rgba(51, 51, 51, 0.3)",
						'stroke-dasharray': '10,10',
					});
				}
			} else {
				chart.xAxis[0].addPlotBand(channel);
			}
		});
	},

	mouseOnBand: function(e,self){
		if (e.type == 'mouseover') {
			if(app.util.isWifi()){
				self.svgElem.attr({
					'stroke': "rgba(51, 51, 51, 1)",
					'stroke-dasharray': '0,0',
				});
			} else {
				self.svgElem.attr({
					'stroke-width': 1,
					'stroke': Highcharts.Color(self.options.color).setOpacity(1).get(),
				});
			}
		} else {
			if(app.util.isWifi()){
				self.svgElem.attr({
					'stroke': "rgba(51, 51, 51, 0.3)",
					'stroke-dasharray': '10,10',
				});
			} else {
				self.svgElem.attr({
					'stroke-width': 1,
					stroke: 'transparent',
				});
			}
		}
	},

	showTooltip: function(txt,left){
		var $tooltip = $(this.selector).find('.high-chart-tooltip');
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
		if(app.util.isWifi()){
			band.svgElem.attr({
				'fill': Highcharts.Color(band.options.colorSelected).get(),
			});

		} else {
			band.svgElem.attr({
				'fill': Highcharts.Color(band.options.color).setOpacity(
					band.options.color != 'rgba(0, 0, 0, 0)' ? 0.7 : 0.3).get()
			});
		}
	},

	deselectBand: function(band){
		band.selected = undefined;
		if(app.util.isWifi()){
			band.svgElem.attr({
				'fill': Highcharts.Color(band.options.color).setOpacity(0).get(),
			});
		} else {
			band.svgElem.attr({
				'fill': Highcharts.Color(band.options.color).setOpacity(
					band.options.color != 'rgba(0, 0, 0, 0)' ? 0.2 : 0).get()
			});
		}
	},

	hideTooltip: function(){
		$(this.selector).find('.high-chart-tooltip').hide();
	},

	render: function(data, options){
		var self = this,
			dataPlot = [],
			chartOptions = {
				renderTo: $(this.selector).find('.captures-chart')[0],
				backgroundColor: null,
				zoomType: 'x'
			},
			xAxis = {
				title: {
					text: 'Frequencies (MHz)'
				},
			},
			yAxis = {
				stackLabels: !app.util.isWifi()? {} : {
					style: {
						color: 'rgba(0, 0, 0, 0.6)',
						fontWeight: "bold",
						fontSize: "13px"
					},
					enabled: true,
					formatter: function () {
						return app.util.WifiCentralFqMap(this.x);
					}
				}
			};


		chartOptions = _.extend(chartOptions, options.chart);
		xAxis = _.extend(xAxis, options.xAxis);
		yAxis = _.extend(yAxis, options.yAxis);

		// filter by bands
		var bands = _.sortBy(window.settings.currBand);
		// if all ([0]) in bands, then all bands
		if(Number(bands[0]) === 0){
			_.each(data,function(item){
				if(item.frequency) dataPlot.push([Math.round(item.frequency/1000),item.power]);
			});
		// else apply filter
		} else {
			var index = 0;
			var boundIndex = bands[index];
			_.find(data, function(item){
				var from = window.place.attributes.frequencies.bands[boundIndex].from;
				var to = window.place.attributes.frequencies.bands[boundIndex].to;
				var fq = item.frequency;

				if(fq >= from && fq <= to) dataPlot.push([Math.round(fq/1000),item.power]);
				if(fq > to) {
					if(index < bands.length - 1){
						index += 1;
						boundIndex = bands[index];
					} 
					else return item;
				}
			});
		}

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
					return this.x + '<b> : </b>' + (this.y).toFixed(1) + '%';
				}
			},
			xAxis: xAxis,
			yAxis: yAxis,
			plotOptions: {
				line: {
					enableMouseTracking: true,
					stacking: 'normal',
					dataLabels: {
						enabled: false
					}
				},
				column: {
					stacking: 'normal',
					dataLabels: {
						enabled: false
					}
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