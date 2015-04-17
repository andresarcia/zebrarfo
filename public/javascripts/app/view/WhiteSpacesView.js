var app = app || {};
app.view = app.view || {};

app.view.WhiteSpacesView = Backbone.View.extend({

	events: {
		
	},

	initialize: function(options){
		var self = this;
		this.errorView = options.errorView;
		this.waitingView = options.waitingView;

		this.data = window.place.attributes;
		this.data3D = null;

		$(window).on('resize', { reference: this }, this.renderComponents);
	},

	calculateData: function(){
		this.data3D = new google.visualization.DataTable();
		this.data3D.addColumn('number', 'Power Threshold');
		this.data3D.addColumn('number', 'Frequencies (MHz)');
		this.data3D.addColumn('number', 'Occupation (%)');

		var self = this;
		var dataGrouped = _.groupBy(this.data.charts, function(sample){
			return sample.frequency;
		});
		var a = [];
		for (var i = this.data.powerMax - 1; i >= this.data.powerMin; i -= 3) {
			_.each(dataGrouped, function(itemSameFrequency){
				var passed = 0;
				_.each(itemSameFrequency, function(item){
					if(item.power >= i) passed += 1;
				});
				var x = itemSameFrequency[0].frequency / 1000;
				var y = (passed/itemSameFrequency.length)*100;
				var z = i;
				self.data3D.addRow([ z, x, y ]);
			});
		}
	},

	renderComponents: function(evt){
		var self;
		if(evt)
			self = evt.data.reference;
		else
			self = this;

		if(window.settings.googleVisualizationApi)
			self.renderGraph(this.coordinates);
		else {
			Backbone.pubSub.off('event-loaded-google-visualization-api');
			Backbone.pubSub.on('event-loaded-google-visualization-api', function(){
				self.renderGraph(self.coordinates);
			});
		}
	},

	renderGraph: function(){
		this.waitingView.show();
		if(!this.data3D)
			this.calculateData();

		var options = {
			width:  "100%",
			style: "bar", // dot, dot-line, line, grid, surface, bar
			showPerspective: true,
			showGrid: true,
			showShadow: false,
			keepAspectRatio: false,
			verticalRatio: 0.5,
			cameraPosition: {
				"horizontal": 5.4, 
				"vertical": 0.5, 
				"distance": 1.7
			}
		};

		var self = this;
		var graph = new links.Graph3d(document.getElementById('white-spaces-canvas'));
		setTimeout(function(){
			graph.draw(self.data3D, options);
			self.waitingView.hide();
		}, 200);
	},

	render: function(){
		var template = Zebra.tmpl.white_spaces;
		var html = template();
		this.$el.html(html);

		return this;
	},

});