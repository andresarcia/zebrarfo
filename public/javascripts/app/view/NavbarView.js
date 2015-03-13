var app = app || {};
app.view = app.view || {};

app.view.NavbarView = Backbone.View.extend({

	el: '#navbar',

	initialize: function(options){
		this.render();
	},

	render: function(){
		var template = Zebra.tmpl.navbar;
		var html = template();
		this.$el.html(html);

		return this;
	},

});