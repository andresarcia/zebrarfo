var com = com || {};
com.spantons = com.spantons || {};
com.spantons.router = com.spantons.router || {};

com.spantons.router.AppRouter = Backbone.Router.extend({

	helperViews: {
		errorView: null,
		waitingView: null
	},

	navViews : {
		verticalNav: null
	},

	currentView: null,
	currentData: {
		data: null,
		id: null,
		innerData: {},
	},

	initialize: function(options){
		this.navViews.verticalNav = new com.spantons.view.VerticalNavView();

		this.helperViews.errorView = new com.spantons.view.ErrorView();
		this.helperViews.waitingView = new com.spantons.view.WaitingView();
	},

	clearViews: function(){
		if(this.currentView) 
			this.currentView.undelegateEvents();
	},

	routes: {
		'places': 'showPlaces',
		'places/upload': 'uploadPlace',

		'places/:id' : 'showSinglePlace',
		'places/:id/maps' : 'showMapsOfPlace',
		'places/:id/charts?type=:type' : 'showChartsOfPlace',
		'places/:id/upload' : 'showSinglePlaceUpload',
		
		'hotspots': 'showHotspots',
		'hotspots/upload': 'uploadHotspots'
	},

	/*-------------------------------------------------------------------*/
	fetchPlacesData: function(callback){
		if(this.currentData.data === null || this.currentData.id != 'places'){
			var self = this;
			this.helperViews.waitingView.render();

			this.currentData.innerData = {};
			this.currentData.id = 'places';
			this.currentData.data = new com.spantons.collection.Places();
			this.currentData.data.fetch({
				success: function(e){  
					self.helperViews.waitingView.closeView();
					callback();
			    },
			    error: function(e){  
			     	self.waitingView.closeView();
			     	self.errorView.render(['Occurred an error retrieving the places']);
			    }
			});
		} else
			callback();
	},

	renderVerticalNavMenuPlaces: function(index){
		this.navViews.verticalNav.renderSubMenuWithId(0,'vertical-nav-template-sub-menu-single-place-upload');
		this.navViews.verticalNav.showSubMenuWithClass(0,'upload-menu-item');

		this.navViews.verticalNav.changeActiveClass({
			index: index,
		});
	},

	showPlaces: function(){
		var self = this;
		this.clearViews();
		this.fetchPlacesData(function(){
  			self.currentView = new com.spantons.view.PlacesView({
				waitingView: self.helperViews.waitingView,
				errorView : self.helperViews.errorView,
				data: self.currentData.data
			});
			self.renderVerticalNavMenuPlaces([0]);
		});
	},

	uploadPlace: function(){
		var self = this;
		this.clearViews();
		this.fetchPlacesData(function(){
  			self.currentView = new com.spantons.view.UploadMeasuresView({
				waitingView: self.helperViews.waitingView,
				errorView : self.helperViews.errorView,
				data: self.currentData.data
			});
			self.renderVerticalNavMenuPlaces([0,0]);
		});
	},

	/*-------------------------------------------------------------------*/
	fetchSinglePlaceData: function(id,callback){
		if(this.currentData.data === null || this.currentData.id != 'singlePlace'){
			var self = this;
			this.helperViews.waitingView.render();

			var data = new com.spantons.model.Place({id:id});
			data.fetch({
				success: function(e){  
					self.setPlaceData(data);
			    	callback();
			    },
			    error: function(e){  
			     	self.waitingView.closeView();
			     	self.errorView.render(['Occurred an error retrieving the places']);
			    }
			});
		} else
			callback();
	},

	setPlaceData: function(data){
		this.currentData.innerData = {};
		this.currentData.id = 'singlePlace';
		this.currentData.data = data;
		com.spantons.util.SetChannelsInRange(this.currentData.data.attributes.frequencyMin, this.currentData.data.attributes.frequencyMax);
	},

	renderVerticalNavMenuSinglePlace: function(index,id){
		this.navViews.verticalNav.renderSubMenuWithId(0,'vertical-nav-template-sub-menu-single-place',id);
		this.navViews.verticalNav.showSubMenuWithClass(0,'single-place-menu-item');

		this.navViews.verticalNav.changeActiveClass({
			index: index,
		});
	},

	showSinglePlace: function(id){  		
		this.clearViews();
		var self = this;
		this.fetchSinglePlaceData(id,function(){
			self.currentView = new com.spantons.view.SinglePlaceView({
				waitingView: self.helperViews.waitingView,
				errorView : self.helperViews.errorView,
				data: self.currentData.data
			});
			self.renderVerticalNavMenuSinglePlace([0,0],id);
		});
	},

	showMapsOfPlace: function(id){
		var self = this;
		this.clearViews();
		this.fetchSinglePlaceData(id,function(){
			self.currentView = new com.spantons.view.MapsView({
				waitingView: self.helperViews.waitingView,
				errorView : self.helperViews.errorView,
				data: self.currentData.data,
			});
			self.renderVerticalNavMenuSinglePlace([0,1],id);
		});
	},

	showChartsOfPlace: function(id,type){
		if(this.currentView !== null && this.currentView.id == 'placeChart')
			return;

		this.clearViews();
		var self = this;
		var chartType;

		if(type === 'occupation') 
			chartType = 0;
		else if(type === 'heatmap') 
			chartType = 1;

		this.fetchSinglePlaceData(id,function(){
			self.currentView = new com.spantons.view.ChartsView({
				waitingView: self.helperViews.waitingView,
				errorView : self.helperViews.errorView,
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
  			self.currentView = new com.spantons.view.UploadMeasuresView({
				waitingView: self.helperViews.waitingView,
				errorView : self.helperViews.errorView,
				data: self.currentData.data
			});

			self.navViews.verticalNav.renderSubMenuWithId(0,'vertical-nav-template-sub-menu-single-place',id);
			self.navViews.verticalNav.showSubMenuWithClass(0,'single-place-menu-item');
		});
	},

	/*-------------------------------------------------------------------*/
	showHotspots: function(){
		this.navViews.verticalNav.changeActiveClass({
			index: [1]
		});
	},

	uploadHotspots: function(){
		this.navViews.verticalNav.changeActiveClass({
			index: [1,0]
		});
	}

});