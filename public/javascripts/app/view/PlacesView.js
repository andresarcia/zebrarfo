var app = app || {};
app.view = app.view || {};

app.view.PlacesView = Backbone.View.extend({

	el: '#ws-containter',
	places: null,
	
	initialize: function(options){
		var self = this;

		this.errorView = options.errorView;
		this.waitingView = options.waitingView;
		this.data = options.data;
		this.render();
	},

	render: function(){
		var template = Zebra.tmpl.places;
		var html = template(this.data);
    	this.$el.html(html);

		return this;
	},

});