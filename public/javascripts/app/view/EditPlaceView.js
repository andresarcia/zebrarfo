var app = app || {};
app.view = app.view || {};

app.view.EditPlaceView = Backbone.View.extend({

	el: '#ws-containter',
	template: Handlebars.compile($("#su-edit-place-template").html()),
	currentData: null,
	currentMap: null,

	events: {
		'slide .markers-slider':'addMarkers',
	},

	initialize: function(options){
		var self = this;
		this.errorView = options.errorView;
		this.errorView.closeView();
		this.waitingView = options.waitingView;
		this.data = options.data;

		this.render();

		if(window.appRouter.currentData.innerData.coordinates) {
			this.coordinates = window.appRouter.currentData.innerData.coordinates;
			self.renderAfterLoad();
		
		} else {
			this.waitingView.render();
			this.coordinates = new app.collection.Coordinates({idPlace:this.data.id});
			this.coordinates.fetch({
				success: function(e){          
					window.appRouter.currentData.innerData.coordinates = self.coordinates;
					self.waitingView.closeView();
			        self.renderAfterLoad();
			     },
			     error: function(e){  
			     	self.waitingView.closeView();
			     	self.errorView.render(['Sorry, we cannot find that!']);
			     }
			});
		}

		Backbone.pubSub.on('event-marker-selected-on-google-map-edit', function(markers){
			this.changeSliderByMarkers(markers);
		}, this);
	},

	renderMarkerSlider: function(start){
		this.markersSlider = this.$el.find('.markers-slider').noUiSlider({
            start: start,
            step: 1,
            connect: start.length > 1 ? true : false,
            behaviour: 'drag',
            orientation: "vertical",
            format: wNumb({
                decimals: 0
            }),
            range: {
                'min': 0,
                'max': this.coordinates.models[0].attributes.coordinates.length - 1
            }
        }, true);

        // .noUi-vertical .noUi-handle
        // heigth
        // .noUi-handle:before, .noUi-handle:after
        // top
	},

	renderMap: function(){
		var self = this;

		if(window.appSettings.googleMapApi)
			this.mapView.render(this.coordinates.models[0].attributes.coordinates);
		else 
			Backbone.pubSub.on('event-loaded-google-map-api', function(){
				self.mapView.render(self.coordinates.models[0].attributes.coordinates);
			});
	},

	renderAfterLoad: function(){
		this.mapView = new app.view.GoogleMapMarkersWithHeatmapView({
			idContainer: 'map_canvas_coordinates'
		});
		this.renderMarkerSlider(0);
        this.renderMap();
	},

	render: function(){
		var html = this.template(this.data);
    	this.$el.html(html);

		return this;
	},

	changeSliderByMarkers: function(markers){
		if(markers.length === 0)
			this.renderMarkerSlider(0);
		else if(markers.length == 1)
			this.renderMarkerSlider(markers[0].index);
		else if(markers.length == 2)
			this.renderMarkerSlider([markers[0].index, markers[1].index]);
	},

	addMarkers: function(){
		var index = this.markersSlider.val();
		if(typeof index === 'string')
			Backbone.pubSub.trigger('event-slider-changed-on-edit', [Number(index)]);

		else if(index.constructor === Array)
			Backbone.pubSub.trigger('event-slider-changed-on-edit', [Number(index[0]),Number(index[1])]);
	},

});