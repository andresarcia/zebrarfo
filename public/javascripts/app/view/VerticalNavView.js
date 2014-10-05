var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.VerticalNavView = Backbone.View.extend({

	el: '#vertical-nav',
	template: Handlebars.compile($("#vertical-nav-template").html()),	

	initialize: function(options){
		
		this.render();
		this.$el.find('.active').next().slideDown(350);
		this.$el.scrollToFixed({ 
			marginTop: 55,
		});
	},

	render: function(){
		this.$el.html(this.template);
		return this;
	},

	appendTempChildItem: function(options){
		var parent = this.$el.find('.parent').eq(options.indexParent);

		if(parent.next().find('.temp').length > 0)
			return;

		_.each(options.items,function(item){
			if(item.glyphicon)
				item = $('<li class="list-group-item"><a href="#'+item.url+'" class="child item temp"><span class="glyphicon '+item.glyphicon+'"></span><span> '+item.name+'</span></a></li>').hide();
			else
				item = $('<li class="list-group-item"><a href="#'+item.url+'" class="child item temp"><span> '+item.name+'</span></a></li>').hide();

			parent.next().append(item);
			item.slideDown(700);
		});
	},

	changeActiveClass: function(options){
		if (options.index){

			if(options.index.length < 2){
				var brothers = this.$el.find('.parent');
				var item = brothers.eq(options.index[0]);
				var childrensBlock = this.$el.find('.children');
				var childrens = childrensBlock.find('.child');
				
				if(!item.hasClass('active')){
					childrensBlock.find('.temp').parent().slideUp(300,function(){
						this.remove();
					});
					childrens.removeClass('active');
					brothers.removeClass('active');
					brothers.removeClass('active-parent');
					item.addClass('active');
					if(!item.next().is(':visible')){
						childrensBlock.slideUp(250);
						item.next().slideDown(350);
					}
				}
			} else {
				var parent = this.$el.find('.parent').eq(options.index[0]);
				var brothers = parent.next().find('.child');
				var item = brothers.eq(options.index[1]);

				if(!item.hasClass('active')){
					parent.removeClass('active');
					brothers.removeClass('active');
					parent.addClass('active-parent');
					item.addClass('active');
				}
			}
		
		} else 
			throw 'Any index';
	}

});