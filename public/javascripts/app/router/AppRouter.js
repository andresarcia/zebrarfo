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
		if(!localStorage.token){
			window.location.hash = '#';
			return;
		}

		var self = this;
		$.ajax({
			url: "api/logout",
			type: "POST",
			headers: {
				"x-access-token":localStorage.token,
			},
			beforeSend: function() {
				self.waitingView.render();
			}
		})
		.done(function( res ) {
			self.waitingView.closeView();
			localStorage.removeItem('token');
			window.location.hash = '#';
		})
		.fail(function(err) {
			window.location.hash = '#';
		});
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

	/*-------------------------------------------------------------------*/
	fetchPlacesData: function(callback){
		if(this.currentData.data === null || this.currentData.data.length === 0 || this.currentData.id != 'places'){
			var self = this;
			this.waitingView.render();

			this.currentData.id = 'places';
			this.currentData.data = new app.collection.Places();
			this.currentData.data.fetch({
				success: function(){  
					self.waitingView.closeView();
					callback();
				},
				error: function(model, xhr, options){
					self.waitingView.closeView();
					self.errorView.render([xhr.responseText]);
				}
			});
		} else 
			callback();
	},

	renderMenuPlaces: function(index){
		this.menu.renderSubMenu(0,'main_menu_sub_upload');
		this.menu.changeActive(index);
	},

	showPlaces: function(){
		var self = this;
		this.clearViews();
		this.fetchPlacesData(function(){
			self.currentView = new app.view.PlacesView({
				waitingView: self.waitingView,
				errorView : self.errorView,
				data: self.currentData.data
			});
			self.renderMenuPlaces([0]);
		});
	},

	uploadPlace: function(){
		var self = this;
		this.clearViews();
		this.fetchPlacesData(function(){
			self.currentView = new app.view.UploadMeasuresView({
				waitingView: self.waitingView,
				errorView : self.errorView,
				data: self.currentData.data
			});
			self.renderMenuPlaces([0,0]);
		});
	},

	/*-------------------------------------------------------------------*/
	fetchSinglePlaceData: function(id,callback){
		if(this.currentData.data === null || this.currentData.data.length === 0 || this.currentData.id != 'singlePlace'){
			var self = this;
			this.waitingView.render();
			window.settings.place = {};
			var data = new app.model.Place({id:id});
			data.fetch({
				success: function(){  
					self.setPlaceData(data,function(){
						callback();
					});
				},
				error: function(model, xhr, options){
					self.waitingView.closeView();
					self.errorView.render([xhr.responseText]);
				}
			});
		} else
			callback();
	},

	setPlaceData: function(data,callback){
		var self = this;
		this.currentData.id = 'singlePlace';
		this.currentData.data = data;
		window.settings.fixedChannels = this.setChannelsInRange(this.currentData.data.attributes.frequencyMin, this.currentData.data.attributes.frequencyMax);
		if(this.currentData.data.attributes.coordinates){
			self.waitingView.closeView();
			callback();
		} else {
			var coordinates = new app.collection.Coordinates({idPlace:this.currentData.data.id});
			coordinates.fetch({
				success: function(){
					self.waitingView.closeView();
					self.currentData.data.attributes.coordinates = coordinates.models[0].attributes.coordinates;
					callback();
				},
				error: function(model, xhr, options){
					self.waitingView.closeView();
					self.errorView.render([xhr.responseText]);
					callback();
				}
			});
		}
	},

	renderMenuSinglePlace: function(index,id){
		this.menu.renderSubMenu(0,'main_menu_sub_single_place',id);

		this.menu.changeActive(index);
	},

	showSinglePlace: function(id){
		var self = this;
		this.clearViews();
		this.fetchSinglePlaceData(id,function(){
			self.currentView = new app.view.SinglePlaceView({
				waitingView: self.waitingView,
				errorView : self.errorView,
				data: self.currentData.data
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

		this.fetchSinglePlaceData(id,function(){
			self.currentView = new app.view.EditPlaceView({
				waitingView: self.waitingView,
				errorView : self.errorView,
				data: self.currentData.data,
				type: editType
			});
			self.renderMenuSinglePlace([0,1],id);
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

		this.fetchSinglePlaceData(id,function(){
			self.currentView = new app.view.ChartsView({
				waitingView: self.waitingView,
				errorView : self.errorView,
				data: self.currentData.data,
				type: chartType
			});
			self.renderMenuSinglePlace([0,2],id);
		});
	},

	showSinglePlaceUpload: function(id){
		var self = this;
		this.clearViews();
		this.fetchSinglePlaceData(id,function(){
			self.currentView = new app.view.UploadMeasuresView({
				waitingView: self.waitingView,
				errorView : self.errorView,
				data: self.currentData.data
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