var app = app || {};
app.view = app.view || {};

app.view.WaitingView = Backbone.View.extend({

	el: '#waiting',
	
	initialize: function(options){
	},

	render: function(){
		var template = Zebra.tmpl.waiting;
		this.$el.html(template);
		this.$el.show();
		return this;
	},

	closeView: function(){
		this.$el.fadeOut(250);
	}

});