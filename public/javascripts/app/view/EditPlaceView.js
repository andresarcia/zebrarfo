var app = app || {};
app.view = app.view || {};

app.view.EditPlaceView = Backbone.View.extend({

	el: '#ws-containter',
	template: Handlebars.compile($("#su-edit-place-template").html()),
	currentData: null,
	currentMap: null,

	events: {
		'slide .markers-slider':'addMarkersBySlider',
		'click .su-edit-remove-from-list': 'removeEditionRange',
		'click .su-create-new-edition-range': 'addEditionRange',
		'click .su-delete-coordinates': '_deleteCoordinates',
		'click .su-inverse-coordinates': '_inverseCoordinates',
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

		Backbone.pubSub.on('event-glass-pane-clicked', this.restore, this);
	},

	render: function(){
		var html = this.template(this.data);
    	this.$el.html(html);

		return this;
	},

	renderMarkerSlider: function(start){
		this.markersSlider = this.$el.find('.markers-slider').noUiSlider({
            start: start.length > 0 ? start:0,
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

	renderEditingArea: function(){
		var self = this;
		var template = Handlebars.compile($("#su-list-coord-to-edit-template").html());
		var html;

		if(this.editMarkers.length > 0){
			
			var data;
			var hidden = false;
			if(this.editMarkersIndex < 2)
				data = this.editMarkers;
			
			else {
				data = [this.editMarkers[this.editMarkersIndex - 1], this.editMarkers[this.editMarkersIndex]];
				hidden = true;
			}

			if(this.editMarkers[this.editMarkersIndex].editable === false)
				html = template({
					data: data, 
					create: true, 
					hidden: hidden, 
					hiddenNumber: this.editMarkers.length - data.length 
				});
			else
				html = template({
					data: data,
					hidden: hidden, 
					hiddenNumber: this.editMarkers.length - data.length 
				});
			
			this.$el.find('#su-list-coord-to-edit').html(html);

			_.each(data, function(item, index){
				if(item.editable === false)
					self.renderRestore(index);
			});

		} else {
			html = template();
			this.$el.find('#su-list-coord-to-edit').html(html);
			this.$el.find('.action-btn').prop('disabled', true);
		}
	},

	renderRestore: function(index){
		var restore = new app.view.GlassPaneView({
			container: this.$el.find('.su-coord-to-edit').eq(index),
			icon: 'glyphicon-arrow-left',
			iconSize: '2'
		});
		restore.toggle();
	},

	renderAfterLoad: function(){
		this.mapView = new app.view.GoogleMapMarkersWithHeatmapView({
			idContainer: 'map_canvas_coordinates'
		});
		this.renderMarkerSlider(0);
		this.renderMap();
		this.renderEditingArea();
	},

	changeSliderByMarkers: function(markers){
		if(this.editMarkers[this.editMarkersIndex] && this.editMarkers[this.editMarkersIndex].editable === false){
			Backbone.pubSub.trigger('event-slider-changed-on-edit', []);
			return;
		}

		var markersRange = [];
		if(markers.length === 0)
			markersRange = [0];
		else if(markers.length == 1)
			markersRange = [markers[0].index];
		else if(markers.length == 2)
			markersRange = [markers[0].index, markers[1].index];

		this.renderMarkerSlider(markersRange);
		this.appendToEditingArea(markersRange);
		this.$el.find('.action-btn').prop('disabled', false);
	},

	addMarkersBySlider: function(){
		if(this.editMarkers[this.editMarkersIndex] && this.editMarkers[this.editMarkersIndex].editable === false){
			this.renderMarkerSlider([0]);
			return;
		}

		var markersRange = [];
		var index = this.markersSlider.val();
		if(typeof index === 'string')
			markersRange = [Number(index)];

		else if(index.constructor === Array)
			markersRange = [Number(index[0]),Number(index[1])];

		Backbone.pubSub.trigger('event-slider-changed-on-edit', markersRange);
		this.appendToEditingArea(markersRange);
		this.$el.find('.action-btn').prop('disabled', false);
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

	removeEditionRange: function(){
		this.editMarkers.splice(this.editMarkersIndex, 1);
		if(this.editMarkersIndex > 0)
			this.editMarkersIndex -= 1;
		else 
			this.editMarkersIndex = 0;
			
		Backbone.pubSub.trigger('event-slider-changed-on-edit', []);
		this.renderMarkerSlider([0]);
		this.renderEditingArea();
		this.$el.find('.action-btn').prop('disabled', true);
	},

	getMarkersIndex: function(){
		var markersRange = [];
		var currentMarkers = this.editMarkers[this.editMarkersIndex];

		if(currentMarkers === undefined)
			return markersRange;

		if(currentMarkers.to)
			markersRange = [currentMarkers.from.index, currentMarkers.to.index];

		else if(currentMarkers.from.index.constructor === Number)
			markersRange = [currentMarkers.from.index];

		return markersRange;
	},

	addEditionRange: function(){
		if(this.editMarkers.length !== 0)
			this.editMarkersIndex += 1;
		Backbone.pubSub.trigger('event-slider-changed-on-edit', []);
		this.renderMarkerSlider([0]);
		this.appendToEditingArea([0]);
		this.$el.find('.action-btn').prop('disabled', true);
	},


	_deleteCoordinates: function(){
		this.editMarkers[this.editMarkersIndex].action = 'delete';
		this.editMarkers[this.editMarkersIndex].editable = false;
		this.mapView.hideMarkers(this.getMarkersIndex());
		this.addEditionRange();
	},

	_inverseCoordinates: function(){
		var indexes = this.getMarkersIndex();
		Backbone.pubSub.trigger('event-inverse-markers-google-map', indexes);
	},

	restore: function(){
		this.removeEditionRange();
		this.editMarkers[this.editMarkersIndex].editable = true;

		var indexes = this.getMarkersIndex();

		switch (this.editMarkers[this.editMarkersIndex].action) {
			case 'delete':
				this.mapView.showMarkers(indexes);
				Backbone.pubSub.trigger('event-slider-changed-on-edit', indexes);
				this.renderMarkerSlider(indexes);
				break;
		}

		this.$el.find('.action-btn').prop('disabled', false);
		this.renderEditingArea();
	},

	deleteCoordinates: function(evt){
		// var self = this;
		// this.waitingView.render();

		// var coordinates = new app.collection.Coordinates({idPlace:this.data.id});
		// for (var i = this.editMarkers[this.editMarkersIndex].from.index; i <= this.editMarkers[this.editMarkersIndex].to.index; i++) {

		// 	var id = this.coordinates.models[0].attributes.coordinates[i].id;
		// 	var index = this.coordinates.models[0].attributes.coordinates[i].index;
		// 	console.log(id);
		// 	var coordinate = new app.model.Coordinate({id:id});
		// 	coordinate.urlRoot = '/api/places/'+this.data.id+'/coordinates/';
		// 	coordinate.destroy({
		// 		success: function(model, response) {
		// 			self.coordinates.models[0].attributes.coordinates.splice(index, 1);
		// 		},
		// 		error: function(e){
		// 			self.waitingView.closeView();
		// 			self.errorView.render(['Sorry, something went wrong try again in a few seconds!']);
		// 		}
		// 	});
		// }

		// this.removeEditionRange();
	},

});