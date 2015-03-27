var app = app || {};
app.view = app.view || {};

app.view.PlacesView = Backbone.View.extend({

	el: '#ws-containter',
	places: null,
	
	initialize: function(options){
		var self = this;
		delete window.place;
		this.errorView = options.errorView;
		this.waitingView = options.waitingView;
		this.render();
	},

	render: function(){
		var template = Zebra.tmpl.places;
		var html = template(window.places);
		this.$el.html(html);

		return this;
	},

});