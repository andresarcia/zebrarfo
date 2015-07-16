var app = app || {};
app.router = app.router || {};

app.router.AppRouter = Backbone.Router.extend({

	currentView: null,
	currentData: {
		data: null,
		id: null
	},

	routes: {
		'': 'showPlaces',
		'logout': 'logout',

		'places': 'showPlaces',
		'places/upload': 'uploadPlace',

		'places/:id' : 'showPlace',
		'places/:id/edit?type=:type' : 'showEditPlace',
		'places/:id/charts?type=:type' : 'showChartsOfPlace',
		'places/:id/upload' : 'showPlaceUpload',
		
		'help': 'showHelp',

		'downloads/:id': 'downloads',
	},

	initialize: function(options){
		var backboneSync = Backbone.sync;
		Backbone.sync = function (method, model, options) {
			if (localStorage.token){
				options.headers = { 'x-access-token': localStorage.token };
				backboneSync(method, model, options);
			} else 
				window.location.hash = '#';
		};

		var template = Zebra.tmpl.main;
		var html = template();
		$("#z-body").html(html);

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
			new app.router.LoginRouter();
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
				callback(xhr.responseJSON.message);
			}
		});
	},

	fetchPlace: function(id,callback){
		if(window.place && this.checkSession())
			return callback();

		var self = this;
		this.waitingView.show();
		window.settings.place = {};
		window.place = new app.model.Place({id:id});
		window.place.fetch({
			success: function(){  
				self.waitingView.hide();
				window.settings.fixedChannels = self.setChannelsInRange(
					window.place.attributes.frequencyMin, window.place.attributes.frequencyMax);

				if(window.place.attributes.frequenciesBands.length > 1) window.settings.currBand = [1];
				else window.settings.currBand = [0];

				if(window.place.attributes.frequenciesChannelWidth) window.settings.currChannel = 0;

				callback();
			},
			error: function(model, xhr, options){
				callback(xhr.responseJSON.message);
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
				callback(xhr.responseJSON.message);
			}
		});
	},

	/*-------------------------------------------------------------------*/
	logout: function(){
		if(!this.checkSession()) return;

		var self = this;
		$.ajax({
			url: "api/logout",
			type: "POST",
			headers: {
				"x-access-token": localStorage.token,
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
			delete window.settings.place;

			new app.router.LoginRouter();
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
		this.fetchPlaces(function(err){
			if(err) return self.errorRequest(err);

			self.clearViews();
			self.currentView = new app.view.PlacesView({
				waitingView: self.waitingView,
				errorView : self.errorView,
			});
			self.renderMenuPlaces([0]);
		});
	},

	uploadPlace: function(){
		var self = this;
		this.fetchPlaces(function(err){
			if(err) return self.errorRequest(err);

			self.clearViews();
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

	showPlace: function(id){
		var self = this;
		this.fetchPlace(id, function(err){
			if(err) return self.errorRequest(err);

			self.clearViews();
			self.currentView = new app.view.PlaceView({
				waitingView: self.waitingView,
				errorView : self.errorView,
			});
			self.renderMenuSinglePlace([0,0],id);
		});
	},

	showEditPlace: function(id,type){
		if(this.currentView !== null && this.currentView.id == 'edit-place')
			return;

		var self = this;
		var editType;

		if(type === 'coordinates') editType = 0;
		else if(type === 'outliers') editType = 1;

		this.fetchPlace(id, function(err){
			if(err) return self.errorRequest(err);

			self.fetchOutliers(function(err){
				if(err) return self.errorRequest(err);

				self.clearViews();
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

		var self = this;
		var chartType;

		if(type === 'occupation') chartType = 0;
		else if(type === 'heatmap') chartType = 1;
		else if(type === 'white-spaces') chartType = 2;

		this.fetchPlace(id, function(err){
			if(err) return self.errorRequest(err);

			self.clearViews();
			self.currentView = new app.view.ChartsView({
				waitingView: self.waitingView,
				errorView : self.errorView,
				type: chartType
			});
			self.renderMenuSinglePlace([0,2],id);
		});
	},

	showPlaceUpload: function(id){
		var self = this;
		this.fetchPlace(id, function(err){
			if(err) return self.errorRequest(err);

			self.clearViews();
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