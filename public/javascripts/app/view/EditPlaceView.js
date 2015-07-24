var app = app || {};
app.view = app.view || {};

app.view.EditPlaceView = Backbone.View.extend({

	el: '#ws-containter',
	currentData: null,
	currentChart: null,

	events: {
		'click a[data-toggle="tab"]': 'change'
	},

	initialize: function(options){
		var self = this;
		this.id = 'edit-place';
		this.errorView = options.errorView;
		this.waitingView = options.waitingView;

		window.settings.place = window.settings.place || {};
		window.settings.place.editPlace = window.settings.place.editPlace || {};

		this.render();
		this.waitingView.hide();

		if(window.settings.place.editPlace.tab)
			this.change(null,window.settings.place.editPlace.tab);
		else if(options.type !== undefined)
			this.change(null,options.type);
		else
			this.change(null,0);
	},

	change: function(evt,index){
		if(index === undefined)
			index = $('a[data-toggle="tab"]').index(evt.currentTarget);
		else 
			$('#edit-tabs li:eq('+index+') a').tab('show');

		window.settings.place.editPlace.tab = index;

		switch (index) {
			case 0:
				window.location.hash = '#places/'+window.place.id+'/edit?type=coordinates';
				if(this.$el.find('#edit-coord-tab').is(':empty')) this.renderEditCoordinates();
				break;
			case 1:
				window.location.hash = '#places/'+window.place.id+'/edit?type=outliers';
				if(this.$el.find('#edit-outliers-tab').is(':empty')) this.renderEditOutliers();
				break;
		}
	},

	renderEditCoordinates: function(){
		var editCoordinates = new app.view.EditCoordinatesView({
			waitingView: this.waitingView,
			errorView : this.errorView,
		});

		this.$el.find('#edit-coord-tab').html(editCoordinates.render().el);
		editCoordinates.renderComponents();
	},

	renderEditOutliers: function(){
		var editOutliers = new app.view.EditOutliersView({
			waitingView: this.waitingView,
			errorView : this.errorView,
		});
		this.$el.find('#edit-outliers-tab').html(editOutliers.render().el);
	},

	render: function(){
		var template = Zebra.tmpl.edit_place;
		var html = template(window.place);
		this.$el.html(html);

		return this;
	},

});