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
		this.data = options.data;

		window.settings.place = window.settings.place || {};
		window.settings.place.editPlace = window.settings.place.editPlace || {};

		this.render();
		this.waitingView.closeView();

		if(window.settings.place.editPlace.tab)
			this.change(null,window.settings.place.editPlace.tab);
		else if(options.type !== undefined)
			this.change(null,options.type);
		else
			this.change(null,0);
	},

	change: function(evt,index){
		var self = this;

		if(index === undefined)
			index = $('a[data-toggle="tab"]').index(evt.currentTarget);
		else 
			$('#edit-tabs li:eq('+index+') a').tab('show');

		window.settings.place.editPlace.tab = index;

		var isEmpty;
		switch (index) {
			case 0:
				window.location.hash = '#places/'+this.data.id+'/edit?type=coordinates';
				isEmpty = this.$el.find('#edit-coord-tab').is(':empty');
				if(isEmpty)
					self.renderEditCoordinates();

				break;
			case 1:
				window.location.hash = '#places/'+this.data.id+'/edit?type=outliers';
				isEmpty = this.$el.find('#edit-outliers-tab').is(':empty');
				if(isEmpty)
					self.renderEditOutliers();

				break;
		}
	},

	renderEditCoordinates: function(){
		var self = this;
		var editCoordinates = new app.view.EditCoordinatesView({
			waitingView: this.waitingView,
			errorView : this.errorView,
			data: this.data,
		});

		this.$el.find('#edit-coord-tab').html(editCoordinates.render().el);
		editCoordinates.renderComponents();
	},

	renderEditOutliers: function(){
		var self = this;
		this.waitingView.render();
		this.fetchOutliers(function(){
			var editOutliers = new app.view.EditOutliersView({
				waitingView: self.waitingView,
				errorView : self.errorView,
				data: self.data,
			});
			self.$el.find('#edit-outliers-tab').html(editOutliers.render().el);			
		});
	},

	fetchOutliers: function(callback){
		if(!this.data.attributes.outliers){
			var self = this;
			var data = new app.collection.Outliers({idPlace:this.data.id});
			data.fetch({
				success: function(){
					self.data.attributes.outliers = data.models;
					callback();
				},
				error: function(model, xhr, options){
		     		self.errorView.render([xhr.responseText]);
		    	}
			});

		} else
			callback();
	},

	render: function(){
		var template = Zebra.tmpl.edit_place;
		var html = template(this.data);
		this.$el.html(html);	

		return this;
	},

});