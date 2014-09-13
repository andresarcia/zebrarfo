var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.CoordinatesView = Backbone.View.extend({

	el: '#ws-containter',
	coodinates: null,
	template: Handlebars.compile($("#coordinates-template").html()),

	events: {
		'click .dropdown-trigger' : 'toggleDropdown'
	},
	
	initialize: function(options){
		var self = this;

		this.errorView = options.errorView;
		this.waitingView = options.waitingView;
		this.waitingView.render();

		if(options.placeId)
			this.coodinates = new com.spantons.collection.Coordinates({idPlace:options.placeId});
		else
			throw 'Any place id';

		this.coodinates.fetch({
			success: function(e){                      
		        self.waitingView.closeView();
		        self.render();
		     },
		     error: function(e){  
		     	self.waitingView.closeView();
		     	self.errorView.render(['Occurred an error retrieving the place']);
		     }
		});
	},

	toggleDropdown: function(evt){
		$(evt.currentTarget).next().slideToggle();
	},

	render: function(){
		console.log(this.coodinates.models[0].attributes);
		var html = this.template(this.coodinates.models[0]);
    	this.$el.html(html);	

		return this;
	},

});