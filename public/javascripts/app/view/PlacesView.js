var app = app || {};
app.view = app.view || {};

app.view.PlacesView = Backbone.View.extend({

	el: '#ws-containter',
	places: null,

	events: {
		'click .places-delete': 'deletePlace',
	},
	
	initialize: function(options){
		var self = this;
		delete window.place;
		this.errorView = options.errorView;
		this.waitingView = options.waitingView;
		this.render();
	},

	deletePlace: function(evt){
		var id = $(evt.currentTarget).data("id"),
			name = $(evt.currentTarget).data("name"),
			index = this.$el.find('.places-delete').index(evt.currentTarget);
			self = this;

		var deleteFunction = function(){
			self.waitingView.show();
			var place = new app.model.Place({ id: id });
			place.destroy({
				success: function() {
					self.waitingView.hide();
					// delete from local the place
					window.places.models.splice(index, 1);
					self.render();
				},
				error: function(model, xhr, options){
					self.waitingView.hide();
					self.errorView.render([xhr.responseJSON.message]);
				}
			});
		};

		bootbox.dialog({
			message: '<h4>Are you sure to delete <b>' + name + '</b>?</h4>',
			buttons: {
				main: {
					label: "Cancel",
				},
				danger: {
					label: "Delete!",
					className: "btn-danger",
					callback: deleteFunction
				},
			}
		});
	},

	render: function(){
		var template = Zebra.tmpl.places;
		var html = template(window.places);
		this.$el.html(html);

		this.$el.find('.masonry-container').masonry({
			itemSelector: '.grid-item',
			columnWidth: 200
		});

		// activate masonry in all tabs
		var $container = this.$el.find('.masonry-container');
		this.$el.find('a[data-toggle=tab]').each(function() {
			var $this = $(this);
			// listen the event tab show
			$this.on('shown.bs.tab', function () {
				// when images load
				$container.imagesLoaded( function () {
					// init masonry
					$container.masonry({
						columnWidth: '.item',
						itemSelector: '.item'
					});
				});
			});
		});

		// draw gradient canvas
		_.each(document.getElementsByClassName('power-canvas'), function(canvas){
			var context = canvas.getContext('2d');
			context.rect(0, 0, canvas.width, canvas.height);
			var grd = context.createLinearGradient(0, 0, canvas.width, canvas.height);
			grd.addColorStop(0, 'RGBA(4, 3, 5, 1)');
			grd.addColorStop(0.142, 'RGBA(3, 4, 105, 1)');
			grd.addColorStop(0.284, 'RGBA(11, 52, 185, 1)');
			grd.addColorStop(0.426, 'RGBA(69, 233, 254, 1)');
			grd.addColorStop(0.568, 'RGBA(57, 183, 0, 1)');
			grd.addColorStop(0.710, 'RGBA(255, 252, 0, 1)');
			grd.addColorStop(0.852, 'RGBA(255, 141, 51, 1)');
			grd.addColorStop(1, 'RGBA(247, 26, 8, 1)');
			context.fillStyle = grd;
			context.fill();
		});

		return this;
	},

});