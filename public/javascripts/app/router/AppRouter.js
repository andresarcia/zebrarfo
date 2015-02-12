var app = app || {};
app.router = app.router || {};

app.router.AppRouter = Backbone.Router.extend({

	currentView: null,
	currentData: {
		data: null,
		id: null
	},

	initialize: function(options){
		this.verticalNav = new app.view.VerticalNavView();

		this.errorView = new app.view.ErrorView();
		this.waitingView = new app.view.WaitingView();
	},

	clearViews: function(){
		if(this.currentView) 
			this.currentView.undelegateEvents();
	},

	routes: {
		'places': 'showPlaces',
		'places/upload': 'uploadPlace',

		'places/:id' : 'showSinglePlace',
		'places/:id/edit?type=:type' : 'showEditPlace',
		'places/:id/charts?type=:type' : 'showChartsOfPlace',
		'places/:id/upload' : 'showSinglePlaceUpload',
		
		'hotspots': 'showHotspots',
		'hotspots/upload': 'uploadHotspots',

		'downloads/:id': 'downloads',
	},

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
		if(this.currentData.data === null || this.currentData.id != 'places'){
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

	renderVerticalNavMenuPlaces: function(index){
		this.verticalNav.renderSubMenuWithId(0,'vertical_nav_sub_menu_single_place_upload');
		this.verticalNav.showSubMenuWithClass(0,'upload-menu-item');

		this.verticalNav.changeActiveClass({
			index: index,
		});
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
			self.renderVerticalNavMenuPlaces([0]);
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
			self.renderVerticalNavMenuPlaces([0,0]);
		});
	},

	/*-------------------------------------------------------------------*/
	fetchSinglePlaceData: function(id,callback){
		if(this.currentData.data === null || this.currentData.id != 'singlePlace'){
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

	renderVerticalNavMenuSinglePlace: function(index,id){
		this.verticalNav.renderSubMenuWithId(0,'vertical_nav_sub_menu_single_place',id);
		this.verticalNav.showSubMenuWithClass(0,'single-place-menu-item');

		this.verticalNav.changeActiveClass({
			index: index,
		});
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
			self.renderVerticalNavMenuSinglePlace([0,0],id);
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
			self.renderVerticalNavMenuSinglePlace([0,1],id);
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
			self.renderVerticalNavMenuSinglePlace([0,2],id);
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

			self.verticalNav.renderSubMenuWithId(0,'vertical-nav-template-sub-menu-single-place',id);
			self.verticalNav.showSubMenuWithClass(0,'single-place-menu-item');
		});
	},

	/*-------------------------------------------------------------------*/
	showHotspots: function(){
		this.verticalNav.changeActiveClass({
			index: [1]
		});
	},

	uploadHotspots: function(){
		this.verticalNav.changeActiveClass({
			index: [1,0]
		});
	},

	/*-------------------------------------------------------------------*/
	downloads: function(id){
		$.fileDownload('/downloads/'+id);
		history.back();
	},

});