$(function(){
	Backbone.pubSub = _.extend({}, Backbone.Events);
	
	var errorView = new com.spantons.view.ErrorView();
	var waitingView = new com.spantons.view.WaitingView();
	var uploadMeasuresView = new com.spantons.view.UploadMeasuresView({
		waitingView:waitingView,
		errorView : errorView
	});
	
	Backbone.history.start();
});