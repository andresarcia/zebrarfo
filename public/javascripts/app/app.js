$(function(){
	Backbone.pubSub = _.extend({}, Backbone.Events);
	loadGoogleMapApi();
	var appRouter = new com.spantons.router.AppRouter();

	Backbone.history.start();
});

function loadGoogleMapApi() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?callback=initializeGoogleMaps';
  document.body.appendChild(script);
}

function initializeGoogleMaps(){
	Backbone.pubSub.trigger('event-loaded-google-map-api');
}