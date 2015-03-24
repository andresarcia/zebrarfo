var app = app || {};
app.view = app.view || {};

app.view.HelpView = Backbone.View.extend({

	el: '#ws-containter',

	events: {
		'click #download-android-parser-txt': 'downloadTxt',
		'click #download-android-parser-json': 'downloadJson'
	},

	initialize: function(options){
		this.errorView = options.errorView;
		this.waitingView = options.waitingView;

		this.render();
	},

	downloadTxt: function(){
		$.fileDownload('/downloads/android_parser_to_txt.py');
	},

	downloadJson: function(){
		$.fileDownload('/downloads/android_parser_to_json.py');
	},

	render: function(){
		var template = Zebra.tmpl.upload_help_info;
		var html = template();
		this.$el.html(html);

		return this;
	},

});