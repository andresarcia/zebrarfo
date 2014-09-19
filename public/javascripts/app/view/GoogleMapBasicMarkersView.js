var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.GoogleMapBasicMarkersView = Backbone.View.extend({

	initialize: function(options){
		
	},

	render: function(data){

    	var mapCanvas = document.getElementById('basic-markers-map');
    	var centerCoord = new google.maps.LatLng(data[0].latitude,data[0].longitude);
  		var mapOptions = {
    		zoom: 15,
    		center: centerCoord,
    		mapTypeId: google.maps.MapTypeId.ROADMAP
  		};

  		var map = new google.maps.Map(mapCanvas, mapOptions);  

  		_.each(data, function(coordinate){
  			var latLng = new google.maps.LatLng(coordinate.latitude,coordinate.longitude);
  			var marker = new google.maps.Marker({
			    position: latLng,
		      	map: map,
		      	title: 'lat:'+coordinate.latitude+' lng:'+coordinate.longitude,
		  	});
  		});
	}

});