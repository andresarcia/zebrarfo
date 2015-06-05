var app = app || {};
app.view = app.view || {};

app.view.NavbarView = Backbone.View.extend({

	el: '#navbar',

	events: {
		'click #toggle-main-menu': 'toggleMobileMenu'
	},

	initialize: function(options){
		this.render();
	},

	toggleMobileMenu: function(){
		Backbone.pubSub.trigger('event-toggle-main-menu-mobile');
	},

	render: function(){
		var template = Zebra.tmpl.navbar;
		var html = template({ email: localStorage.email });
		this.$el.html(html);

		return this;
	},

});