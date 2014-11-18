var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.HeatmapView = Backbone.View.extend({

	template: Handlebars.compile($("#heatmap-template").html()),
    heatmap: {
        map: null,
        heatmap: null,
        data: [],
        settings: {
            dataFunction: 'avg',
            opacity: 70,
            radius: 10,
            zoom: 13,
        },
    },

    events: {
        'change .slider':'changeFrequencyRange',
        'change #select-function-operate':'changeDataFunction',
        'change .opacity-slider':'changeOpacity',
        'change .radius-slider':'changeRadius',
    },
	
	initialize: function(options){
		var self = this;
		this.errorView = options.errorView;
		this.errorView.closeView();
		this.waitingView = options.waitingView;
        
        this.place = options.place.attributes;

        this.from = this.place.frequencyMin + 100;
        this.to = this.place.frequencyMax - 100;

        this.heatmapDataProcessor = new com.spantons.util.HeatmapDataProcessor();
        this.heatmapDataProcessor.require(options.data.attributes);

        // this.occupationChart = new com.spantons.view.PowerFrequenciesView({
            // selector: '#chart_canvas_occupation',
            // tooltipTop: 10,
        // });
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
	},

    render: function(){
        var html = this.template();
        this.$el.html(html);    

        return this;
    },

    renderComponents: function(){
        this.renderOccupationChart();
        this.renderSettings();
        this.renderMap();
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

    renderSettings: function(){
        this.$el.find("#select-function-operate").select2();
    
        this.opacitySlider = this.$el.find('.opacity-slider').noUiSlider({
            start: this.heatmap.settings.opacity,
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
            start: this.heatmap.settings.radius,
            step: 1,
            format: wNumb({
                decimals: 0
            }),
            range: {
                'min': 5,
                'max': 20
            }
        });
        this.$el.find('.radius-slider').Link('lower').to('-inline-<div class="slider_tooltip slider_tooltip_down" style="width:50px;"></div>', function(value) {
            $(this).html(
                '<strong>' + value + 'px</strong>'
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
                'min': this.place.frequencyMin,
                'max': this.place.frequencyMax
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

    changeDataFunction: function(){
        this.heatmap.settings.dataFunction = this.$el.find("#select-function-operate").select2("val");
        this.renderHeatmap(true);
    },

    changeFrequencyRange: function(){
        this.from = Number(this.slider.val()[0]);
        this.to = Number(this.slider.val()[1]);
        this.renderHeatmap(true);
    },

    changeOpacity: function(){
        this.heatmap.settings.opacity = this.opacitySlider.val();
        this.renderHeatmap();
    },

    changeRadius: function(){
        this.heatmap.settings.radius = this.radiusSlider.val();
        this.renderHeatmap();
    },

	_renderMap: function(){
        var self = this;
		this.waitingView.closeView();

        var myOptions = {
            zoom: this.heatmap.settings.zoom,
            mapTypeId: google.maps.MapTypeId.HYBRID,
            scaleControl: true,
            panControl: false,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.RIGHT_CENTER
            },
        };
        
        this.heatmap.map = new google.maps.Map(document.getElementById("map_canvas_heatmap"), myOptions);
        google.maps.event.addListenerOnce(self.heatmap.map, 'idle', function(){
            google.maps.event.trigger(self.heatmap.map, 'resize');
            self.renderHeatmap(true,true);
        });
	},

    renderHeatmap: function(updateData,center){
        var self = this;

        if (this.heatmap.heatmap)
            this.heatmap.heatmap.setMap(null);

        if(updateData){
            var data = this.heatmapDataProcessor.process(
                { 
                    from: this.from, 
                    to: this.to 
                }, 
                this.heatmap.settings.dataFunction
            );

            if(center){
                var latlng = new google.maps.LatLng(
                    data.data[Math.round(data.data.length/2)].lat, 
                    data.data[Math.round(data.data.length/2)].lng
                );
                
                this.heatmap.map.setCenter(latlng);
            }

            _.each(data.data, function(item) {
                self.heatmap.data.push({
                    location: new google.maps.LatLng(item.lat, item.lng), 
                    weight: item.count 
                });
            });
        }

        this.heatmap.heatmap = new google.maps.visualization.HeatmapLayer({
            data: this.heatmap.data,
            radius: Number(self.heatmap.settings.radius),
            opacity: self.heatmap.settings.opacity/100,
        });

        this.heatmap.heatmap.setMap(this.heatmap.map);
    }

});