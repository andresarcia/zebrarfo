var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.PlacesView = Backbone.View.extend({

	el: '#ws-containter',
	places: null,
	template: Handlebars.compile($("#places-template").html()),
	
	initialize: function(options){
		var self = this;

		this.errorView = options.errorView;
		this.errorView.closeView();
		this.waitingView = options.waitingView;
		this.waitingView.render();

		this.places = new com.spantons.collection.Places();
		this.places.fetch({
			success: function(e){                      
		        self.waitingView.closeView();
		        self.render();
		     },
		     error: function(e){  
		     	self.waitingView.closeView();
		     	self.errorView.render(['Occurred an error retrieving the places']);
		     }
		});
	},

	render: function(){
		var html = this.template(this.places);
    	this.$el.html(html);	

		return this;
	},

});