var app = app || {};
app.view = app.view || {};

app.view.HelpView = Backbone.View.extend({

	el: '#ws-containter',

	events: {
		'click #download-android-parser-v1': 'downloadV1',
		'click #download-android-parser-v2': 'downloadV2'
	},

	initialize: function(options){
		this.errorView = options.errorView;
		this.errorView.closeView();
		this.waitingView = options.waitingView;

		this.render();
	},

	downloadV1: function(){
		$.fileDownload('/downloads/android_parser.py');
	},

	downloadV2: function(){

	},

	render: function(){
		var template = Zebra.tmpl.upload_help_info;
		var html = template();
		this.$el.html(html);

		return this;
	},

});