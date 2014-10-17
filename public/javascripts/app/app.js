$(function(){
	Backbone.pubSub = _.extend({}, Backbone.Events);
	loadGoogleMapApi();
	appRouter = new com.spantons.router.AppRouter();
	
    americanChannels = [{from:470,to:476,text:'14',color:'rgba(68, 170, 213, 0.1)'}, {from:476,to:482,text:'15',color:'rgba(0, 0, 0, 0)'}, {from:482,to:488,text:'16',color:'rgba(68, 170, 213, 0.1)'}, {from:488,to:494,text:'17',color:'rgba(0, 0, 0, 0)'}, {from:494,to:500,text:'18',color:'rgba(68, 170, 213, 0.1)'}, {from:500,to:506,text:'19',color:'rgba(0, 0, 0, 0)'}, {from:506,to:512,text:'20',color:'rgba(68, 170, 213, 0.1)'}, {from:512,to:518,text:'21',color:'rgba(0, 0, 0, 0)'}, {from:518,to:524,text:'22',color:'rgba(68, 170, 213, 0.1)'}, {from:524,to:530,text:'23',color:'rgba(0, 0, 0, 0)'}, {from:530,to:536,text:'24',color:'rgba(68, 170, 213, 0.1)'}, {from:536,to:542,text:'25',color:'rgba(0, 0, 0, 0)'}, {from:542,to:548,text:'26',color:'rgba(68, 170, 213, 0.1)'}, {from:548,to:554,text:'27',color:'rgba(0, 0, 0, 0)'}, {from:554,to:560,text:'28',color:'rgba(68, 170, 213, 0.1)'}, {from:560,to:566,text:'29',color:'rgba(0, 0, 0, 0)'}, {from:566,to:572,text:'30',color:'rgba(68, 170, 213, 0.1)'}, {from:572,to:578,text:'31',color:'rgba(0, 0, 0, 0)'}, {from:578,to:584,text:'32',color:'rgba(68, 170, 213, 0.1)'}, {from:584,to:590,text:'33',color:'rgba(0, 0, 0, 0)'}, {from:590,to:596,text:'34',color:'rgba(68, 170, 213, 0.1)'}, {from:596,to:602,text:'35',color:'rgba(0, 0, 0, 0)'}, {from:602,to:608,text:'36',color:'rgba(68, 170, 213, 0.1)'}, {from:608,to:614,text:'37',color:'rgba(0, 0, 0, 0)'}, {from:614,to:620,text:'38',color:'rgba(68, 170, 213, 0.1)'}, {from:620,to:626,text:'39',color:'rgba(0, 0, 0, 0)'}, {from:626,to:632,text:'40',color:'rgba(68, 170, 213, 0.1)'}, {from:632,to:638,text:'41',color:'rgba(0, 0, 0, 0)'}, {from:638,to:644,text:'42',color:'rgba(68, 170, 213, 0.1)'}, {from:644,to:650,text:'43',color:'rgba(0, 0, 0, 0)'}, {from:650,to:656,text:'44',color:'rgba(68, 170, 213, 0.1)'}, {from:656,to:662,text:'45',color:'rgba(0, 0, 0, 0)'}, {from:662,to:668,text:'46',color:'rgba(68, 170, 213, 0.1)'}, {from:668,to:674,text:'47',color:'rgba(0, 0, 0, 0)'}, {from:674,to:680,text:'48',color:'rgba(68, 170, 213, 0.1)'}, {from:680,to:686,text:'49',color:'rgba(0, 0, 0, 0)'}, {from:686,to:692,text:'50',color:'rgba(68, 170, 213, 0.1)'}, {from:692,to:698,text:'51',color:'rgba(0, 0, 0, 0)'}, {from:698,to:704,text:'52',color:'rgba(68, 170, 213, 0.1)'}, {from:704,to:710,text:'53',color:'rgba(0, 0, 0, 0)'}, {from:710,to:716,text:'54',color:'rgba(68, 170, 213, 0.1)'}, {from:716,to:722,text:'55',color:'rgba(0, 0, 0, 0)'}, {from:722,to:728,text:'56',color:'rgba(68, 170, 213, 0.1)'}, {from:728,to:734,text:'57',color:'rgba(0, 0, 0, 0)'}, {from:734,to:740,text:'58',color:'rgba(68, 170, 213, 0.1)'}, {from:740,to:746,text:'59',color:'rgba(0, 0, 0, 0)'}, {from:746,to:752,text:'60',color:'rgba(68, 170, 213, 0.1)'}, {from:752,to:758,text:'61',color:'rgba(0, 0, 0, 0)'}, {from:758,to:764,text:'62',color:'rgba(68, 170, 213, 0.1)'}, {from:764,to:770,text:'63',color:'rgba(0, 0, 0, 0)'}, {from:770,to:776,text:'64',color:'rgba(68, 170, 213, 0.1)'}, {from:776,to:782,text:'65',color:'rgba(0, 0, 0, 0)'}, {from:782,to:788,text:'66',color:'rgba(68, 170, 213, 0.1)'}, {from:788,to:794,text:'67',color:'rgba(0, 0, 0, 0)'}, {from:794,to:800,text:'68',color:'rgba(68, 170, 213, 0.1)'}, {from:800,to:806,text:'69',color:'rgba(0, 0, 0, 0)'}, {from:806,to:812,text:'70',color:'rgba(68, 170, 213, 0.1)'}, {from:812,to:818,text:'71',color:'rgba(0, 0, 0, 0)'}, {from:818,to:824,text:'72',color:'rgba(68, 170, 213, 0.1)'}, {from:824,to:830,text:'73',color:'rgba(0, 0, 0, 0)'}, {from:830,to:836,text:'74',color:'rgba(68, 170, 213, 0.1)'}, {from:836,to:842,text:'75',color:'rgba(0, 0, 0, 0)'}, {from:842,to:848,text:'76',color:'rgba(68, 170, 213, 0.1)'}, {from:848,to:854,text:'77',color:'rgba(0, 0, 0, 0)'}, {from:854,to:860,text:'78',color:'rgba(68, 170, 213, 0.1)'}, {from:860,to:866,text:'79',color:'rgba(0, 0, 0, 0)'}, {from:866,to:872,text:'80',color:'rgba(68, 170, 213, 0.1)'}, {from:872,to:878,text:'81',color:'rgba(0, 0, 0, 0)'}, {from:878,to:884,text:'82',color:'rgba(68, 170, 213, 0.1)'}, {from:884,to:890,text:'83',color:'rgba(0, 0, 0, 0)'}];
    europeanChannels = [{from:470,to:478,text:'21',color:'rgba(68, 170, 213, 0.1)'}, {from:478,to:486,text:'22',color:'rgba(0, 0, 0, 0)'}, {from:486,to:494,text:'23',color:'rgba(68, 170, 213, 0.1)'}, {from:494,to:502,text:'24',color:'rgba(0, 0, 0, 0)'}, {from:502,to:510,text:'25',color:'rgba(68, 170, 213, 0.1)'}, {from:510,to:518,text:'26',color:'rgba(0, 0, 0, 0)'}, {from:518,to:526,text:'27',color:'rgba(68, 170, 213, 0.1)'}, {from:526,to:534,text:'28',color:'rgba(0, 0, 0, 0)'}, {from:534,to:542,text:'29',color:'rgba(68, 170, 213, 0.1)'}, {from:542,to:550,text:'30',color:'rgba(0, 0, 0, 0)'}, {from:550,to:558,text:'31',color:'rgba(68, 170, 213, 0.1)'}, {from:558,to:566,text:'32',color:'rgba(0, 0, 0, 0)'}, {from:566,to:574,text:'33',color:'rgba(68, 170, 213, 0.1)'}, {from:574,to:582,text:'34',color:'rgba(0, 0, 0, 0)'}, {from:582,to:590,text:'35',color:'rgba(68, 170, 213, 0.1)'}, {from:590,to:598,text:'36',color:'rgba(0, 0, 0, 0)'}, {from:598,to:606,text:'37',color:'rgba(68, 170, 213, 0.1)'}, {from:606,to:614,text:'38',color:'rgba(0, 0, 0, 0)'}, {from:614,to:622,text:'39',color:'rgba(68, 170, 213, 0.1)'}, {from:622,to:630,text:'40',color:'rgba(0, 0, 0, 0)'}, {from:630,to:638,text:'41',color:'rgba(68, 170, 213, 0.1)'}, {from:638,to:646,text:'42',color:'rgba(0, 0, 0, 0)'}, {from:646,to:654,text:'43',color:'rgba(68, 170, 213, 0.1)'}, {from:654,to:662,text:'44',color:'rgba(0, 0, 0, 0)'}, {from:662,to:670,text:'45',color:'rgba(68, 170, 213, 0.1)'}, {from:670,to:678,text:'46',color:'rgba(0, 0, 0, 0)'}, {from:678,to:686,text:'47',color:'rgba(68, 170, 213, 0.1)'}, {from:686,to:694,text:'48',color:'rgba(0, 0, 0, 0)'}, {from:694,to:702,text:'49',color:'rgba(68, 170, 213, 0.1)'}, {from:702,to:710,text:'50',color:'rgba(0, 0, 0, 0)'}, {from:710,to:718,text:'51',color:'rgba(68, 170, 213, 0.1)'}, {from:718,to:726,text:'52',color:'rgba(0, 0, 0, 0)'}, {from:726,to:734,text:'53',color:'rgba(68, 170, 213, 0.1)'}, {from:734,to:742,text:'54',color:'rgba(0, 0, 0, 0)'}, {from:742,to:750,text:'55',color:'rgba(68, 170, 213, 0.1)'}, {from:750,to:758,text:'56',color:'rgba(0, 0, 0, 0)'}, {from:758,to:766,text:'57',color:'rgba(68, 170, 213, 0.1)'}, {from:766,to:774,text:'58',color:'rgba(0, 0, 0, 0)'}, {from:774,to:782,text:'59',color:'rgba(68, 170, 213, 0.1)'}, {from:782,to:790,text:'60',color:'rgba(0, 0, 0, 0)'}, {from:790,to:798,text:'61',color:'rgba(68, 170, 213, 0.1)'}, {from:798,to:806,text:'62',color:'rgba(0, 0, 0, 0)'}, {from:806,to:814,text:'63',color:'rgba(68, 170, 213, 0.1)'}, {from:814,to:822,text:'64',color:'rgba(0, 0, 0, 0)'}, {from:822,to:830,text:'65',color:'rgba(68, 170, 213, 0.1)'}, {from:830,to:838,text:'66',color:'rgba(0, 0, 0, 0)'}, {from:838,to:846,text:'67',color:'rgba(68, 170, 213, 0.1)'}, {from:846,to:854,text:'68',color:'rgba(0, 0, 0, 0)'}, {from:854,to:862,text:'69',color:'rgba(68, 170, 213, 0.1)'}];

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


