var app = app || {};
app.router = app.router || {};

app.router.LoginRouter = Backbone.Router.extend({

	routes: {
		'': 'login',
	},

	initialize: function(options){
		var template = Zebra.tmpl.main_login;
		var html = template();
		$("#z-body").html(html);

		this.waitingView = new app.view.WaitingView();
		this.currentView = null;
	},

	clearViews: function(){
		if(this.currentView) this.currentView.undelegateEvents();
	},

	login: function(){
		this.clearViews();
		this.currentView = new app.view.LoginView({
			waitingView: this.waitingView,
		});
	},

});