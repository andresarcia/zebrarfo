var app = app || {};
app.view = app.view || {};

app.view.EditPlaceView = Backbone.View.extend({

	el: '#ws-containter',
	template: Handlebars.compile($("#su-edit-place-template").html()),
	currentData: null,
	currentMap: null,

	events: {
		'slide .markers-slider':'addMarkers',
		'click .su-create-new-edition-range': 'addEditionRange',
		'click .su-coord-to-edit': 'selectEditingArea'
	},

	initialize: function(options){
		var self = this;
		this.errorView = options.errorView;
		this.errorView.closeView();
		this.waitingView = options.waitingView;
		this.data = options.data;
		this.editMarkers = [];
		this.editMarkersIndex = 0;

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
		var markersRange = [];
		if(markers.length === 0)
			markersRange = [0];
		else if(markers.length == 1)
			markersRange = [markers[0].index];
		else if(markers.length == 2)
			markersRange = [markers[0].index, markers[1].index];

		this.renderMarkerSlider(markersRange);
		this.appendToEditingArea(markersRange);
	},

	addMarkers: function(){
		var markersRange = [];
		var index = this.markersSlider.val();
		if(typeof index === 'string')
			markersRange = [Number(index)];

		else if(index.constructor === Array)
			markersRange = [Number(index[0]),Number(index[1])];

		Backbone.pubSub.trigger('event-slider-changed-on-edit', markersRange);
		this.appendToEditingArea(markersRange);
	},

	appendToEditingArea: function(markersRange){
		var coordinates = {};

		if(markersRange.length == 1 && markersRange[0] === 0) {
			coordinates.from = {};
			coordinates.from.index = 'Please select a marker';

		} else if(markersRange.length == 1){
			coordinates.from = this.coordinates.models[0].attributes.coordinates[markersRange[0]];
			coordinates.from.index = markersRange[0];
		
		} else if(markersRange.length == 2){
			coordinates.from = this.coordinates.models[0].attributes.coordinates[markersRange[0]];
			coordinates.from.index = markersRange[0];
			coordinates.to = this.coordinates.models[0].attributes.coordinates[markersRange[1]];
			coordinates.to.index = markersRange[1];

			coordinates.distance = app.util.GetDistanceFromLatLonInKm(
                coordinates.from.latitude,
                coordinates.from.longitude,
                coordinates.to.latitude,
                coordinates.to.longitude);
			coordinates.distance = coordinates.distance.toFixed(1);
		}

		this.editMarkers[this.editMarkersIndex] = coordinates;
		this.renderEditingArea();
	},

	renderEditingArea: function(){
		var template = Handlebars.compile($("#su-list-coord-to-edit-template").html());
		var html = template({data: this.editMarkers});
		this.$el.find('#su-list-coord-to-edit').html(html);

		this.$el.find('.su-coord-to-edit').removeClass('active');
		this.$el.find('.su-coord-to-edit').eq(this.editMarkersIndex).addClass('active');
	},

	addEditionRange: function(){
		this.editMarkersIndex += 1;
		Backbone.pubSub.trigger('event-slider-changed-on-edit', []);
		this.renderMarkerSlider([0]);
		this.appendToEditingArea([0]);
	},

	selectEditingArea: function(evt){
		if($(evt.currentTarget).hasClass('active'))
			return;

		var index = this.$el.find('.su-coord-to-edit').index(evt.currentTarget);
		this.editMarkersIndex = index;

		this.$el.find('.su-coord-to-edit').removeClass('active');
		this.$el.find('.su-coord-to-edit').eq(this.editMarkersIndex).addClass('active');

		var markersRange = [];
		var currentMarkers = this.editMarkers[this.editMarkersIndex];

		if(currentMarkers.to)
			markersRange = [currentMarkers.from.index, currentMarkers.to.index];

		else if(currentMarkers.from.index.constructor === Number)
			markersRange = [currentMarkers.from.index];

		Backbone.pubSub.trigger('event-slider-changed-on-edit', markersRange);
		this.renderMarkerSlider(markersRange);
	}

});