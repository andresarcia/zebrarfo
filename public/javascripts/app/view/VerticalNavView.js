var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.VerticalNavView = Backbone.View.extend({

	el: '#vertical-nav',
	template: Handlebars.compile($("#vertical-nav-template").html()),	

	initialize: function(options){
		
		this.render();
		this.$el.scrollToFixed({ 
			marginTop: 55,
		});
	},

	render: function(){
		this.$el.html(this.template);
		return this;
	},

	appendTempChildItem: function(options){
		
		if(options.glyphicon)
			item = $('<li class="list-group-item"><a href="#'+options.url+'" class="child item active temp"><span class="glyphicon '+options.glyphicon+'"></span><span> '+options.name+'</span></a></li>').hide();
		else
			item = $('<li class="list-group-item"><a href="#'+options.url+'" class="child item active temp"><span> '+options.name+'</span></a></li>').hide();

		var parent = this.$el.find('.parent').get(options.indexParent);

		if($(parent).parent().find('.children').is(':visible')){
			$(parent).parent().find('.children').append(item);
			item.slideDown(350);
		} else {
			$(parent).parent().find('.children').append(item);
			item.show();
			$(parent).parent().find('.children').slideDown(350);
		}
	},

	changeActiveClass: function(options){
		var item;

		this.$el.find('.active-parent').removeClass('active-parent');
		this.$el.find('.active-childrens').removeClass('active-childrens');
		this.$el.find('.active').removeClass('active');
		this.$el.find('.temp').parent().slideUp(250, function(){
			$(this).remove();
		});

		if(!options.child){
			item = this.$el.find('.parent').get(options.index);
			
			if(!$(item).parent().find('.children').is(':visible')){
				this.$el.find('.children').slideUp(250);
				$(item).parent().find('.children').slideDown(350);
				$(item).parent().find('.children').addClass('active-childrens');
			} 

		} else if(options.child){
			var parent = this.$el.find('.parent').get(options.indexParent);
			$(parent).parent().find('.children').slideDown(350);
			$(parent).addClass('active-parent');
			item = $(parent).next().find('.child').get(options.index);
		}

		$(item).addClass('active');
	},

});