var app = app || {};
app.view = app.view || {};

app.view.LoginView = Backbone.View.extend({

	el: '#ws-containter',

	events: {
		'click #login-submit':'submit',
		'keyup #login-email': 'checkEmail',
		'blur #login-email': 'emailFeedback',
		'focus #login-email': 'hideEmailFeedback',
		'keyup #login-password': 'checkPass',
		'focus #login-password': 'hideAuthFeedback',
		'click #login-new-account': 'createNewAccount',
	},

	initialize: function(options){
		this.waitingView = options.waitingView;
		this.waitingView.hide();

		this.render();
	},

	checkEmail: function(evt){
		var $container = this.$el.find('#login-email');
		var email = $container.val();
		var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		var res;
		if(regex.test(email)){
			res = true;
			this.email = email;
			this.hideEmailFeedback();
		} else {
			res = false;
			this.email = undefined;
		}

		this.checkSubmit();
		return res;
	},

	emailFeedback: function(){
		if(!this.checkEmail())
			this.$el.find('#login-email').tooltip('show');
	},

	hideEmailFeedback: function(){
		this.$el.find('#login-email').tooltip('hide');
		this.hideAuthFeedback();
	},

	checkPass: function(evt){
		var $container = this.$el.find('#login-password');
		var password = $container.val();
		if(password.length > 0)
			this.password = password;
		else
			this.password = undefined;

		this.checkSubmit();
	},

	checkSubmit: function(){
		if(this.email && this.password)
			this.$el.find('#login-submit').prop("disabled",false);
		else
			this.$el.find('#login-submit').prop("disabled",true);
	},

	enable: function(){
		this.$el.find('#login-email').prop("disabled",false);
		this.$el.find('#login-password').prop("disabled",false);
		this.$el.find('#login-submit').prop("disabled",false);
	},

	disable: function(){
		this.$el.find('#login-email').prop("disabled",true);
		this.$el.find('#login-password').prop("disabled",true);
		this.$el.find('#login-submit').prop("disabled",true);
	},

	hideAuthFeedback: function(){
		this.$el.find('#login-form').tooltip('hide');
	},

	submit: function(){
		var self = this;
		this.disable();
		$.ajax({
			url: "api/login",
			type: "POST",
				data: { email: this.email, password: this.password },
			beforeSend: function() {
				self.waitingView.show();
			}
		})
		.done(function( res ) {
			self.waitingView.hide();
			localStorage.token = res.token;
			localStorage.email = res.user.email;
			window.location.hash = '#places';
		})
		.fail(function(err) {
			self.enable();
			self.waitingView.hide();
			self.$el.find('#login-form').tooltip('show');
		});
	},

	createNewAccount: function(){
		this.hideEmailFeedback();
		this.hideAuthFeedback();
		new app.view.RegisterView({
			waitingView: this.waitingView,
		});
	},

	render: function(){
		var template = Zebra.tmpl.login;
		var html = template();
		this.$el.html(html);

		this.$el.find('#login-email').tooltip({
			title: 'Enter a valid email address.',
			trigger: 'manual'
		});

		this.$el.find('#login-form').tooltip({
			title: 'Your email or password was incorrect, please try again.',
			trigger: 'manual',
			placement: 'bottom',
		});

		return this;
	},

});