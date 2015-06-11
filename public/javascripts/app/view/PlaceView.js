var app = app || {};
app.view = app.view || {};

app.view.PlaceView = Backbone.View.extend({

	el: '#ws-containter',
	coordinates: null,
	mapView: null,
	currCapture: {},

	events: {
		'change #p-channel-width':'changeChannelWidth',
		'change #p-frequency-bands':'changeBand',
		'select2-removing #p-frequency-bands':'checkBands',
		'click #p-delete': 'deletePlace',
		'click #p-download': 'downloadPlace',
		'click #p-edit': 'launchEditPlace'
	},

	initialize: function(options){
		var self = this;

		this.errorView = options.errorView;
		this.waitingView = options.waitingView;

		this.render();
		this.coordinates = window.place.attributes.coordinates;

		this.mapView = new app.view.MapView({
			mapOptions: {
				scrollwheel: false,
				data: window.place.attributes.coordinates,
			},
			selectOptions: {
				mouseover: true,
			},
			containerOptions: {
				parent: '#p-map',
			}
		});

		Backbone.pubSub.off("MapView:MarkerSelected");
		Backbone.pubSub.on("MapView:MarkerSelected", function(coord){
			self.renderCoordinateResume(coord[0]);
		});
	},

	downloadPlace: function(){
		var self = this;
		self.waitingView.show();
		$.fileDownload('/api/places/'+ window.place.id +'/download', {
			data: {
				"access_token": localStorage.token,
			},
			httpMethod: "POST"
		})
		.done(function () { self.waitingView.hide(); })
		.fail(function (res) { 
			self.waitingView.hide();
			self.errorView.render([res]);
		});
	},

	deletePlace: function(){
		var self = this;
		var deleteFunction = function(){
			self.waitingView.show();
			var place = new app.model.Place({ id: window.place.id });
			place.destroy({
				success: function() {
					self.waitingView.hide();
					delete window.places;
					window.location.hash = '#places';
				},
				error: function(model, xhr, options){
					self.waitingView.hide();
					self.errorView.render([xhr.responseText]);
				}
			});
		};

		bootbox.dialog({
			message: '<h4>Are you sure to delete <b>' + window.place.attributes.name + '</b>?</h4>',
			buttons: {
				main: {
					label: "Cancel",
				},
				danger: {
					label: "Delete!",
					className: "btn-danger",
					callback: deleteFunction
				},
			}
		});
	},

	changeChannelWidth: function(){
		window.settings.currChannel = this.$el.find("#p-channel-width").select2("val");
		if(this.currCapture.data) this.renderCapture();
	},

	changeBand: function(){
		window.settings.currBand = this.$el.find("#p-frequency-bands").select2("val");
		if(this.currCapture.data) this.renderCapture();
	},

	checkBands: function(evt){
		if(window.settings.currBand.length == 1) evt.preventDefault();
	},

	renderCoordinateResume: function(coord){
		var self = this;
		var template = Zebra.tmpl.place_coordinate_resume;
		var html = template(this.coordinates[coord.index]);
		this.$el.find('#p-selected-coord').html(html);

		this.currCapture.data = new app.model.Capture({
			idPlace: window.place.id,
			idCoord: coord.id
		});

		this.currCapture.options = {
			yAxis: {
				plotLines:[{
					value: this.coordinates[coord.index].powerAvg,
					color: '#ff0000',
					width:1,
					zIndex:4,
					label:{text:'Average power'}
				}]
			},
			xAxis: {
				tickPositions: app.util.isWifi() ? [2412, 2417, 2422, 2427, 2432, 2437, 2442, 2447, 2452, 2457, 2462, 2467, 2472, 2484, 5170, 5180, 5190, 5200, 5210, 5220, 5230, 5240, 5260, 5280, 5300, 5320, 5500, 5520, 5540, 5560, 5580, 5600, 5620, 5640, 5660, 5680, 5700, 5745, 5765, 5785, 5805, 5825] : undefined,
			},
			tooltip: {
				positioner: {
					x: 80, 
					y: 0 
				}
			},
		};

		this.waitingView.show();
		this.currCapture.data.fetch({
			success: function(){
				self.waitingView.hide();
				self.renderCapture();
			},
			error: function(model, xhr, options){
				self.waitingView.hide();
				self.errorView.render([xhr.responseText]);
			}
		});
	},

	renderCapture: function(){
		var view = new app.view.CapturesView({
			selector: '#p-selected-coord',
			tooltipTop: 260
		});

		view.render(this.currCapture.data.attributes, this.currCapture.options);
		$('html, body').stop().animate({
			scrollTop: $('.captures-chart').offset().top
		}, 1000);
	},

	render: function(){
		var template = Zebra.tmpl.place;
		var html = template({
			place: window.place.attributes, 
			bands: window.place.attributes.frequenciesBands.length > 1 ? true: false
		});
		this.$el.html(html);

		this.$el.find("#p-channel-width").select2({ 
			data: window.place.attributes.frequenciesChannelWidth 
		});
		this.$el.find("#p-channel-width").select2("val", window.settings.currChannel);

		if(window.place.attributes.frequenciesBands.length > 1){
			this.$el.find("#p-frequency-bands").select2({ 
				data: window.place.attributes.frequenciesBands,
				multiple: true,
			});
			this.$el.find("#p-frequency-bands").select2("val", window.settings.currBand);
		}

		return this;
	},

	launchEditPlace: function(){
		window.location.hash = '#places/'+window.place.id+'/edit?type=coordinates';
	}

});