var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.OccupationView = Backbone.View.extend({

	template: Handlebars.compile($("#occupation-template").html()),

	events: {
		'change .slider':'updateChart',
		'slide .slider':'updateThreshold',
		'click .build-heatmap-btn-container':'changeToHeatmap'
	},

	initialize: function(options){
		var self = this;
		this.errorView = options.errorView;
		this.errorView.closeView();
		this.waitingView = options.waitingView;

		this.powerMin = options.data.attributes.place.powerMin;
		this.powerMax = options.data.attributes.place.powerMax;
		this.powerAvg = options.data.attributes.place.powerAvg.toFixed(0);
		this.numberPowerFrequency = options.data.attributes.place.numberPowerFrequency;
		this.occupation = options.data.attributes.occupation;

		this.threshold = this.powerAvg;

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

	updateThreshold: function(){
		this.$el.find('.slider-value').html('<strong>Value </strong>'+this.slider.val()+' dBm');
	},

	renderComponents: function(){
		this.renderSlider();
		this.renderChart();
		this.$el.find('.chart_tooltip').css('top','45px');
	},

	renderSlider: function(){
		this.slider = this.$el.find('.slider').noUiSlider({
			start: this.powerAvg,
			step: 1,
			range: {
				'min': this.powerMin,
				'max': this.powerMax
			}
		});
		this.$el.find('.slider-value').html('<strong>Value </strong>'+this.powerAvg+' dBm');
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