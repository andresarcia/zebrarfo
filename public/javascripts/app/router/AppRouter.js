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
		id: null
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
		'places/:id/charts' : 'showChartsOfPlace',
		
		'hotspots': 'showHotspots',
		'hotspots/upload': 'uploadHotspots'
	},

	/*-------------------------------------------------------------------*/
	fetchPlacesData: function(callback){
		if(this.currentData.data === null || this.currentData.id != 'places'){
			var self = this;
			this.helperViews.waitingView.render();

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

			this.currentData.id = 'singlePlace';
			this.currentData.data = new com.spantons.model.Place({id:id});
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
		this.clearViews();
		this.currentView = new com.spantons.view.MapsView({
			waitingView: this.helperViews.waitingView,
			errorView : this.helperViews.errorView,
			placeId: id
		});

		this.renderVerticalNavMenuSinglePlace([0,1],id);
	},

	showChartsOfPlace: function(id){
		this.clearViews();
		this.currentView = new com.spantons.view.ChartsView({
			waitingView: this.helperViews.waitingView,
			errorView : this.helperViews.errorView,
			placeId: id
		});

		this.renderVerticalNavMenuSinglePlace([0,2],id);
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