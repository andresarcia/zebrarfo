var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.WaitingView = Backbone.View.extend({

	el: '#waiting',
	template: Handlebars.compile($("#waiting-template").html()),
	
	initialize: function(options){
	},

	render: function(){
		this.$el.html(this.template);
		this.$el.show();
		return this;
	},

	closeView: function(){
		this.$el.fadeOut(250);
	}

});