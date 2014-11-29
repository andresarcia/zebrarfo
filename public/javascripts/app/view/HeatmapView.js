var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.HeatmapView = Backbone.View.extend({

	template: Handlebars.compile($("#heatmap-template").html()),
    heatmap: {
        map: null,
        bounds: null,
        heatmap: null,
        data: [],
        settings: {
            dataFunction: 'avg',
            opacity: 70,
            radius: 15,
        },
    },

    events: {
        'change .slider':'changeFrequencyRange',
        'change #select-channels':'changeChannelRange',
        'select2-removing #select-channels':'checkChannelRange',
        'change #select-function-operate':'changeDataFunction',
        'change .max-intensity-slider':'changeMaxIntensity',
        'change input:radio[name=select-change-data-by]':'changeFrequencyBy',
        'change .opacity-slider':'changeOpacity',
        'change .radius-slider':'changeRadius',
        'change #allocation-channel':'changeAllocationChannel',
    },
	
	initialize: function(options){
		var self = this;
		this.errorView = options.errorView;
		this.errorView.closeView();
		this.waitingView = options.waitingView;
        
        this.place = options.place.attributes;

        var tail = Math.round((this.place.frequencyMax - this.place.frequencyMin) * 0.10);

        this.boundaries = [];
        this.boundaries.push({
            from: this.place.frequencyMin + tail,
            to: this.place.frequencyMax - tail
        });

        this.heatmapDataProcessor = new com.spantons.util.HeatmapDataProcessor();
        this.heatmapDataProcessor.require(options.data.attributes);
	},

    render: function(){
        var html = this.template();
        this.$el.html(html);    

        return this;
    },

    renderComponents: function(){
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

        this.renderMaxIntensitySlider();

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
                'min': 10,
                'max': 25
            }
        });
        this.$el.find('.radius-slider').Link('lower').to('-inline-<div class="slider_tooltip slider_tooltip_down" style="width:50px;"></div>', function(value) {
            $(this).html(
                '<strong>' + value + 'px</strong>'
            );
        });

        this.slider = this.$el.find('.slider').noUiSlider({
            start: [this.boundaries[0].from,this.boundaries[0].to],
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

        this.$el.find("#allocation-channel").select2();
        this.$el.find("#allocation-channel").select2("val", window.appSettings.currentChannelAllocation);

        this.$el.find('.heatmap-select-channels').hide();
    },

    renderMaxIntensitySlider: function(){
        this.maxIntensitySlider = this.$el.find('.max-intensity-slider').noUiSlider({
            start: -120,
            step: 1,
            format: wNumb({
                decimals: 0
            }),
            range: {
                'min': -120,
                'max': 0
            }
        });
        this.$el.find('.max-intensity-slider').Link('lower').to('-inline-<div class="slider_tooltip slider_tooltip_down" style="width:65px;"></div>', function(value) {
            $(this).html(
                '<strong>' + value + ' dBm</strong>'
            );
        });
    },

    renderChannelInput: function(){
        var channelData = [];
        _.each(window.appSettings.fixedChannels[window.appSettings.currentChannelAllocation], function(channel){
            channelData.push({
                id: channel.from + '-' + channel.to,
                text: 'Channel ' + channel.tooltipText + ' [' + channel.from + '-' + channel.to + ']'});
        });

        this.$el.find('#select-channels').select2({
            placeholder: 'Select channels',
            multiple: true,
            data: channelData,
        });
        this.$el.find('#select-channels').select2('val', [channelData[0].id]);
    },

    changeDataFunction: function(){
        this.heatmap.settings.dataFunction = this.$el.find("#select-function-operate").select2("val");
        this.renderHeatmap(true);
    },

    changeMaxIntensity: function(){
        this.heatmap.settings.maxIntensity = this.heatmapDataProcessor.normalizeValue(this.maxIntensitySlider.val());
        if(this.heatmap.settings.maxIntensity < 1)
            this.heatmap.settings.maxIntensity = 1;
        this.renderHeatmap();
    },

    changeFrequencyBy: function(){
        var val = this.$el.find('input:radio[name=select-change-data-by]:checked').val();
        if(val === 'frequency'){
            this.$el.find('.heatmap-select-channels').hide();
            this.$el.find('.heatmap-slider-container').show();
            this.changeFrequencyRange();
        
        } if(val === 'channels'){
            this.$el.find('.heatmap-slider-container').hide();
            this.renderChannelInput();
            this.$el.find('.heatmap-select-channels').show();
            this.changeChannelRange();
        }
    },

    changeAllocationChannel: function(){
        window.appSettings.currentChannelAllocation = this.$el.find("#allocation-channel").select2("val");
        this.renderChannelInput();
        this.changeChannelRange();
    },

    changeFrequencyRange: function(){
        var self = this;
        this.boundaries = [];

        this.boundaries.push({
            from: Number(self.slider.val()[0]),
            to: Number(self.slider.val()[1])
        });
        this.renderHeatmap(true);
    },

    checkChannelRange: function(evt){
        if(this.$el.find("#select-channels").select2("val").length == 1)
            evt.preventDefault();
    },

    changeChannelRange: function(){
        var self = this;
        this.boundaries = [];

        _.each(this.$el.find("#select-channels").select2("val"), function(item){
            var boundaries = item.split("-");
            self.boundaries.push({
                from: Number(boundaries[0]),
                to: Number(boundaries[1])
            });
        });

        this.boundaries = _.sortBy(this.boundaries, function(item) { return item.to; });
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

        var myOptions = {
            mapTypeId: google.maps.MapTypeId.HYBRID,
            scaleControl: true,
            panControl: false,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.RIGHT_CENTER
            },
        };
        
        this.heatmap.map = new google.maps.Map(document.getElementById("map_canvas_heatmap"), myOptions);
        this.heatmap.bounds = new google.maps.LatLngBounds();
        google.maps.event.addListenerOnce(self.heatmap.map, 'idle', function(){
            google.maps.event.trigger(self.heatmap.map, 'resize');
            self.renderHeatmap(true,true);
        });

        this.waitingView.closeView();
	},

    renderHeatmap: function(updateData,center){
        var self = this;

        if (this.heatmap.heatmap)
            this.heatmap.heatmap.setMap(null);

        if(updateData){
            var data = this.heatmapDataProcessor.process(
                this.boundaries, 
                this.heatmap.settings.dataFunction
            );

            this.heatmap.settings.maxIntensity = this.heatmapDataProcessor.normalizeValue(data.max);
            this.maxIntensitySlider.val(data.max);

            self.heatmap.data = [];
            _.each(data.data, function(item) {
                var location = new google.maps.LatLng(item.lat, item.lng);

                self.heatmap.data.push({
                    location: location, 
                    weight: item.count 
                });

                var marker = new google.maps.Marker({
                    position: location,
                    map: self.heatmap.map,
                    // icon: self.icon1,
                    // animation: null,
                    // id: coordinate.id,
                    // index: index,
                    // title: 'lat:'+coordinate.latitude+' lng:'+coordinate.longitude,
                });
                marker.setVisible(false);

                self.heatmap.bounds.extend(marker.position);
            });

            if(center)
                this.heatmap.map.fitBounds(this.heatmap.bounds);
        }

        this.heatmap.heatmap = new google.maps.visualization.HeatmapLayer({
            data: this.heatmap.data,
            maxIntensity: this.heatmap.settings.maxIntensity,
            radius: Number(self.heatmap.settings.radius),
            opacity: self.heatmap.settings.opacity/100,
            gradient: ['rgba(0, 0, 0, 0)','#000000','#63328D','#145DF5','#00DADD','#00F24F','#FEF252','#FF8D33','#EE1F1A'],
        });

        this.heatmap.heatmap.setMap(this.heatmap.map);
    }

});