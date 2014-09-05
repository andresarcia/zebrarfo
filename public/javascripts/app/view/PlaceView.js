var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.PlaceView = Backbone.View.extend({

	el: '.ws-containter',
	model: null,
	template: Handlebars.compile($("#place-template").html()),

	events: {
		'click .dropdown-trigger' : 'toggleDropdown'
	},
	
	initialize: function(options){
		var self = this;

		this.errorView = options.errorView;
		this.waitingView = options.waitingView;
		this.waitingView.render();

		if(options.placeId)
			this.model = new com.spantons.model.Place({id:options.placeId});
		else
			throw 'Any place id';

		this.model.fetch({
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
		var html = this.template(this.model);
    	this.$el.html(html);	

		return this;
	},

});