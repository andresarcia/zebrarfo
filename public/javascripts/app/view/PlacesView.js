var app = app || {};
app.view = app.view || {};

app.view.PlacesView = Backbone.View.extend({

	el: '#ws-containter',
	places: null,
	template: Handlebars.compile($("#places-template").html()),
	
	initialize: function(options){
		var self = this;

		this.errorView = options.errorView;
		this.errorView.closeView();
		this.waitingView = options.waitingView;
		this.data = options.data;
		this.render();
	},

	render: function(){
		var html = this.template(this.data);
    	this.$el.html(html);	

		return this;
	},

});