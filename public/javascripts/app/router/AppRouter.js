var app = app || {};
app.router = app.router || {};

app.router.AppRouter = Backbone.Router.extend({

	currentView: null,
	currentData: {
		data: null,
		id: null
	},

	initialize: function(options){
		new app.view.NavbarView();
		this.menu = new app.view.MainMenuView();
		this.errorView = new app.view.ErrorView();
		this.waitingView = new app.view.WaitingView();
	},

	clearViews: function(){
		if(this.currentView) 
			this.currentView.undelegateEvents();
		this.errorView.closeView();
	},

	routes: {
		'': 'home',
		'logout': 'logout',

		'places': 'showPlaces',
		'places/upload': 'uploadPlace',

		'places/:id' : 'showSinglePlace',
		'places/:id/edit?type=:type' : 'showEditPlace',
		'places/:id/charts?type=:type' : 'showChartsOfPlace',
		'places/:id/upload' : 'showSinglePlaceUpload',
		
		'help': 'showHelp',

		'downloads/:id': 'downloads',
	},

	/*-------------------------------------------------------------------*/
	setChannelsInRange: function(frequencyMin,frequencyMax){
		var data = [];
		_.each(window.settings.channels, function(item){
			var aux = [];
			_.each(item, function(channel){
				if(frequencyMin < channel.to && frequencyMax > channel.from)
					aux.push(channel);
			});
			data.push(aux);
		});
		return data;
	},

	checkSession: function(){
		if(!localStorage.token){
			window.location.hash = '#';
			return false;
		}

		return true;
	},

	errorRequest: function(msg){
		if(msg == "Access token has expired"){
			localStorage.removeItem('token');
			window.location.hash = '#';
		} else {
			this.waitingView.hide();
			this.errorView.render([msg]);
		}
	},

	/*-------------------------------------------------------------------*/
	fetchPlaces: function(callback){
		if(window.places && this.checkSession())
			return callback();

		var self = this;
		this.waitingView.show();
		window.places = new app.collection.Places();
		window.places.fetch({
			success: function(){  
				self.waitingView.hide();
				callback();
			},
			error: function(model, xhr, options){
				self.errorRequest(xhr.responseJSON.message);
			}
		});
	},

	fetchSinglePlace: function(id,callback){
		if(window.place && this.checkSession())
			return callback();

		var self = this;
		this.waitingView.show();
		window.settings.place = {};
		window.place = new app.model.Place({id:id});
		window.place.fetch({
			success: function(){  
				self.waitingView.hide();
				window.settings.fixedChannels = self.setChannelsInRange(window.place.attributes.frequencyMin, window.place.attributes.frequencyMax);
				callback();
			},
			error: function(model, xhr, options){
				self.errorRequest(xhr.responseJSON.message);
			}
		});
	},

	fetchOutliers: function(callback){
		if(window.place.attributes.outliers && this.checkSession())
			return callback();

		this.waitingView.show();
		var self = this;
		var data = new app.collection.Outliers({idPlace:window.place.id});
		data.fetch({
			success: function(){
				self.waitingView.hide();
				window.place.attributes.outliers = data.models;
				callback();
			},
			error: function(model, xhr, options){
				self.errorRequest(xhr.responseJSON.message);
			}
		});
	},

	fetchChart: function(callback){
		if(window.place.attributes.charts && this.checkSession())
			return callback();

		this.waitingView.show();
		var self = this;
		var data = new app.model.ChartsData({idPlace:window.place.id});
		data.fetch({
			success: function(){
				self.waitingView.hide();
				window.place.attributes.charts = data.attributes.data;
				callback();
			},
			error: function(model, xhr, options){
				self.errorRequest(xhr.responseJSON.message);
			}
		});
	},

	/*-------------------------------------------------------------------*/
	home: function(){
		if(localStorage.token)
			this.showPlaces();
		else
			this.login();
	},

	login: function(){
		this.clearViews();
		this.currentView = new app.view.LoginView({
			waitingView: this.waitingView,
		});
	},

	logout: function(){
		if(!this.checkSession())
			return;

		var self = this;
		$.ajax({
			url: "api/logout",
			type: "POST",
			headers: {
				"x-access-token":localStorage.token,
			},
			beforeSend: function() {
				self.waitingView.show();
			}
		})
		.done(function( res ) {
			self.waitingView.hide();
			localStorage.removeItem('token');
			localStorage.removeItem('email');
			delete window.places;
			delete window.place;
			window.settings.place = {};
			window.location.hash = '#';
		})
		.fail(function(err) {
			window.location.hash = '#';
		});
	},

	/*-------------------------------------------------------------------*/
	renderMenuPlaces: function(index){
		this.menu.renderSubMenu(0,'main_menu_sub_upload');
		this.menu.changeActive(index);
	},

	showPlaces: function(){
		var self = this;
		this.clearViews();
		this.fetchPlaces(function(){
			self.currentView = new app.view.PlacesView({
				waitingView: self.waitingView,
				errorView : self.errorView,
			});
			self.renderMenuPlaces([0]);
		});
	},

	uploadPlace: function(){
		var self = this;
		this.clearViews();
		this.fetchPlaces(function(){
			self.currentView = new app.view.UploadMeasuresView({
				waitingView: self.waitingView,
				errorView : self.errorView,
			});
			self.renderMenuPlaces([0,0]);
		});
	},

	/*-------------------------------------------------------------------*/
	renderMenuSinglePlace: function(index,id){
		this.menu.renderSubMenu(0,'main_menu_sub_single_place',id);
		this.menu.changeActive(index);
	},

	showSinglePlace: function(id){
		var self = this;
		this.clearViews();
		this.fetchSinglePlace(id,function(){
			self.currentView = new app.view.SinglePlaceView({
				waitingView: self.waitingView,
				errorView : self.errorView,
			});
			self.renderMenuSinglePlace([0,0],id);
		});
	},

	showEditPlace: function(id,type){
		if(this.currentView !== null && this.currentView.id == 'edit-place')
			return;

		this.clearViews();
		var self = this;
		var editType;

		if(type === 'coordinates') 
			editType = 0;
		else if(type === 'outliers') 
			editType = 1;

		this.fetchSinglePlace(id,function(){
			self.fetchOutliers(function(){
				self.currentView = new app.view.EditPlaceView({
					waitingView: self.waitingView,
					errorView : self.errorView,
					type: editType
				});
				self.renderMenuSinglePlace([0,1],id);
			});
		});
	},

	showChartsOfPlace: function(id,type){
		if(this.currentView !== null && this.currentView.id == 'place-charts')
			return;

		this.clearViews();
		var self = this;
		var chartType;

		if(type === 'occupation') 
			chartType = 0;
		else if(type === 'heatmap') 
			chartType = 1;
		else if(type === 'white-spaces') 
			chartType = 2;

		this.fetchSinglePlace(id,function(){
			self.fetchChart(function(){
				self.currentView = new app.view.ChartsView({
					waitingView: self.waitingView,
					errorView : self.errorView,
					type: chartType
				});
				self.renderMenuSinglePlace([0,2],id);
			});
		});
	},

	showSinglePlaceUpload: function(id){
		var self = this;
		this.clearViews();
		this.fetchSinglePlace(id,function(){
			self.currentView = new app.view.UploadMeasuresView({
				waitingView: self.waitingView,
				errorView : self.errorView,
			});

			self.renderMenuSinglePlace([0],id);
		});
	},

	/*-------------------------------------------------------------------*/
	showHelp: function(){
		this.clearViews();
		this.currentView = new app.view.HelpView({
			waitingView: this.waitingView,
			errorView : this.errorView,
		});
		this.menu.changeActive([1]);
	},

	/*-------------------------------------------------------------------*/
	downloads: function(id){
		$.fileDownload('/downloads/'+id);
		history.back();
	},

});