var app = app || {};
app.view = app.view || {};

app.view.CoordinatesView = Backbone.View.extend({

	template: Handlebars.compile($("#coordiantes-template").html()),

	initialize: function(options){
		
	},

	render: function(data){
		var html = this.template(data);
    	this.$el.html(html);

		return this;
	},

});