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

	initialize: function(options){
		var self = this;
		
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
		'places/:id/coordinates' : 'showCoordinates',
		'places/:id/coordinates/maps' : 'showCoordinatesMaps',
		'places/upload': 'uploadPlace',
		'hotspots': 'showHotspots',
		'hotspots/upload': 'uploadHotspots'
	},

	showPlaces: function(){
		this.clearViews();
		this.currentView = new com.spantons.view.PlacesView({
			waitingView: this.helperViews.waitingView,
			errorView : this.helperViews.errorView
		});
		this.navViews.verticalNav.changeActiveClass({
			index: 0,
			child: false
		});
	},

	showCoordinates: function(id){
		this.clearViews();
		this.currentView = new com.spantons.view.SinglePlaceView({
			waitingView: this.helperViews.waitingView,
			errorView : this.helperViews.errorView,
			placeId: id
		});

		this.navViews.verticalNav.appendTempChildItem({
			indexParent: 0,
			url: 'places/'+id+'/coordinates',
			glyphicon: 'glyphicon-map-marker',
			name: 'Coordinates'
		});
	},

	showCoordinatesMaps: function(id){
		this.clearViews();
		this.currentView = new com.spantons.view.GoogleMapCompleteView({
			waitingView: this.helperViews.waitingView,
			errorView : this.helperViews.errorView,
			placeId: id
		});
		this.navViews.verticalNav.appendTempChildItem({
			indexParent: 0,
			url: 'places/'+id+'/coordinates/maps',
			glyphicon: 'glyphicon-road',
			name: 'Maps'
		});
	},

	uploadPlace: function(){
		this.clearViews();
		this.currentView = new com.spantons.view.UploadMeasuresView({
			waitingView: this.helperViews.waitingView,
			errorView : this.helperViews.errorView
		});
		this.navViews.verticalNav.changeActiveClass({
			index: 0,
			indexParent: 0,
			child: true
		});
	},

	showHotspots: function(){
		this.navViews.verticalNav.changeActiveClass({
			index: 1,
			child: false
		});
	},

	uploadHotspots: function(){
		this.navViews.verticalNav.changeActiveClass({
			index: 0,
			indexParent: 1,
			child: true
		});
	}

});