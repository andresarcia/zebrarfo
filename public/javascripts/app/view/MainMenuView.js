var app = app || {};
app.view = app.view || {};

app.view.MainMenuView = Backbone.View.extend({

	el: '#main-menu',

	initialize: function(options){
		this.render();
		this.checkToRender();

		$(window).on('resize', { reference: this }, this.checkToRender);
		Backbone.pubSub.off('event-toggle-main-menu-mobile');
		Backbone.pubSub.on('event-toggle-main-menu-mobile', this.toggleMobileMenu, this);
	},

	checkToRender: function(evt){
		var self;
		if(evt)
			self = evt.data.reference;
		else
			self = this;

		if ($(window).width() <= 767) {
			self.renderMobil();
			this.isMobile = true;
		} else {
			self.renderDesktop();
			this.isMobile = false;
		}
	},

	renderDesktop: function(){
		this.removeMobil();
		if(this.$el.children().first().children().length > 0)
			return;

		this.restore();
		return this;
	},

	renderMobil: function(){
		this.$el.trigger('detach.ScrollToFixed');
		var $container = $("body").find("#navbar");
		$container.html(Zebra.tmpl.navbar_mobil());
	},

	removeMobil: function(){
		this.$el.show();
		this.$el.trigger('detach.ScrollToFixed');
		this.$el.scrollToFixed({ 
			marginTop: 65,
		});

		var $container = $("body").find("#navbar");
		$container.html(Zebra.tmpl.navbar());
	},

	restore: function(){
		this.renderSubMenu();
		this.changeActive();
	},

	toggleMobileMenu: function(){
		if(this.$el.css('opacity') == "0")
			this.$el.show().addClass('fadeInLeft animated-fast');
		else
			this.$el.addClass('fadeOutLeft animated-fast')
			.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
				function(){
					$(this).removeClass('fadeOutLeft animated-fast').hide();
			});
	},

	renderSubMenu: function(parentIndex, templateName, id){
		if(templateName && this.crrTemplate == templateName)
			return;

		if(!templateName && !parentIndex && !id){
			if(!this.crrTemplate && !this.parentIndex && !this.id)
				return;

			templateName = this.crrTemplate;
			parentIndex = this.parentIndex;
			id = this.id;
		} else {
			this.crrTemplate = templateName;
			this.parentIndex = parentIndex;
			this.id = id;
		}

		var $container = this.$el.children().first().children().eq(parentIndex);
		if($container.children().length > 1)
			$container.children().last().remove();

		var template = Zebra.tmpl[templateName];
		$container.append(template({id:id}));
		$container.children().last().children().hide();
		$container.children().last().children().slideDown();
	},

	changeActive: function(indexes){
		if(!indexes){
			if(!this.indexes)
				return;
			indexes = this.indexes;
		} else 
			this.indexes = indexes;

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

		if(this.isMobile) this.toggleMobileMenu();
	},

	render: function(){
		var template = Zebra.tmpl.main_menu;
		var html = template();
		this.$el.html(html);
		return this;
	},

});