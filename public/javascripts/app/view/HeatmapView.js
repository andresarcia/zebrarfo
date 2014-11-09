var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.HeatmapView = Backbone.View.extend({

	template: Handlebars.compile($("#heatmap-template").html()),
    settings: {
        dataFunction: 'avg',
        opacity: 60,
        radius: 6,
        blur: 85,
        zoom: 13,
    },

    events: {
        'change .slider':'changeFrequencyRange',
        'change #select-function-operate':'changeDataFunction',
        'change .opacity-slider':'changeOpacity',
        'change .radius-slider':'changeRadius',
        'change .blur-slider':'changeBlur',
    },
	
	initialize: function(options){
		var self = this;
		this.errorView = options.errorView;
		this.errorView.closeView();
		this.waitingView = options.waitingView;
        
        this.heatmapDataProcessor = new com.spantons.util.HeatmapDataProcessor();
        this.heatmapDataProcessor.require(options.data.attributes.heatmapData);

        // this.occupationChart = new com.spantons.view.PowerFrequenciesView({selector: '#chart_canvas_occupation'});
        // this.occupationChartOptions = {
        //     chart: {
        //         type: 'areaspline',
        //     },
        //     yAxis: {
        //         min: 0,
        //         max: 1,
        //         tickInterval: 0.1,
        //         title: {
        //             text: 'Power (dBm)'
        //         }
        //     }
        // };

        this.heatmapData = options.data.attributes.heatmapData;
        this.place = options.data.attributes.place;
        // this.from = this.place.frequencyMin / 1000;
        // this.to = this.place.frequencyMax / 1000;
        this.from = 595;
        this.to = 895;
	},

    changeDataFunction: function(){
        this.settings.dataFunction = this.$el.find("#select-function-operate").select2("val");
        this.updateHeatmap();
    },

    changeOpacity: function(){
        this.settings.opacity = this.opacitySlider.val();
        this.updateHeatmap();
    },

    changeRadius: function(){
        this.settings.radius = this.radiusSlider.val();
        this.updateHeatmap();
    },

    changeBlur: function(){
        this.settings.blur = this.blurSlider.val();
        this.updateHeatmap();
    },

    changeFrequencyRange: function(){
        this.from = Number(this.slider.val()[0]);
        this.to = Number(this.slider.val()[1]);
        this.updateHeatmap();
    },

    renderComponents: function(){
        this.renderOccupationChart();
        this.renderSettings();
        this.updateHeatmap();
    },

    updateHeatmap: function(){
        // this.renderMap();
        this._renderMap();
    },

    renderOccupationChart: function(){
        var data = [];
        // _.each(this.heatmapDataProcessor.data, function(item){
        //     if(currentItem.frequency == item.frequency){
        //         if(item.power >= self.threshold)
        //             sum += 1;
        //         numberEachFrequency += 1;

        //     } else {
        //         if(sum === 0){
        //             numberEachFrequency = 1;
        //             if(item.power >= self.threshold)
        //                 sum = 1;
        //         }

        //         data.push({ frequency:item.frequency, power:sum/numberEachFrequency });
        //         currentItem = item;
        //         sum = 0;
        //         numberEachFrequency = 0;
        //     }
        // });
    },

    renderSettings: function(){
        this.$el.find("#select-function-operate").select2();
    
        this.opacitySlider = this.$el.find('.opacity-slider').noUiSlider({
            start: this.settings.opacity,
            step: 1,
            format: wNumb({
                decimals: 0
            }),
            range: {
                'min': 0,
                'max': 100
            }
        });
        this.$el.find('.opacity-slider').Link('lower').to('-inline-<div class="slider_tooltip slider_tooltip_down" style="width:50px;"></div>', function(value) {
            $(this).html(
                '<strong>' + value + '%</strong>'
            );
        });

        this.radiusSlider = this.$el.find('.radius-slider').noUiSlider({
            start: this.settings.radius,
            step: 1,
            format: wNumb({
                decimals: 0
            }),
            range: {
                'min': 0,
                'max': 10
            }
        });
        this.$el.find('.radius-slider').Link('lower').to('-inline-<div class="slider_tooltip slider_tooltip_down" style="width:50px;"></div>', function(value) {
            $(this).html(
                '<strong>' + value + '</strong>'
            );
        });

        this.blurSlider = this.$el.find('.blur-slider').noUiSlider({
            start: this.settings.blur,
            step: 1,
            format: wNumb({
                decimals: 0
            }),
            range: {
                'min': 0,
                'max': 100
            }
        });
        this.$el.find('.blur-slider').Link('lower').to('-inline-<div class="slider_tooltip slider_tooltip_down" style="width:50px;"></div>', function(value) {
            $(this).html(
                '<strong>' + value + '%</strong>'
            );
        });


        this.slider = this.$el.find('.slider').noUiSlider({
            start: [this.from,this.to],
            step: 1,
            behaviour: 'tap-drag',
            connect: true,
            format: wNumb({
                decimals: 0
            }),
            range: {
                'min': this.place.frequencyMin/1000,
                'max': this.place.frequencyMax/1000
            }
        });

        this.$el.find('.slider').Link('lower').to('-inline-<div class="slider_tooltip slider_tooltip_up"></div>', function(value) {
            $(this).html(
                '<strong>Value: </strong>' +
                '<span>' + value + ' MHz</span>'
            );
        });

        this.$el.find('.slider').Link('upper').to('-inline-<div class="slider_tooltip slider_tooltip_down"></div>', function(value) {
            $(this).html(
                '<strong>Value: </strong>' +
                '<span>' + value + ' MHz</span>'
            );
        });
    },

	renderMap: function(){
		var self = this;
		
		if(window.appSettings.googleMapApi)
			self._renderMap();
		else 
			Backbone.pubSub.on('event-loaded-google-map-api', function(){
				self._renderMap();
			});
	},

	_renderMap: function(){
        var self = this;
		this.waitingView.closeView();

        var data = this.heatmapDataProcessor.process({ from: this.from, to: this.to }, this.settings.dataFunction);

		var myLatlng = new google.maps.LatLng(data.data[Math.round(data.data.length/2)].lat, data.data[Math.round(data.data.length/2)].lng);
        
        var myOptions = {
          zoom: this.settings.zoom,
          center: myLatlng,
          mapTypeId: google.maps.MapTypeId.HYBRID,
        };
        
        var map = new google.maps.Map(document.getElementById("map_canvas_heatmap"), myOptions);
        var heatmap = new HeatmapOverlay(map, 
            {
                "radius": self.settings.radius,
                "opacity": self.settings.opacity/100, 
                "blur": self.settings.blur/100,
                "visible":true,
                // which field name in your data represents the data value - default "value"
                valueField: 'count'
            }
        );

        google.maps.event.addListenerOnce(map, "idle", function(){
            heatmap.setData({
                max: data.normalizeMax,
                data: data.data
            });
        });

        google.maps.event.addListener(map, 'zoom_changed', function() {
            self.settings.zoom = map.getZoom();
        });
	},

	render: function(){
		var html = this.template();
    	this.$el.html(html);	

		return this;
	}

});