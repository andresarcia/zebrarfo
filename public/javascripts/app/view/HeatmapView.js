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
        markers: [],
        settings: {
            dataFunction: 'avg',
            opacity: 70,
            radius: 15,
            currentMarkerItem: 0,
            markersCount: 0,
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
        'slide .markers-slider':'changeMarker',
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

        this.frequencyBy = options.frequencyBy;
        if(options.channels)
            this.channels = options.channels;
        else
            this.channels = [];
	},

    renderComponents: function(data){
        this.heatmapDataProcessor.require({
            place: this.place,
            data: data.attributes
        });

        this.$el.find('.heatmap-settings').removeClass('disable-container');
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

        this.changeFrequencyBy(this.frequencyBy,false);
    },

    renderMarkersSlider: function(max){
        this.markersSlider = this.$el.find('.markers-slider').noUiSlider({
            start: this.heatmap.settings.currentMarkerItem,
            step: 1,
            orientation: "vertical",
            format: wNumb({
                decimals: 0
            }),
            range: {
                'min': 0,
                'max': max
            }
        }, true);
    },

    renderMaxIntensitySlider: function(){
        this.maxIntensitySlider = this.$el.find('.max-intensity-slider').noUiSlider({
            start: this.place.powerMax,
            step: 1,
            format: wNumb({
                decimals: 0
            }),
            range: {
                'min': -120,
                'max': 0
            }
        }, true);

        this.maxIntensitySlider.val(this.place.powerMax);
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

        if(this.channels === undefined || this.channels.length < 1){
            this.channels = [];
            this.channels.push(window.appSettings.fixedChannels[window.appSettings.currentChannelAllocation][0].from + '-' + window.appSettings.fixedChannels[window.appSettings.currentChannelAllocation][0].to);
        }

        this.$el.find('#select-channels').select2('val', this.channels);
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

    changeFrequencyBy: function(value,update){
        var val;
        if($.type(value) === "string")
            val = value;
        else if(value === undefined)
            val = 'frequency';
        else
            val = this.$el.find('input:radio[name=select-change-data-by]:checked').val();

        update = typeof update !== 'undefined' ? update : true;

        if(val === 'frequency'){
            this.$el.find('.heatmap-select-channels').hide();
            this.$el.find('.heatmap-slider-container').show();
            if(update)
                this.changeFrequencyRange();
        
        } if(val === 'channels'){
            this.$el.find('input:radio[name="select-change-data-by"]').filter('[value="channels"]').attr('checked', true);
            this.$el.find('.heatmap-slider-container').hide();
            this.renderChannelInput();
            this.$el.find('.heatmap-select-channels').show();
            if(update)
                this.changeChannelRange();
        }
    },

    updateDataByTab: function(options){
        this.frequencyBy = options.frequencyBy;
        this.channels = options.channels;
        this.$el.find("#allocation-channel").select2("val", window.appSettings.currentChannelAllocation);
        this.changeFrequencyBy(this.frequencyBy,true);
    },

    changeAllocationChannel: function(){
        window.appSettings.currentChannelAllocation = this.$el.find("#allocation-channel").select2("val");
        this.channels = [];
        this.channels.push(window.appSettings.fixedChannels[window.appSettings.currentChannelAllocation][0].from + '-' + window.appSettings.fixedChannels[window.appSettings.currentChannelAllocation][0].to);
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
        if(this.channels.length == 1)
            evt.preventDefault();
    },

    changeChannelRange: function(){
        var self = this;
        this.boundaries = [];
        this.channels = this.$el.find('#select-channels').select2("val"); 
        Backbone.pubSub.trigger('single-place-charts-change-channels',this.channels);

        _.each(this.channels, function(item){
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

    changeMarker: function(){
        var marker = this.heatmap.markers[this.heatmap.settings.currentMarkerItem];
        if(marker === undefined)
            return;

        marker.setVisible(false);

        this.heatmap.settings.currentMarkerItem = this.markersSlider.val();
        marker = this.heatmap.markers[this.heatmap.settings.currentMarkerItem];
        marker.setVisible(true);
    },

    disableMarker: function(){
        var marker = this.heatmap.markers[this.heatmap.settings.currentMarkerItem];
        if(marker === undefined)
            return;

        marker.setVisible(false);
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

            this.disableMarker();
            this.heatmap.data = [];
            this.heatmap.markers = [];

            _.each(data.data, function(item, index) {
                var location = new google.maps.LatLng(item.lat, item.lng);

                self.heatmap.data.push({
                    location: location, 
                    weight: item.count 
                });

                var infowindow = new google.maps.InfoWindow({
                    content: 'Latitude: ' + item.lat + '<br>Longitude: ' + item.lng + '<br>Weight: ' + self.heatmapDataProcessor.denormalizeValue(item.count) + ' dBm',
                });

                var marker = new google.maps.Marker({
                    position: location,
                    map: self.heatmap.map,
                    index: index,
                });

                google.maps.event.addListener(marker, 'mouseover', function() {
                    infowindow.open(self.heatmap.map, marker);
                });

                google.maps.event.addListener(marker, 'mouseout', function() {
                    infowindow.close();
                });

                if(index != self.heatmap.settings.currentMarkerItem)
                    marker.setVisible(false);

                self.heatmap.markers.push(marker);
                self.heatmap.bounds.extend(marker.position);
            });
            
            this.heatmap.settings.maxIntensity = this.heatmapDataProcessor.normalizeValue(this.place.powerMax);
            this.renderMaxIntensitySlider();
            this.renderMarkersSlider(data.data.length - 1);

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
    },

    render: function(){
        var html = this.template();
        this.$el.html(html);

        this.$el.find('.heatmap-settings').addClass('disable-container');
        this.$el.find('#map_canvas_heatmap').html('<div class="ws-waiting-maps"><div class="spinner-maps"></div></div>');

        return this;
    }

});