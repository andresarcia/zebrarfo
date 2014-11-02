var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.HeatmapView = Backbone.View.extend({

	template: Handlebars.compile($("#heatmap-template").html()),

    dataFunction: {
        avg: 0,
        max: 1,
        none: 2
    },

    events: {
        'change .slider':'updateHeatmap',
    },
	
	initialize: function(options){
		var self = this;
		this.errorView = options.errorView;
		this.errorView.closeView();
		this.waitingView = options.waitingView;
        
        this.heatmapDataProcessor = new com.spantons.util.HeatmapDataProcessor();
        this.heatmapDataProcessor.require(options.data.attributes.heatmapData);

        this.heatmapData = options.data.attributes.heatmapData;
        this.place = options.data.attributes.place;
        // this.from = this.place.frequencyMin / 1000;
        // this.to = this.place.frequencyMax / 1000;
        this.from = 300;
        this.to = 600;
        this.currentDataFunction = this.dataFunction.avg;
	},

    updateHeatmap: function(){
        this.from = Number(this.slider.val()[0]);
        this.to = Number(this.slider.val()[1]);
        // this.renderMap();
        this._renderMap();
    },

    renderComponents: function(){
        this.renderSlider();
        // this.renderMap();
        this._renderMap();
    },

    renderSlider: function(){
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

        var data = this.heatmapDataProcessor.process({from:this.from,to:this.to},'avg');

		var myLatlng = new google.maps.LatLng(data.data[data.data.length-1].lat, data.data[data.data.length-1].lng);
        // map options,
        var myOptions = {
          zoom: 13,
          center: myLatlng,
          mapTypeId: google.maps.MapTypeId.HYBRID,
        };
        // standard map
        var map = new google.maps.Map(document.getElementById("map_canvas_heatmap"), myOptions);
        // heatmap layer
        var heatmap = new HeatmapOverlay(map, 
          {
            // radius should be small ONLY if scaleRadius is true (or small radius is intended)
            "radius": 8,
            "maxOpacity": 1, 
            // scales the radius based on map zoom
            // "scaleRadius": true, 
                            "visible":true,
            // if set to false the heatmap uses the global maximum for colorization
            // if activated: uses the data maximum within the current map boundaries 
            //   (there will always be a red spot with useLocalExtremas true)
            "useLocalExtrema": false,
            // which field name in your data represents the latitude - default "lat"
            latField: 'lat',
            // which field name in your data represents the longitude - default "lng"
            lngField: 'lng',
            // which field name in your data represents the data value - default "value"
            valueField: 'count'
          }
        );

        // console.log(data.max);
        // heatmap.setData(testData);
        google.maps.event.addListenerOnce(map, "idle", function(){
            heatmap.setData({
                max: data.max,
                data: data.data
            });
        });
	},

	render: function(){
		var html = this.template();
    	this.$el.html(html);	

		return this;
	}

});