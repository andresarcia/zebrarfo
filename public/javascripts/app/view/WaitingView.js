var app = app || {};
app.view = app.view || {};

app.view.WaitingView = Backbone.View.extend({

	el: '#waiting',

	initialize: function(options){
		this.render();
	},

	render: function(){
		var template = Zebra.tmpl.waiting;
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