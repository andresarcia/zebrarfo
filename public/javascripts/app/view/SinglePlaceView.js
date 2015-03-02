var app = app || {};
app.view = app.view || {};

app.view.SinglePlaceView = Backbone.View.extend({

	el: '#ws-containter',
	coordinates: null,
	mapView: null,
	currentPowerFrequencies: {},

	events: {
		'change #allocation-channel':'changeAllocationChannel',
		'click .delete-link-place': 'deletePlace',
		'click #su-edit-place': 'launchEditPlace'
	},

	initialize: function(options){
		var self = this;

		this.errorView = options.errorView;
		this.errorView.closeView();
		this.waitingView = options.waitingView;
		this.data = options.data;

		this.render();
		this.coordinates = this.data.attributes.coordinates;
		this.mapView = new app.view.GoogleMapBasicMarkersView({
			idContainer: 'su-coord-markers-map'
		});
		this.renderMap();

		Backbone.pubSub.off("event-marker-selected-on-google-map-main");
		Backbone.pubSub.on("event-marker-selected-on-google-map-main", function(res){
			self.renderCoordinateResume(res);
		});
	},

	deletePlace: function(){
		var self = this;
		var deleteFunction = function(){
			self.waitingView.render();
			var place = new app.model.Place({id:self.data.id});
			place.destroy({
				success: function() {
	  				self.waitingView.closeView();
	  				window.location.hash = '#places';
				},
				error: function(model, xhr, options){
			 		self.waitingView.closeView();
			 		self.errorView.render([xhr.responseText]);
				}
			});
		};

		bootbox.dialog({
	  		message: '<h4>Are you sure to delete <b>' + this.data.attributes.name + '</b>?</h4>',
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

	changeAllocationChannel: function(){
		window.settings.currentChannelAllocation = this.$el.find("#allocation-channel").select2("val");
		this.renderPowerFrequencies();
	},

	renderCoordinateResume: function(res){
		var self = this;
		var template = Zebra.tmpl['su_coordinate_resume'];
		var html = template(this.coordinates[res.index]);
		this.$el.find('#su-selected-coordinate-map').html(html);

		this.currentPowerFrequencies.data = new app.model.PowerFrequencies({
			idPlace: this.data.id,
			idCoord: res.id
		});

		this.currentPowerFrequencies.options = {
			yAxis: {
				plotLines:[{
					value: this.coordinates[res.index].powerAvg,
					color: '#ff0000',
					width:1,
					zIndex:4,
					label:{text:'Average power'}
				}]
			},
			tooltip: {
				positioner: {
					x: 80, 
					y: 0 
				}
			},
		};

		this.waitingView.render();
		this.currentPowerFrequencies.data.fetch({
			success: function(){
				self.waitingView.closeView();
			   	self.renderPowerFrequencies();
			},
			error: function(model, xhr, options){
			 	self.waitingView.closeView();
			 	self.errorView.render([xhr.responseText]);
			}
		});
	},

	renderPowerFrequencies: function(){
		var view = new app.view.PowerFrequenciesView({
			selector: '#su-selected-coordinate-map',
			tooltipTop: 260
		});
		view.render(this.currentPowerFrequencies.data.attributes,this.currentPowerFrequencies.options);
	   	$('html, body').stop().animate({  
			scrollTop: $('.chart_power_frequency').offset().top
		}, 1000);
	},

	renderMap: function(){
		var self = this;

		if(window.settings.googleMapApi)
			this.mapView.render(this.coordinates);
		else {
			Backbone.pubSub.off('event-loaded-google-map-api');
			Backbone.pubSub.on('event-loaded-google-map-api', function(){
				self.mapView.render(self.coordinates);
			});
		}
	},

	render: function(){
		var template = Zebra.tmpl['single_place'];
		var html = template(this.data);
		this.$el.html(html);	

		this.$el.find("#allocation-channel").select2();
		this.$el.find("#allocation-channel").select2("val", window.settings.currentChannelAllocation);
	
		return this;
	},

	launchEditPlace: function(){
		window.location.hash = '#places/'+this.data.id+'/edit?type=coordinates';
	}

});