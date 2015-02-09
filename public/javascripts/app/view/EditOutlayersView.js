var app = app || {};
app.view = app.view || {};

app.view.EditOutlayersView = Backbone.View.extend({

	events: {
		'click .btn-delete-outlayer' : 'delete'
	},

	initialize: function(options){
		this.errorView = options.errorView;
		this.errorView.closeView();
		this.waitingView = options.waitingView;
		this.data = options.data;
	},

	delete: function(evt){
		var self = this;
		var index = $('.btn-delete-outlayer').index(evt.currentTarget);

		var deleteFunction = function(){
			self.waitingView.render();
			var outlayer = self.data.attributes.outlayers[index];
			outlayer.destroy({
				success: function() {
	  				self.waitingView.closeView();
	  				window.location.hash = '#places/'+ self.data.id;
				},
				error: function(model, xhr, options){
		     		self.waitingView.closeView();
		     		self.errorView.render([xhr.responseText]);
		    	}
			});
		};

		bootbox.dialog({
	  		message: '<h4>Are you sure to delete captures with <b> power ' + this.data.attributes.outlayers[index].attributes.power + ' dBm</b>?</h4>',
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
		var template = Zebra.tmpl['edit_outlayers'];
		var html = template(this.data.attributes.outlayers);
		this.$el.html(html);

		return this;
	},

});