var app = app || {};
app.view = app.view || {};

app.view.PlacesView = Backbone.View.extend({

	el: '#ws-containter',

	events: {
		'click a[data-toggle="tab"]': 'change'
	},

	initialize: function(options){
		var self = this;
		// var for be read from router
		this.id = "places";
		// delete the place in memory for select new one
		delete window.place;

		window.settings.places = window.settings.places || {};
		window.settings.places.views = window.settings.places.views || {};

		this.errorView = options.errorView;
		this.waitingView = options.waitingView;
		this.render();

		if(window.settings.places.tab) this.change(null, window.settings.places.tab);
		else if(options.type !== undefined) this.change(null, options.type);
		else this.change(null, 0);
	},

	change: function(evt, index){
		if(index === undefined)
			index = $('a[data-toggle="tab"]').index(evt.currentTarget);
		else 
			$('#places-tabs li:eq('+index+') a').tab('show');

		window.settings.places.tab = index;

		var isEmpty;
		switch (index) {
			case 0:
				window.location.hash = '#places?type=me';
				if(this.$el.find('#me-tab').is(':empty')) this.renderMyPlaces();
				else window.settings.places.views.my.updateDataByTab();
				break;
				
			case 1:
				window.location.hash = '#places?type=shared';
				if(this.$el.find('#shared-tab').is(':empty')) this.renderSharedPlaces();
				else window.settings.places.views.shared.updateDataByTab();
				break;
		}
	},


	renderMyPlaces: function(){
		window.settings.places.views.my = new app.view.MyPlacesView({
			waitingView: this.waitingView,
			errorView : this.errorView,
		});

		this.$el.find('#me-tab').html(window.settings.places.views.my.render().el);
		window.settings.places.views.my.renderComponents();
	},

	renderSharedPlaces: function(){
		window.settings.places.views.shared = new app.view.SharedPlacesView({
			waitingView: this.waitingView,
			errorView : this.errorView,
		});

		this.$el.find('#shared-tab').html(window.settings.places.views.shared.render().el);
	},

	render: function(){
		var template = Zebra.tmpl.places;
		var html = template();
		this.$el.html(html);

		return this;
	},

});