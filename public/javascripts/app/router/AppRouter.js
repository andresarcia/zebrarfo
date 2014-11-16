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
	tempId: null,

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
		'places/:id/coordinates' : 'showSinglePlace',
		'places/:id/coordinates/maps' : 'showMapsOfPlace',
		'places/:id/charts' : 'showChartsOfPlace',
		
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
		
		this.navViews.verticalNav.renderSubMenuWithId(0,'vertical-nav-template-sub-menu-single-place-upload');
		this.navViews.verticalNav.showSubMenuWithClass(0,'upload-menu-item');

		this.navViews.verticalNav.changeActiveClass({
			index: [0],
		});
		
	},

	showSinglePlace: function(id){  		
		this.clearViews();
		this.currentView = new com.spantons.view.SinglePlaceView({
			waitingView: this.helperViews.waitingView,
			errorView : this.helperViews.errorView,
			placeId: id
		});

		this.navViews.verticalNav.renderSubMenuWithId(0,'vertical-nav-template-sub-menu-single-place',id);
		this.navViews.verticalNav.showSubMenuWithClass(0,'single-place-menu-item');

		this.navViews.verticalNav.changeActiveClass({
			index: [0,0],
		});
	},

	showMapsOfPlace: function(id){
		this.clearViews();
		this.currentView = new com.spantons.view.MapsView({
			waitingView: this.helperViews.waitingView,
			errorView : this.helperViews.errorView,
			placeId: id
		});

		this.navViews.verticalNav.changeActiveClass({
			index: [0,1],
		});
	},

	showChartsOfPlace: function(id){
		this.clearViews();
		this.currentView = new com.spantons.view.ChartsView({
			waitingView: this.helperViews.waitingView,
			errorView : this.helperViews.errorView,
			placeId: id
		});

		this.navViews.verticalNav.changeActiveClass({
			index: [0,2],
		});
	},

	uploadPlace: function(){
		this.clearViews();
		this.currentView = new com.spantons.view.UploadMeasuresView({
			waitingView: this.helperViews.waitingView,
			errorView : this.helperViews.errorView
		});
		this.navViews.verticalNav.changeActiveClass({
			index: [0,0],
		});
	},

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