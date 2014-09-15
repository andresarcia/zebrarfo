var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.VerticalNavView = Backbone.View.extend({

	el: '#vertical-nav',
	template: Handlebars.compile($("#vertical-nav-template").html()),	
	
	initialize: function(options){
		
		this.render();
		this.$el.scrollToFixed({ 
			
			marginTop: 50,

			preFixed: function() { 
				$(this).find('.list-group-item:first-child').css('border-top-right-radius','0');
			},

			postFixed: function() { 
				$(this).find('.list-group-item:first-child').css('border-top-right-radius','4px');
			}
		});
	},

	render: function(){
		this.$el.html(this.template);
		return this;
	},

	changeActiveClass: function(index){
		this.$el.find('.active').removeClass('active');
		var item = this.$el.find('a').get(index);
		$(item).addClass('active');
	},



});