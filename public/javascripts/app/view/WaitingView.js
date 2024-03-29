var app = app || {};
app.view = app.view || {};

app.view.WaitingView = Backbone.View.extend({

	el: '#waiting',

	initialize: function(options){
		this.render();
	},

	render: function(){
		var template;
		if(localStorage.token)
			template = Zebra.tmpl.waiting;
		else
			template = Zebra.tmpl.waiting_login;
		this.$el.html(template);
		this.$el.hide();
		return this;
	},

	show: function(){
		this.$el.show();
	},

	hide: function(){
		this.$el.hide();
	}

});