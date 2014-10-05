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
		'places/:id/coordinates' : 'showCoordinatesOfPlace',
		'places/:id/coordinates/maps' : 'showCoordinatesMapsOfPlace',
		'places/upload': 'uploadPlace',
		'hotspots': 'showHotspots',
		'hotspots/upload': 'uploadHotspots'
	},

	tempObjPlaces: function(id){
		return {
			indexParent: 0,
			items: [
				{
					url: 'places/'+id+'/coordinates',
					glyphicon: 'glyphicon-map-marker',
					name: 'Coordinates'
				},
				{
					url: 'places/'+id+'/coordinates/maps',
					glyphicon: 'glyphicon-road',
					name: 'Maps'
				},
				{
					url: 'places/'+id+'/coordinates/occupation',
					glyphicon: 'glyphicon-stats',
					name: 'Occupation'
				}
			]
		};
	},

	showPlaces: function(){
		this.clearViews();
		this.currentView = new com.spantons.view.PlacesView({
			waitingView: this.helperViews.waitingView,
			errorView : this.helperViews.errorView
		});
		
		this.navViews.verticalNav.changeActiveClass({
			index: [0],
		});
	},

	showCoordinatesOfPlace: function(id){
		this.clearViews();
		this.currentView = new com.spantons.view.SinglePlaceView({
			waitingView: this.helperViews.waitingView,
			errorView : this.helperViews.errorView,
			placeId: id
		});

		this.navViews.verticalNav.appendTempChildItem(this.tempObjPlaces(id));
		this.navViews.verticalNav.changeActiveClass({
			index: [0,1],
		});
	},

	showCoordinatesMapsOfPlace: function(id){
		this.clearViews();
		this.currentView = new com.spantons.view.GoogleMapCompleteView({
			waitingView: this.helperViews.waitingView,
			errorView : this.helperViews.errorView,
			placeId: id
		});

		this.navViews.verticalNav.appendTempChildItem(this.tempObjPlaces(id));
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