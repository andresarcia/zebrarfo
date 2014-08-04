var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.ErrorView = Backbone.View.extend({

	el: '#error',
	message: '',

	events : {
		'click #error-button' : 'closeView'
	},
	
	initialize: function(options){

	},

	render: function(msg){
		var self = this;
		var errorTitle;
		if (msg.length > 1) 
			errorTitle = 'Errors:';
		else
			errorTitle = 'Error:';

		this.message = msg;
		var source = $('#error-template').html();
		var template = Handlebars.compile(source);
		var html = template({message: this.message, title: errorTitle});
		this.$el.html(html);
		this.$el.show();

		this.$el.click(function(){
			self.shakeButton();
		});

		return this;
	},

	closeView: function(){
		this.message= '';
		this.$el.fadeOut(250);
	},

	shakeButton: function(){
		$('#error-button').addClass('animated').addClass('shake');
		$('#error-button').one('webkitAnimationEnd oanimationend msAnimationEnd animationend',function(e) {
            $('#error-button').removeClass('animated').removeClass('shake');
        });
	}	

});