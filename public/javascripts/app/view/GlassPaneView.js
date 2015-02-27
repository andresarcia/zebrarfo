var app = app || {};
app.view = app.view || {};

app.view.GlassPaneView = Backbone.View.extend({

	initialize: function(options){
		this.container = options.container;
		var html;

		if(!options.icon)
			html = '<div class="glass-pane"></div>';
		else {

			if(!options.iconSize)
				html = '<div class="glass-pane"><a class="glass-icon"><span class="glyphicon '+options.icon+'"></span></a></div>';
			else
				html = '<div class="glass-pane"><a class="glass-icon"><span class="glyphicon '+options.icon+' glyphicon-'+options.iconSize+'x "></span></a></div>';
		}

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