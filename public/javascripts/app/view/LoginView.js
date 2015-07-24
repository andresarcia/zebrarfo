var app = app || {};
app.view = app.view || {};

app.view.LoginView = Backbone.View.extend({

	el: '#login-container',

	events: {
		'click #login-submit':'checkSubmit',
		'keyup #login-email': 'checkEmail',
		'blur #login-email': 'emailFeedback',
		'focus #login-email': 'hideEmailFeedback',
		'keyup #login-password': 'checkPass',
		'blur #login-password': 'passwordFeedback',
		'focus #login-password': 'hidePasswordFeedback',
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
		var res;
		var password = $container.val();
		if(password.length > 0){
			this.password = password;
			res = true;
			this.hidePasswordFeedback();
		} else {
			this.password = undefined;
			res = false;
		}

		return res;
	},

	passwordFeedback: function(){
		if(!this.checkPass())
			this.$el.find('#login-password').tooltip('show');
	},

	hidePasswordFeedback: function(){
		this.$el.find('#login-password').tooltip('hide');
		this.hideAuthFeedback();
	},

	checkSubmit: function(){
		if(this.checkEmail() && this.checkPass()) this.submit();
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

			localStorage.removeItem('token');
			localStorage.removeItem('email');
			localStorage.token = res.token;
			localStorage.email = res.user.email;

			new app.router.AppRouter();
			window.location.hash = '#';
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
			title: 'Please enter a valid email address.',
			trigger: 'manual'
		});

		this.$el.find('#login-password').tooltip({
			title: 'Please enter password.',
			trigger: 'manual',
			placement: 'bottom',
		});

		this.$el.find('#login-form').tooltip({
			title: 'Your email or password was incorrect, please try again.',
			trigger: 'manual',
			placement: 'bottom',
		});

		var y = $(window).width() > 767 ? 3 : 0;
		this.$el.find('#scene').parallax({
			scalarX: 3,
			scalarY: y
		});

		return this;
	},

});