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
		this.errorView = options.errorView;
		this.errorView.closeView();
		this.waitingView = options.waitingView;
		this.data = options.data;

		window.settings.editPlace = window.settings.editPlace || {};

		this.render();
		this.waitingView.closeView();

		if(window.settings.editPlace.tab)
			this.change(null,window.settings.editPlace.tab);
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

		window.settings.editPlace.tab = index;

		var isEmpty;
		switch (index) {
			case 0:
				window.location.hash = '#places/'+this.data.id+'/edit?type=coordinates';
				isEmpty = this.$el.find('#edit-coord-tab').is(':empty');
				if(isEmpty)
					self.renderEditCoordinates();

				break;
			case 1:
				window.location.hash = '#places/'+this.data.id+'/edit?type=outlayers';
				isEmpty = this.$el.find('#edit-outlayer-tab').is(':empty');
				if(isEmpty)
					self.renderEditOutlayers();

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

	renderEditOutlayers: function(){
		var self = this;
		this.waitingView.render();
		this.fetchOutlayers(function(){
			var editOutlayers = new app.view.EditOutlayersView({
				waitingView: self.waitingView,
				errorView : self.errorView,
				data: self.data,
			});
			self.$el.find('#edit-outlayer-tab').html(editOutlayers.render().el);
			self.waitingView.closeView();
		});
	},

	fetchOutlayers: function(callback){
		if(!this.data.attributes.outlayers){
			var self = this;
			var data = new app.collection.Outlayers({idPlace:this.data.id});
			data.fetch({
				success: function(){
					self.data.attributes.outlayers = data.models;
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
		var template = Zebra.tmpl['edit_place'];
		var html = template(this.data);
		this.$el.html(html);	

		return this;
	},

});