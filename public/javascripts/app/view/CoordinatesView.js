var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.CoordinatesView = Backbone.View.extend({

	template: Handlebars.compile($("#coordiantes-template").html()),

	initialize: function(options){
		
	},

	render: function(data){
		var html = this.template(data);
    	this.$el.html(html);

		return this;
	},

});