var app = app || {};
app.view = app.view || {};

app.view.VerticalNavView = Backbone.View.extend({

	el: '#vertical-nav',
	template: Handlebars.compile($("#vertical-nav-template").html()),	
	currentSubMenuId: null,

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

	renderSubMenuWithId: function(parentIndex,containerId,id){
		if(this.currentSubMenuId === containerId)
			return;

		this.currentSubMenuId = containerId;

		var template = Handlebars.compile($('#'+containerId).html());
		if(id)
			this.$el.find('.list-group-item').eq(parentIndex).find('.children').html(template({id:id}));
		else
			this.$el.find('.list-group-item').eq(parentIndex).find('.children').html(template);
	},

	showSubMenuWithClass: function(parentIndex,className){
		this.$el.find('.list-group-item').eq(parentIndex).find('.children').find('.'+className).slideDown(300);
	},

	changeActiveClass: function(options){
		if (options.index){
			var brothers;
			var item;

			if(options.index.length < 2){
				brothers = this.$el.find('.parent');
				item = brothers.eq(options.index[0]);
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
				brothers = parent.next().find('.child');
				item = brothers.eq(options.index[1]);

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