var app = app || {};
app.view = app.view || {};

app.view.MainMenuView = Backbone.View.extend({

	el: '#main-menu',

	initialize: function(options){
		this.checkToRender();

		this.$el.scrollToFixed({ 
			marginTop: 65,
		});

		// $(window).on('resize', { reference: this }, this.checkToRender);
	},

	checkToRender: function(evt){
		var self;
		if(evt)
			self = evt.data.reference;
		else
			self = this;

		var win = $(window);
		if (win.width() <= 767) 
			self.renderMobil();
		else
			self.renderDesktop();
	},

	renderDesktop: function(){
		this.$el.show();
		var template = Zebra.tmpl.main_menu;
		this.$el.html(template);
		return this;
	},

	renderMobil: function(){
		this.$el.hide();
		console.log($("body").find("#navbar-menu").children().first());
	},

	renderSubMenu: function(parentIndex, templateName, id){
		if(this.crrTemplate == templateName)
			return;

		this.crrTemplate = templateName;
		var template = Zebra.tmpl[templateName];
		var $container = this.$el.children().first().children().eq(parentIndex);
		if($container.children().length > 1)
			$container.children().last().remove();

		$container.append(template({id:id}));
		$container.children().last().children().hide();
		$container.children().last().children().slideDown();
	},

	changeActive: function(indexes){
		if(!indexes)
			return;

		var first_level = this.$el.children().first().children().children("a");
		var item;

		if(indexes.length == 1){
			item = first_level.eq(indexes[0]);
			if(item.hasClass('active'))
				return;

			var childrens = first_level.next().children().children("a");
			first_level.removeClass('active');
			first_level.removeClass('active-parent');
			childrens.removeClass('active');
			item.addClass('active');

		} else if(indexes.length == 2){
			var parent = first_level.eq(indexes[0]);
			var brothers = parent.next().children().children("a");
			item = brothers.eq(indexes[1]);

			if(item.hasClass('active'))
				return;

			first_level.removeClass('active');
			brothers.removeClass('active');
			parent.addClass('active-parent');
			item.addClass('active');
		}
	},

});