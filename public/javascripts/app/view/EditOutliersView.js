var app = app || {};
app.view = app.view || {};

app.view.EditOutliersView = Backbone.View.extend({

	events: {
		'click .btn-delete-outlier' : 'delete'
	},

	initialize: function(options){
		this.errorView = options.errorView;
		this.errorView.closeView();
		this.waitingView = options.waitingView;
		this.data = options.data;
	},

	delete: function(evt){
		var self = this;
		var index = $('.btn-delete-outlier').index(evt.currentTarget);

		var deleteFunction = function(){
			self.waitingView.render();
			var outlier = self.data.attributes.outliers[index];
			outlier.destroy({
				success: function(model) {
					console.log(model);
	  		// 		self.data = model;
					// self.data.attributes.coordinates = self.coordinates;
					// self.data.attributes.outliers = undefined;
					// self.data.attributes.charts = undefined;
					// window.settings.place = {};
					self.waitingView.closeView();
					// window.location.hash = '#places/'+ model.id;
				},
				error: function(model, xhr, options){
		     		self.waitingView.closeView();
		     		self.errorView.render([xhr.responseText]);
		    	}
			});
		};

		bootbox.dialog({
	  		message: '<h4>Are you sure to delete captures with <b> power ' + this.data.attributes.outliers[index].attributes.power + ' dBm</b>?</h4>',
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
		var html = template(this.data.attributes.outliers);
		this.$el.html(html);
		this.waitingView.closeView();

		return this;
	},

});