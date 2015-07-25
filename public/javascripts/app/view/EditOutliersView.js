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
			self.waitingView.show();
			var outlier = window.place.attributes.outliers[index];
			outlier.destroy({
				success: function(model) {
					var id = window.place.id;
					delete window.place;
					window.settings.place = {};
					self.waitingView.hide();
					window.location.hash = '#places/'+ id;
				},
				error: function(model, xhr, options){
					if(xhr.responseJSON.message == "Access token has expired"){
						localStorage.removeItem('token');
						window.location.hash = '#';
					} else {
						self.waitingView.hide();
						self.errorView.render([xhr.responseJSON.message]);
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
		var html = template({
			outliers: window.place.attributes.outliers,
			shared: window.place.attributes.shared,
		});
		this.$el.html(html);
		this.waitingView.hide();

		return this;
	},

});