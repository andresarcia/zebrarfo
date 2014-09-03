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

	initialize: function(options){

		this.navViews.verticalNav = new com.spantons.view.VerticalNavView();

		this.helperViews.errorView = new com.spantons.view.ErrorView();
		this.helperViews.waitingView = new com.spantons.view.WaitingView();
	},

	routes: {
		'places': 'showPlaces',
		'places/:id' : 'showPlace',
		'upload': 'upload'
	},

	showPlaces: function(){
		var placesView = new com.spantons.view.PlacesView({
			waitingView: this.helperViews.waitingView,
			errorView : this.helperViews.errorView
		});
		this.navViews.verticalNav.changeActiveClass(0);
	},

	showPlace: function(id){
		var placeView = new com.spantons.view.PlaceView({
			waitingView: this.helperViews.waitingView,
			errorView : this.helperViews.errorView,
			placeId: id
		});
	},

	upload: function(){
		var uploadMeasuresView = new com.spantons.view.UploadMeasuresView({
			waitingView: this.helperViews.waitingView,
			errorView : this.helperViews.errorView
		});
		this.navViews.verticalNav.changeActiveClass(1);
	}

});