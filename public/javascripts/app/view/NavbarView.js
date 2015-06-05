var app = app || {};
app.view = app.view || {};

app.view.NavbarView = Backbone.View.extend({

	el: '#navbar',

	events: {
		'click #toggle-main-menu': 'toggleMobileMenu'
	},

	initialize: function(options){
		this.render();

		Backbone.pubSub.off('navbar-render-mobile');
		Backbone.pubSub.on('navbar-render-mobile', this.renderMobile, this);

		Backbone.pubSub.off('navbar-render-desktop');
		Backbone.pubSub.on('navbar-render-desktop', this.render, this);
	},

	toggleMobileMenu: function(){
		Backbone.pubSub.trigger('event-toggle-main-menu-mobile');
	},

	renderMobile: function(){
		var template = Zebra.tmpl.navbar_mobil;
		var html = template();
		this.$el.html(html);

		return this;
	},

	render: function(){
		var template = Zebra.tmpl.navbar;
		var html = template({ email: localStorage.email });
		this.$el.html(html);

		return this;
	},

});