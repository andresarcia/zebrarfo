var app = app || {};
app.view = app.view || {};

app.view.WhiteSpacesView = Backbone.View.extend({

	events: {
		'change .quality-slider':'changeQuality',
		'change .occupation-slider':'changeOccupation',
		'change #frequency-bands':'changeBand',
		'select2-removing #frequency-bands':'checkBands',
	},

	reset: function(){
		this.settings = {};
		this.settings.quality = {};
		this.settings.quality.crr = app.util.isWifi() ? 1 : 5;
		this.settings.quality.max = 10;
		this.settings.occupationMax = 100;
		this.cameraPosition = {};
		this.cameraPosition.horizontal = 5.4;
		this.cameraPosition.vertical = 0.5;
		this.cameraPosition.distance = 2;
	},

	initialize: function(options){
		var self = this;
		this.errorView = options.errorView;
		this.waitingView = options.waitingView;

		this.data = window.place.attributes;
		this.data3D = null;
		this.reset();

		$(window).on('resize', { reference: this }, this.renderComponents);
	},

	renderComponents: function(evt){
		var self;
		if(evt) self = evt.data.reference;
		else {
			self = this;
			this.renderSettings();
		}

		if(window.settings.googleVisualizationApi)
			self.renderGraph(this.coordinates);
		else {
			Backbone.pubSub.off('event-loaded-google-visualization-api');
			Backbone.pubSub.on('event-loaded-google-visualization-api', function(){
				self.renderGraph(self.coordinates);
			});
		}
	},

	renderSettings: function(){
		this.qualitySlider = this.$el.find('.quality-slider').noUiSlider({
			start: this.settings.quality.max - this.settings.quality.crr,
			step: 1,
			format: wNumb({
				decimals: 0
			}),
			range: {
				'min': 1,
				'max': 9
			}
		});

		this.$el.find('.quality-slider')
		.Link('lower')
		.to('-inline-<div class="slider_tooltip up"></div>', function(value){
			$(this).html('<strong>' + value + '</strong>');
			$(this).css('width', '50px');
			$(this).css('left', '-10px');
		});

		this.occupationSlider = this.$el.find('.occupation-slider').noUiSlider({
			start: 100,
			step: 1,
			behaviour: 'tap-drag',
			connect: 'lower',
			format: wNumb({
				decimals: 0
			}),
			range: {
				'min': 0,
				'max': 100
			}
		});
		this.$el.find('.occupation-slider')
		.Link('lower')
		.to('-inline-<div class="slider_tooltip up"></div>', function(value){
			$(this).html('<strong>' + value + ' %</strong>');
			$(this).css('width', '50px');
			$(this).css('left', '-10px');
		});

		// bands
		if(window.place.attributes.frequenciesBands.length > 1){
			this.$el.find("#frequency-bands").select2({ 
				data: window.place.attributes.frequenciesBands,
				multiple: true,
			});
			this.$el.find("#frequency-bands").select2("val", window.settings.currBand);
		}
	},

	changeQuality: function(){
		this.settings.quality.crr = this.settings.quality.max - this.qualitySlider.val();
		this.data3D = undefined;
		this.renderGraph();
	},

	changeOccupation: function(){
		this.settings.occupationMax = this.occupationSlider.val();
		this.data3D = undefined;
		this.renderGraph();
	},

	changeBand: function(evt){
		window.settings.currBand = this.$el.find("#frequency-bands").select2("val");
		this.data3D = undefined;
		this.renderGraph();
	},

	checkBands: function(evt){
		if(window.settings.currBand.length == 1) evt.preventDefault();
	},

	calculateData: function(){
		this.data3D = {};
		this.data3D = new google.visualization.DataTable();
		this.data3D.addColumn('number', 'Power Threshold');
		this.data3D.addColumn('number', 'Frequencies (MHz)');
		this.data3D.addColumn('number', 'Occupation (%)');

		var self = this;

		// filter by bands
		var bands = _.sortBy(window.settings.currBand),
			data = _.groupBy(this.data.charts, function(sample){ return sample.frequency; });

		// if all ([0]) not in bands, then filter
		if(Number(bands[0]) !== 0){
			var dataFiltered = {};
			var index = 0;
			var boundIndex = bands[index];
			_.find(_.keys(data), function(key){
				var from = window.place.attributes.frequenciesBands[boundIndex].from;
				var to = window.place.attributes.frequenciesBands[boundIndex].to;
				var fq = Number(key);

				if(fq >= from && fq <= to) dataFiltered[key] = data[key];
				if(fq > to) {
					if(index < bands.length - 1){
						index += 1;
						boundIndex = bands[index];
					} 
					else return key;
				}
			});

			data = dataFiltered;
		} 

		for (var i = this.data.powerMax - 1; i >= this.data.powerMin; i -= this.settings.quality.crr) {
			_.each(data, function(itemSameFrequency){
				var passed = 0;
				_.each(itemSameFrequency, function(item){
					if(item.power >= i) passed += 1;
				});
				var x = itemSameFrequency[0].frequency / 1000;
				var occupation = (passed/itemSameFrequency.length)*100;
				if(occupation <= self.settings.occupationMax) y = occupation;
				else if(y > self.settings.occupationMax) y = self.settings.occupationMax;
				var z = i;

				self.data3D.addRow([ z, x, y ]);
			});
		}
	},

	renderGraph: function(){
		this.waitingView.show();
		if(!this.data3D) {
			this.disableSettings();
			this.calculateData();
		}

		var options = {
			width:  "100%",
			style: "bar", // dot, dot-line, line, grid, surface, bar
			showPerspective: true,
			showGrid: false,
			showShadow: false,
			keepAspectRatio: false,
			verticalRatio: 0.5,
			cameraPosition: this.cameraPosition,
			// zMax: 60, // occupation
			// xMax: -60, // threshold
		};

		var self = this;
		var graph = new links.Graph3d(document.getElementById('white-spaces-canvas'));
		google.visualization.events.addListener(graph, 'camerapositionchange', onCameraPositionChange);

		// save camera position to redraw in the same position
		function onCameraPositionChange(evt) {
			self.cameraPosition.horizontal = evt.horizontal;
			self.cameraPosition.vertical = evt.vertical;
			self.cameraPosition.distance = evt.distance;
		}

		setTimeout(function(){
			graph.draw(self.data3D, options);
			self.waitingView.hide();
			self.$el.find('.settings').removeClass('disable-container');
		}, 200);
	},

	disableSettings: function(){
		if(!this.$el.find('.settings').hasClass("disable-container"))
			this.$el.find('.settings').addClass('disable-container');
	},

	render: function(){
		var template = Zebra.tmpl.white_spaces;
		var html = template({
			bands: window.place.attributes.frequenciesBands.length > 1 ? true: false
		});
		this.$el.html(html);
		
		this.disableSettings();

		return this;
	},

});