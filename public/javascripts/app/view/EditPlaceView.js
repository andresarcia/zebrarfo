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
		'click .su-delete-coord': '_deleteCoord',
		'click .su-select-first-coord': '_selectFirstCoord',
		'click .su-select-last-coord': '_selectLastCoord',
		'click .su-save-save': 'save',
		'click .su-save-save-as': 'saveAs',
	},

	initialize: function(options){
		this.errorView = options.errorView;
		this.errorView.closeView();
		this.waitingView = options.waitingView;
		this.data = options.data;
		this.editMarkers = [];
		this.editMarkersIndex = 0;

		this.render();
		this.coordinates = _.clone(this.data.attributes.coordinates);
		this.calculateRealCoorDict();
		this.calculateRelativeCoorDict();
		this.renderAfterLoad();
		
		Backbone.pubSub.on('event-marker-selected-on-google-map-edit', function(markers){
			this.changeSliderByMarkers(markers);
		}, this);

		Backbone.pubSub.on('event-glass-pane-clicked', this.restore, this);
	},

	calculateRealCoorDict: function(){
		var self = this;
		this.realCoorDict = {};
		_.each(this.coordinates, function(item, index){
			self.realCoorDict[item.id] = index;
		});
	},

	calculateRelativeCoorDict: function(){
		var self = this;
		this.relativeCoorDict = {};
		_.each(this.coordinates, function(item, index){
			self.relativeCoorDict[item.id] = index;
		});
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
                'max': this.coordinates.length - 1
            }
        }, true);
	},

	renderMap: function(){
		var self = this;

		if(window.appSettings.googleMapApi)
			this.mapView.render(this.coordinates);
		else 
			Backbone.pubSub.on('event-loaded-google-map-api', function(){
				self.mapView.render(self.coordinates);
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
			if(this.editMarkersIndex > 0)
				this.$el.find('.save-btn').prop('disabled', false);
			else
				this.$el.find('.save-btn').prop('disabled', true);

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
			this.mapView.changeMarkers([]);
			return;
		}

		var markersRange = [];
		if(markers.length === 0){
			this.setZero();
			return;
		
		} else if(markers.length == 1)
			markersRange = [markers[0].id];
		else if(markers.length == 2)
			markersRange = [markers[0].id, markers[1].id];

		markersRange = this.realIndex2Relative(markersRange);
		
		this.renderMarkerSlider(markersRange);
		this.appendToEditingArea(markersRange);
		this.checkPositionButtons();
		this.$el.find('.action-btn').prop('disabled', false);
	},

	realIndex2Relative: function(v){
		var self = this;
		var n = [];

		_.each(v, function(item){
			n.push(self.relativeCoorDict[item]);
		});

		return n;
	},

	addMarkersBySlider: function(){
		if(this.editMarkers[this.editMarkersIndex] && this.editMarkers[this.editMarkersIndex].editable === false){
			this.renderMarkerSlider([0]);
			return;
		}

		var markersRange = this.getSliderVal();
		this.mapView.changeMarkers(this.relativeIndex2Real(markersRange));
		this.appendToEditingArea(markersRange);
		this.checkPositionButtons();
		this.$el.find('.action-btn').prop('disabled', false);
	},

	getSliderVal: function(){
		var n = [];
		var index = this.markersSlider.val();
		if(typeof index === 'string')
			n = [Number(index)];

		else if(index.constructor === Array)
			n = [Number(index[0]),Number(index[1])];

		return n;
	},

	relativeIndex2Real: function(v){
		var self = this;
		var n = [];

		_.each(v, function(item){
			n.push(self.realCoorDict[self.coordinates[item].id]);
		});

		return n;
	},

	appendToEditingArea: function(markersRange){
		var coordinates = {};

		if(!markersRange) {
			coordinates.from = {};
			coordinates.from.index = 'Please select a marker';

		} else if(markersRange.length == 1){
			coordinates.from = this.coordinates[markersRange[0]];
			coordinates.from.index = markersRange[0];
		
		} else if(markersRange.length == 2){
			coordinates.from = this.coordinates[markersRange[0]];
			coordinates.from.index = markersRange[0];
			coordinates.to = this.coordinates[markersRange[1]];
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
			
		this.mapView.changeMarkers([]);
		this.renderMarkerSlider([0]);
		this.renderEditingArea();
		this.$el.find('.action-btn').prop('disabled', true);
		this.$el.find('.select-btn').removeClass('active');
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
		this.setZero();
		this.appendToEditingArea();
	},

	setZero: function(){
		this.mapView.changeMarkers([]);
		this.renderMarkerSlider([0]);
		this.appendToEditingArea();
		this.$el.find('.action-btn').prop('disabled', true);
	},

	setValues: function(n){
		this.renderMarkerSlider(n);
		this.mapView.changeMarkers(this.relativeIndex2Real(n));
		this.appendToEditingArea(n);
		this.$el.find('.action-btn').prop('disabled', false);
	},

	_deleteCoord: function(){
		this.editMarkers[this.editMarkersIndex].action = 'delete';
		this.editMarkers[this.editMarkersIndex].editable = false;
		this.editMarkers[this.editMarkersIndex].coordinates = _.clone(this.coordinates);

		this.mapView.hideMarkers(this.relativeIndex2Real(this.getMarkersIndex()));

		var v = this.getMarkersIndex();
		if(v.length == 1)
			this.coordinates.splice(v[0], 1);

		else {
			for (var i = v[1]; i >= v[0]; i--)
				this.coordinates.splice(i, 1);
		}

		this.renderMarkerSlider(0);
		this.addEditionRange();
		this.calculateRelativeCoorDict();
		this.$el.find('.select-btn').removeClass('active');
	},

	restore: function(){
		this.removeEditionRange();
		this.editMarkers[this.editMarkersIndex].editable = true;

		var indexes = this.getMarkersIndex();

		switch (this.editMarkers[this.editMarkersIndex].action) {
			case 'delete':
				this.coordinates = this.editMarkers[this.editMarkersIndex].coordinates;
				this.calculateRelativeCoorDict();
				this.mapView.showMarkers(this.relativeIndex2Real(indexes));
				this.mapView.changeMarkers(this.relativeIndex2Real(indexes));
				this.renderMarkerSlider(indexes);
				break;
		}

		this.$el.find('.action-btn').prop('disabled', false);
		this.renderEditingArea();
	},

	_selectFirstCoord: function(evt){
		var v = this.getSliderVal();

		if($(evt.currentTarget).hasClass('active')){
			$(evt.currentTarget).removeClass('active');

			if(v.length == 1 && v[0] === 0)
				this.setZero();
			else if(v.length == 2 && v[0] === 0)
				this.setValues([v[1]]);

		} else {
			$(evt.currentTarget).addClass('active');
			if(v.length == 1 && v[0] === 0)
				this.setValues([0]);
			else if(v.length == 1 && v[0] !== 0)
				this.setValues([0,v[0]]);
			else if(v.length == 2 && v[0] !== 0)
				this.setValues([0,v[1]]);
		}
	},

	_selectLastCoord: function(evt){
		var v = this.getSliderVal();
		var last = this.coordinates.length - 1;

		if($(evt.currentTarget).hasClass('active')){
			$(evt.currentTarget).removeClass('active');

			if(v.length == 1 && v[0] == last)
				this.setZero();
			else if(v.length == 2 && v[1] == last)
				this.setValues([v[0]]);

		} else {
			$(evt.currentTarget).addClass('active');
			if(v.length == 1 && v[0] === 0 && !this.$el.find('.su-select-first-coord').hasClass('active'))
				this.setValues([last]);
			else if(v.length == 1 && v[1] != last)
				this.setValues([v[0],last]);
			else if(v.length == 2 && v[1] != last)
				this.setValues([v[0],last]);
		}
	},

	checkPositionButtons: function(){
		var v = this.getMarkersIndex();
		var last = this.coordinates.length - 1;

		if(v.length == 1 && v[0] !== 0)
			this.$el.find('.su-select-first-coord').removeClass('active');
		else if(v.length == 1 && v[0] === 0)
			this.$el.find('.su-select-first-coord').addClass('active');
		if(v.length == 1 && v[0] != last)
			this.$el.find('.su-select-last-coord').removeClass('active');
		else if(v.length == 1 && v[0] == last)
			this.$el.find('.su-select-last-coord').addClass('active');
		if(v.length == 2 && v[0] !== 0)
			this.$el.find('.su-select-first-coord').removeClass('active');
		else if(v.length == 2 && v[0] === 0)
			this.$el.find('.su-select-first-coord').addClass('active');
		if(v.length == 2 && v[1] != last)
			this.$el.find('.su-select-last-coord').removeClass('active');
		else if(v.length == 2 && v[1] == last)
			this.$el.find('.su-select-last-coord').addClass('active');
	},

	save: function(){
		var self = this;
		this.data.attributes.coordinates = this.coordinates;

		this.waitingView.render();
		this.data.save({
			success: function(e){  
				self.waitingView.closeView();
		    },
		    error: function(e){  
		     	self.waitingView.closeView();
		     	self.errorView.render(['Occurred an error retrieving the place']);
		    }
		});
	},

	saveAs: function(){
		console.log("save as");
	}

});