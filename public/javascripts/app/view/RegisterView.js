var app = app || {};
app.view = app.view || {};

app.view.RegisterView = Backbone.View.extend({

	el: '#z-modal',

	events: {
		'keyup #reg-email': 'checkEmail',
		'blur #reg-email': 'emailFeedback',
		'focus #reg-email': 'focusEmail',

		'keyup #reg-password': 'checkPassword',
		'focus #reg-password': 'focusPassword',
		'blur #reg-password': 'blurPassword',

		'keyup #reg-repeat-password': 'checkRepeatPassword',
		'focus #reg-repeat-password': 'focusRepeatPassword',
		'blur #reg-repeat-password': 'blurRepeatPassword',

		'click #reg-submit':'submit',
	},

	initialize: function(options){
		this.waitingView = options.waitingView;
		this.render();
	},

	checkEmail: function(evt){
		var $container = this.$el.find('#reg-email');
		var email = $container.val();
		var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		var res;
		if(regex.test(email)){
			res = true;
			this.email = email;
		} else {
			res = false;
			this.email = undefined;
		}

		this.checkSubmit();
		return res;
	},

	focusEmail: function(){
		this.$el.find('#reg-email').tooltip('hide');
		this.$el.find('#reg-email').parent().tooltip('hide');
		this.$el.find('#reg-password').tooltip('hide');
	},

	emailFeedback: function(){
		if(!this.checkEmail())
			this.$el.find('#reg-email').tooltip('show');
	},

	checkPassword: function(){
		var $container = this.$el.find('#reg-password');
		var password = $container.val();
		var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
		var res;
		if(regex.test(password)){
			res = true;
			this.password = password;
			this.$el.find('#reg-password').tooltip('hide');
		} else {
			res = false;
			this.password = undefined;
		}

		this.checkSubmit();
		return res;
	},

	focusPassword: function(){
		this.$el.find('#reg-password').tooltip('show');
		this.$el.find('#reg-repeat-password').tooltip('hide');
	},

	blurPassword: function(){
		if(!this.checkPassword())
			this.$el.find('#reg-password').tooltip('show');
		else {
			if(this.repeatPassword !== "")
				this.$el.find('#reg-repeat-password').tooltip('show');
		}
	},

	checkRepeatPassword: function(){
		var $container = this.$el.find('#reg-repeat-password');
		var password = $container.val();
		var res;

		if(this.password == password){
			res = true;
			this.repeatPassword = password;
			this.$el.find('#reg-repeat-password').tooltip('hide');
		} else {
			res = false;
			this.repeatPassword = undefined;
		}

		this.checkSubmit();
		return res;
	},

	blurRepeatPassword: function(){
		if(!this.checkRepeatPassword()){
			if(!this.password)
				this.$el.find('#reg-password').tooltip('show');
			else
				this.$el.find('#reg-repeat-password').tooltip('show');
		}
	},

	focusRepeatPassword: function(){
		this.$el.find('#reg-password').tooltip('hide');
	},

	checkSubmit: function(){
		if(this.email && this.password && this.repeatPassword && this.password == this.repeatPassword)
			this.$el.find('#reg-submit').prop("disabled",false);
		else
			this.$el.find('#reg-submit').prop("disabled",true);
	},

	enable: function(){
		this.$el.find('#reg-email').prop("disabled",false);
		this.$el.find('#reg-password').prop("disabled",false);
		this.$el.find('#reg-repeat-password').prop("disabled",false);
		this.$el.find('#reg-submit').prop("disabled",false);
	},

	disable: function(){
		this.$el.find('#reg-email').prop("disabled",true);
		this.$el.find('#reg-password').prop("disabled",true);
		this.$el.find('#reg-repeat-password').prop("disabled",true);
		this.$el.find('#reg-submit').prop("disabled",true);
	},

	submit: function(){
		var self = this;
		this.disable();
		$.ajax({
			url: "api/users",
			type: "POST",
				data: { email: this.email, password: this.password },
			beforeSend: function() {
				self.waitingView.render();
			}
		})
		.done(function( res ) {
			self.waitingView.closeView();
		})
		.fail(function(err) {
			self.enable();
			self.waitingView.closeView();
			self.$el.find('#reg-email').parent().tooltip('show');
		});
	},

	render: function(){
		var template = Zebra.tmpl.register;
		var html = template();
		this.$el.html(html);

		this.$el.find('#reg-modal').modal({
			backdrop : 'static',
			keyboard: false,
		});

		this.$el.find('#reg-email').tooltip({
			title: 'Enter a valid email address.',
			trigger: 'manual'
		});

		template = Zebra.tmpl.password_requirements;
		html = template();
		this.$el.find('#reg-password').tooltip({
			template: html,
			title: 'hola',
			trigger: 'manual',
			placement: 'bottom',

			html: true
		});

		this.$el.find('#reg-repeat-password').tooltip({
			title: 'The password you entered do not match.',
			trigger: 'manual'
		});

		this.$el.find('#reg-email').parent().tooltip({
			title: 'This email address is being used in another Zebra RFO account',
			trigger: 'manual',
		});

		return this;
	},


});