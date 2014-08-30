var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.PlacesView = Backbone.View.extend({

	el: '.ws-containter',
	//template: Handlebars.compile($("#vertical-nav-template").html()),

	// events : {
	// 	'click a' : 'changeActiveClass'
	// },
	
	initialize: function(options){
		this.render();
	},

	render: function(){
		// this.$el.html(this.template);
		this.$el.html('<h1>Places</h1>');
		return this;
	},

});