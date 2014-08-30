$(function(){
	Backbone.pubSub = _.extend({}, Backbone.Events);
	var appRouter = new com.spantons.router.AppRouter();
	
	Backbone.history.start();
});