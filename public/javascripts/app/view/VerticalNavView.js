var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.VerticalNavView = Backbone.View.extend({

	el: '#vertical-nav',
	template: Handlebars.compile($("#vertical-nav-template").html()),

	events : {
		'click a' : 'changeActiveClass'
	},
	
	initialize: function(options){
		this.render();
	},

	render: function(){
		this.$el.html(this.template);
		return this;
	},

	changeActiveClass: function(evt){
		$(evt.target).siblings().removeClass('active');
		$(evt.target).addClass('active');
	}

});