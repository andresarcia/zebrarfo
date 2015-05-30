var app = app || {};
app.view = app.view || {};

app.view.GlassPaneView = Backbone.View.extend({

	initialize: function(options){
		this.container = options.container;
		var fontSize = options.fontSize || '30px';

		var template = Zebra.tmpl.glass_pane;
		var html = template({
			fontSize: fontSize, 
			icon: options.icon,
		});

		var width = this.container.outerWidth();
		var height = this.container.outerHeight();
		var position = this.container.parent().position();

		$(html).css({
			'width': width,
			'height': height,
			'top': 0,
			'left': position.left,
		}).appendTo(this.container);

		this.container.find('.glass-icon').click(this.clickOverGlass);
	},

	toggle: function(){
		if(this.container.find('.glass-pane').is(":visible"))
			this.container.find('.glass-pane').hide();
		else
			this.container.find('.glass-pane').show();
	},

	clickOverGlass: function(){
		Backbone.pubSub.trigger('event-glass-pane-clicked');
	},

});