var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.OccupationView = Backbone.View.extend({

	template: Handlebars.compile($("#occupation-template").html()),

	events: {
		'change .slider':'updateChart',
		'click .build-heatmap-btn-container':'changeToHeatmap'
	},

	initialize: function(options){
		var self = this;
		this.errorView = options.errorView;
		this.errorView.closeView();
		this.waitingView = options.waitingView;

		this.place = options.data.attributes.place;
		this.occupation = options.data.attributes.occupation;
		this.threshold = this.place.powerAvg;

		this.chart = new com.spantons.view.PowerFrequenciesView({selector: '#chart_canvas_occupation'});
		this.chartOptions = {
			chart: {
				type: 'areaspline',
			},
			yAxis: {
				min: 0,
            	max: 1,
            	tickInterval: 0.1,
            	title: {
	                text: 'Power (dBm)'
	            }
			}
		};
	},

	changeToHeatmap: function(){
		Backbone.pubSub.trigger('changeChart',1);
	},

	updateChart: function(){
		this.threshold = this.slider.val();
		this.renderChart();
	},

	renderComponents: function(){
		this.renderSlider();
		this.renderChart();
	},

	renderSlider: function(){
		this.slider = this.$el.find('.slider').noUiSlider({
			start: this.place.powerAvg.toFixed(0),
			step: 1,
			range: {
				'min': this.place.powerMin,
				'max': this.place.powerMax
			},
			format: wNumb({
                decimals: 0
            }),
		});

		this.$el.find('.slider')
		.Link('lower')
		.to('-inline-<div class="slider_tooltip slider_tooltip_up"></div>',function(value){
			$(this).html(
	        	'<strong>Value: </strong>' +'<span>' + value + ' dBm</span>'
	    	);
		});
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

		this.waitingView.closeView();
		this.chart.render(data,this.chartOptions);		
	},

	render: function(){
		var html = this.template();
    	this.$el.html(html);	

		return this;
	},

});