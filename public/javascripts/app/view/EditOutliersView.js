var app = app || {};
app.view = app.view || {};

app.view.EditOutliersView = Backbone.View.extend({

	events: {
		'click .btn-delete-outlier' : 'delete'
	},

	initialize: function(options){
		this.errorView = options.errorView;
		this.waitingView = options.waitingView;
	},

	delete: function(evt){
		var self = this;
		var index = $('.btn-delete-outlier').index(evt.currentTarget);

		var deleteFunction = function(){
			self.waitingView.render();
			var outlier = window.place.attributes.outliers[index];
			outlier.destroy({
				success: function(model) {
					var id = window.place.id;
					delete window.place;
					window.settings.place = {};
					self.waitingView.closeView();
					window.location.hash = '#places/'+ id;
				},
				error: function(model, xhr, options){
					if(xhr.responseJSON.message == "Access token has expired"){
						localStorage.removeItem('token');
						window.location.hash = '#';
					} else {
						self.waitingView.closeView();
						self.errorView.render([xhr.responseText]);
					}
				}
			});
		};

		bootbox.dialog({
			message: '<h4>Are you sure to delete captures with <b> power ' + window.place.attributes.outliers[index].attributes.power + ' dBm</b>?</h4>',
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
		var template = Zebra.tmpl.edit_outliers;
		var html = template(window.place.attributes.outliers);
		this.$el.html(html);
		this.waitingView.closeView();

		return this;
	},

});