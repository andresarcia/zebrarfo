$(function(){
	Backbone.pubSub = _.extend({}, Backbone.Events);
	loadGoogleMapApi();
	appRouter = new com.spantons.router.AppRouter();
	
	Backbone.history.start();
});

function loadGoogleMapApi() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'http://maps.googleapis.com/maps/api/js?sensor=false&callback=loadGoogleMapHeatmapPlugin';
  document.body.appendChild(script);
}

function loadGoogleMapHeatmapPlugin(){
	var l = new Loader();
	l.require([
    	"javascripts/vendor/gmaps-heatmap.js"], 
    function() {
        initializeGoogleMaps();
    });
}

function initializeGoogleMaps(){
	appRouter.googleMapApi = true;
	Backbone.pubSub.trigger('event-loaded-google-map-api');
}

var Loader = function () { };
Loader.prototype = {
    require: function (scripts, callback) {
        this.loadCount      = 0;
        this.totalRequired  = scripts.length;
        this.callback       = callback;

        for (var i = 0; i < scripts.length; i++) {
            this.writeScript(scripts[i]);
        }
    },
    loaded: function (evt) {
        this.loadCount++;

        if (this.loadCount == this.totalRequired && typeof this.callback == 'function') this.callback.call();
    },
    writeScript: function (src) {
        var self = this;
        var s = document.createElement('script');
        s.type = "text/javascript";
        s.async = true;
        s.src = src;
        s.addEventListener('load', function (e) { self.loaded(e); }, false);
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(s);
    }
};


