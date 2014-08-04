$(function(){
	var errorView = new com.spantons.view.ErrorView();
	var uploadMeasuresView = new com.spantons.view.UploadMeasuresView({errorView : errorView});
	
	Backbone.history.start();
});