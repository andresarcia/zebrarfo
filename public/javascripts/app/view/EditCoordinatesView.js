var app = app || {};
app.view = app.view || {};

app.view.EditCoordinatesView = Backbone.View.extend({

	currentData: null,
	currentMap: null,

	events: {
		'slide .markers-slider':'addMarkersBySlider',
		'click .su-edit-remove-from-list': 'setZero',
		'click .su-create-new-edition-range': 'addEditionRange',
		'click .su-delete-coord': '_deleteCoord',
		'click .su-select-zoom-out-coord': '_zoomOut',
		'click .su-select-zoom-to-fit-coord': '_zoom2Fit',
		'click .su-select-first-coord': '_selectFirstCoord',
		'click .su-select-last-coord': '_selectLastCoord',
		'click .su-select-left-minus-coord': '_selectMinusLeftCoords',
		'click .su-select-left-plus-coord': '_selectPlusLeftCoords',
		'click .su-select-right-minus-coord': '_selectMinusRightCoords',
		'click .su-select-right-plus-coord': '_selectPlusRightCoords',
		'keydown #su-select-window-left-input': 'checkWindowSelectInput',
		'keydown #su-select-window-right-input': 'checkWindowSelectInput',
		'change .spread-distance-slider':'changeSpreadDistance',
		'change #spread-distance-unit-slider':'changeSpreadDistance',
		'click .su-deselect-coord': '_deselectCoords',
		'click .su-save-save': 'save',
		'click .su-save-save-as': 'saveAs',
	},

	initialize: function(options){
		this.errorView = options.errorView;
		this.waitingView = options.waitingView;
		this.editMarkers = [];
		this.editMarkersIndex = 0;
		this.editMarkersLeftWindow = 5;
		this.editMarkersRightWindow = 5;

		this.coordinates = _.clone(window.place.attributes.coordinates);
		this.editedCoords = [];
		this.spacing = {};
		this.crrSpacing = {};
		this.calculateRealCoorDict();
		this.calculateRelativeCoorDict();
		
		Backbone.pubSub.off('event-marker-selected-on-google-map-edit');
		Backbone.pubSub.on('event-marker-selected-on-google-map-edit', function(markers){
			this.changeSliderByMarkers(markers);
		}, this);

		Backbone.pubSub.off('event-glass-pane-clicked');
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

		if(window.settings.googleMapApi){
			this.mapView.render(this.coordinates);
			this.enableSelectors();
		} else {
			Backbone.pubSub.off('event-loaded-google-map-api');
			Backbone.pubSub.on('event-loaded-google-map-api', function(){
				self.mapView.render(self.coordinates);
				self.enableSelectors();
			});
		}
	},

	renderEditingArea: function(){
		var self = this;
		var template = Zebra.tmpl.su_list_coord_to_edit;
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

	renderSpreadComponents: function(){
		this.spreadSliderUnit = this.$el.find("#spread-distance-unit-slider").select2();

		this.spreadSlider = this.$el.find('.spread-distance-slider').noUiSlider({
			start: 0,
			connect: "lower",
			format: wNumb({
				decimals: 1
			}),
			range: {
				'min': [ 0 ],
				'33.33%': [ 10, 10 ],
				'66.33%': [ 100, 100 ],
				'max': [ 1000 ]
			}
		});

		this.$el.find('.spread-distance-slider').noUiSlider_pips({
			mode: 'range',
			density: 3.33
		});
	},

	renderComponents: function(){
		this.mapView = new app.view.GoogleMapMarkersWithHeatmapView({
			idContainer: 'map_canvas_coordinates'
		});
		this.renderMarkerSlider(0);
		this.renderMap();
		this.renderEditingArea();
		this.renderSpreadComponents();
		this.disableSelectors();
	},

	disableSelectors: function(){
		this.markersSlider.attr('disabled', 'disabled');
		this.spreadSlider.attr('disabled', 'disabled');
		this.spreadSliderUnit.prop("disabled", true);
		this.$el.find('.select-btn').prop('disabled', true);
	},

	enableSelectors: function(){
		this.markersSlider.removeAttr('disabled');
		this.spreadSlider.removeAttr('disabled');
		this.spreadSliderUnit.prop("disabled", false);
		this.$el.find('.select-btn').prop('disabled', false);
	},

	changeSliderByMarkers: function(markers){
		if(this.editMarkers[this.editMarkersIndex] && this.editMarkers[this.editMarkersIndex].editable === false){
			this.mapView.changeMarkers([]);
			return;
		}

		this.cleanSpread();
		var markersRange = [];
		if(markers.length === 0){
			this.setZero();
			return;
		
		} else if(markers.length == 1)
			markersRange = [markers[0].id];
		else if(markers.length == 2)
			markersRange = [markers[0].id, markers[1].id];

		this.setValues(this.realIndex2Relative(markersRange));
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

		this.cleanSpread();
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
			coordinates.distance = coordinates.distance.toFixed(2);
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
	},

	getMarkersIndex: function(){
		var markersRange = [];
		var currentMarkers = this.editMarkers[this.editMarkersIndex];

		if(currentMarkers === undefined)
			return markersRange;

		if(currentMarkers.to)
			markersRange = [currentMarkers.from.index, currentMarkers.to.index];

		else if(currentMarkers.from && currentMarkers.from.index.constructor === Number)
			markersRange = [currentMarkers.from.index];

		else if(currentMarkers.values && currentMarkers.values.length > 0)
			markersRange = currentMarkers.values;

		return markersRange;
	},

	addEditionRange: function(){
		if(this.editMarkers.length !== 0)
			this.editMarkersIndex += 1;
		this.setZero();
	},

	setZero: function(){
		this.mapView.changeMarkers([]);
		this.renderMarkerSlider([0]);
		this.cleanSpread();
		this.appendToEditingArea();
		this.$el.find('.select-btn').prop('disabled', false);
		this.$el.find('.action-btn').prop('disabled', true);
		this.$el.find('.2-action-btn').prop('disabled', true);
	},

	cleanSpread: function(){
		if(this.spreadSlider.val() > 0)
			this.mapView.cleanAllMarkers();

		this.spreadSlider.val(0);
		this.$el.find('.select-btn').prop('disabled', false);
	},

	setValues: function(n){
		if(n[0] === 0)
			this.$el.find(".su-select-first-coord").addClass('active');
		else
			this.$el.find(".su-select-first-coord").removeClass('active');

		if(n.length == 1){
			this.$el.find('.2-action-btn').prop('disabled', true);

		} else if(n.length == 2){
			this.$el.find('.2-action-btn').prop('disabled', false);

			if(n[1] == this.coordinates.length - 1)
				this.$el.find(".su-select-last-coord").addClass('active');
			else
				this.$el.find(".su-select-last-coord").removeClass('active');
		}

		this.renderMarkerSlider(n);
		this.mapView.changeMarkers(this.relativeIndex2Real(n));
		this.appendToEditingArea(n);
		this.$el.find('.action-btn').prop('disabled', false);
	},

	_deleteCoord: function(){
		var self = this;
		if(this.spreadSlider.val() == "0.0")
			this.editMarkers[this.editMarkersIndex].by = 'range';
		else {
			this.editMarkers[this.editMarkersIndex].by = 'distance';
			this.editMarkers[this.editMarkersIndex].distance = this.spreadSlider.val();
			this.editMarkers[this.editMarkersIndex].unit = this.$el.find("#spread-distance-unit-slider").select2("val");
			this.editMarkers[this.editMarkersIndex].spacing = _.clone(this.spacing);

			if(Object.keys(this.spacing).length === 0)
				this.spacing = this.crrSpacing;
			else {
				var spacing = {};
				var spacingCopy = _.clone(this.spacing);
				_.each(Object.keys(this.crrSpacing), function(item){
					var temp = self.crrSpacing[item];
					_.each(self.crrSpacing[item], function(i){
						if(self.spacing[i]){
							temp = temp.concat(self.spacing[i]);
							delete spacingCopy[i];
						}
					});
					spacing[item] = temp;
				});
				_.each(Object.keys(spacingCopy), function(item){
					if(spacing[item])
						spacing[item] = spacing[item].concat(self.spacing[item]);
					else
						spacing[item] = self.spacing[item];
				});
				this.spacing = spacing;
			}
		}

		this.editMarkers[this.editMarkersIndex].editable = false;
		this.editMarkers[this.editMarkersIndex].coordinates = _.clone(this.coordinates);

		var v = this.getMarkersIndex();
		var edited = [];

		if(this.spreadSlider.val() == "0.0"){
			this.mapView.hideMarkers(this.relativeIndex2Real(v),true);
			if(v.length == 1){
				edited.push(this.coordinates[v[0]]);
				this.coordinates.splice(v[0], 1);

			} else {
				for (var i = v[1]; i >= v[0]; i--){
					edited.push(this.coordinates[i]);
				}
				this.coordinates = _.difference(this.coordinates, edited);
			}
			this.editedCoords.push(edited);
		} else {
			this.mapView.hideMarkers(this.relativeIndex2Real(v),false);
			for (var j = v.length - 1; j >= 0; j--){
				edited.push(this.coordinates[v[j]]);
			}
			this.coordinates = _.difference(this.coordinates, edited);
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

		this.coordinates = this.editMarkers[this.editMarkersIndex].coordinates;
		this.calculateRelativeCoorDict();

		var relative = this.relativeIndex2Real(indexes);
		if(this.editMarkers[this.editMarkersIndex].by == "range"){
			this.editedCoords.pop();
			this.mapView.showMarkers(relative,true);
			this.mapView.changeMarkers(relative);
			this.renderMarkerSlider(indexes);
			this.renderEditingArea();
			this.$el.find('.action-btn').prop('disabled', false);
		
		} else if(this.editMarkers[this.editMarkersIndex].by == "distance"){
			this.mapView.showMarkers(relative,false);
			this.spacing = this.editMarkers[this.editMarkersIndex].spacing;
			var distance = this.editMarkers[this.editMarkersIndex].distance;
			var unit = this.editMarkers[this.editMarkersIndex].unit;
			var ids = this.mapView.changeMarkersByDistance(distance,unit);
			this.spreadSlider.val(distance);
			this.renderEditingAreaSpread(ids,distance,unit);
		}
	},

	_zoom2Fit: function(){
		this.mapView.zoom2Fit();
	},

	_zoomOut: function(){
		this.mapView.zoomOut();
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

	_selectMinusLeftCoords: function(){
		this.editMarkersLeftWindow = this.getLeftWindowSelect();
		var v = this.getSliderVal();

		if(v.length == 1)
			return;
		
		else if(v.length == 2){
			if(v[0] == v[1])
				return;

			if(v[0] + this.editMarkersLeftWindow >= v[1])
				this.setValues([v[1]]);

			else if(v[0] + this.editMarkersLeftWindow < v[1]){
				this.setValues([v[0] + this.editMarkersLeftWindow,v[1]]);
			}
		}
	},

	_selectPlusLeftCoords: function(){
		this.editMarkersLeftWindow = this.getLeftWindowSelect();
		var v = this.getSliderVal();

		if(v[0] === 0)
			return;

		if(v.length == 1){
			if(v[0] - this.editMarkersLeftWindow < 0)
				this.setValues([0,v[0]]);

			else if(v[0] - this.editMarkersLeftWindow >= 0)
				this.setValues([v[0] - this.editMarkersLeftWindow,v[0]]);
		
		} else if(v.length == 2){
			if(v[0] - this.editMarkersLeftWindow < 0)
				this.setValues([0,v[1]]);

			else if(v[0] - this.editMarkersLeftWindow >= 0)
				this.setValues([v[0] - this.editMarkersLeftWindow,v[1]]);
		}
	},

	_selectMinusRightCoords: function(){
		this.editMarkersRightWindow = this.getRightWindowSelect();
		var v = this.getSliderVal();

		if(v.length == 1)
			return;

		if(v[0] == v[1])
			return;

		if(v[1] - this.editMarkersRightWindow <= v[0])
			this.setValues([v[0]]);

		else if(v[1] - this.editMarkersRightWindow > v[0])
			this.setValues([v[0],v[1] - this.editMarkersRightWindow]);
	},

	_selectPlusRightCoords: function(){
		this.editMarkersRightWindow = this.getRightWindowSelect();
		var v = this.getSliderVal();
		var last = this.coordinates.length - 1;

		if(v.length == 1){
			if(v[0] == last)
				return;

			if(v[0] + this.editMarkersRightWindow >= last)
				this.setValues([v[0],last]);

			else if(v[0] + this.editMarkersRightWindow < last)
				this.setValues([v[0],v[0] + this.editMarkersRightWindow]);
		
		} else if(v.length == 2){
			if(v[1] == last)
				return;

			if(v[1] + this.editMarkersRightWindow >= last)
				this.setValues([v[0],last]);

			else if(v[1] + this.editMarkersRightWindow < last)
				this.setValues([v[0],v[1] + this.editMarkersRightWindow]);
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

	checkWindowSelectInput: function(e){
		if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
			(e.keyCode == 65 && e.ctrlKey === true) || 
			(e.keyCode >= 35 && e.keyCode <= 39))
				return;

		if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105))
			e.preventDefault();
	},

	getLeftWindowSelect: function(){
		var val = this.$el.find("#su-select-window-left-input").val();
		if(val == this.editMarkersLeftWindow || val === "" || (val.length == 1 && val == "0")){
			if(val === "" || (val.length == 1 && val == "0"))
				this.$el.find("#su-select-window-left-input").val(this.editMarkersLeftWindow);
			return this.editMarkersLeftWindow;
		}

		return Number(val);
	},

	getRightWindowSelect: function(){
		var val = this.$el.find("#su-select-window-right-input").val();
		if(val == this.editMarkersRightWindow || val === "" || (val.length == 1 && val == "0")){
			if(val === "" || (val.length == 1 && val == "0"))
				this.$el.find("#su-select-window-right-input").val(this.editMarkersRightWindow);
			return this.editMarkersRightWindow;
		}

		return Number(val);
	},

	_deselectCoords: function(){
		this.setZero();
	},

	changeSpreadDistance: function(){
		this.$el.find('.action-btn').prop('disabled', true);
		this.$el.find('.2-action-btn').prop('disabled', true);
		this.renderMarkerSlider([0]);
		
		var distance = this.spreadSlider.val();
		var unit = this.$el.find("#spread-distance-unit-slider").select2("val");
		var ids = this.mapView.changeMarkersByDistance(distance,unit);
		this.renderEditingAreaSpread(ids,distance,unit);
	},

	renderEditingAreaSpread: function(ids,distance,unit){
		if(Object.keys(ids).length < 1){
			this.setZero();
			return;
		}

		this.crrSpacing = ids;

		var self = this;
		var count = 0;
		var values = [];

		_.each(ids, function(item){
			values = values.concat(self.realIndex2Relative(item));
			count += item.length;
		});

		this.editMarkers[this.editMarkersIndex] = {
			values: values,
			count: count,
			distance: distance,
			unit: unit
		};
		this.renderEditingArea();

		this.$el.find('.select-btn').prop('disabled', true);
		this.$el.find('.su-delete-coord').prop('disabled', false);
		this.$el.find('.su-deselect-coord').prop('disabled', false);
	},

	save: function(){
		var self = this;
		if(this.editedCoords.length > 0)
			window.place.attributes.edited = 
				_.map(_.flatten(this.editedCoords), 
					function(item){ return item.id; });

		if(Object.keys(this.spacing).length > 0)
			window.place.attributes.spacing = this.spacing;

		this.waitingView.show();
		window.place.save(window.place.attributes, {
			success: function(model){
				var id = window.place.id;
				delete window.place;
				window.settings.place = {};
				self.waitingView.hide();
				window.location.hash = '#places/'+ id;
			},
			error: function(model, xhr, options){
				if(xhr.responseJSON.message == "Access token has expired"){
					localStorage.removeItem('token');
					window.location.hash = '#';
				} else {
					self.waitingView.hide();
					self.errorView.render([xhr.responseText]);
				}
			}
		});
	},

	saveAs: function(){
		console.log("save as");
	},

	render: function(){
		var template = Zebra.tmpl.edit_coordinates;
		var html = template(window.place);
		this.$el.html(html);

		return this;
	},

});