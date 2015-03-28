var utils = require('./Utils');


/*-----------------------------------------------------------*/
exports.isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

/*-----------------------------------------------------------*/
exports.deg2rad = function(deg) {
	return deg * (Math.PI/180);
};

/*-----------------------------------------------------------*/
exports.GetDistanceFromLatLonInKm = function(lat1,lon1,lat2,lon2) {
  	var R = 6371; // Radius of the earth in km
  	var dLat = utils.deg2rad(lat2-lat1);  // deg2rad below
  	var dLon = utils.deg2rad(lon2-lon1); 
  	
  	var a = 
    	Math.sin(dLat/2) * Math.sin(dLat/2) +
	    Math.cos(utils.deg2rad(lat1)) * Math.cos(utils.deg2rad(lat2)) * 
    	Math.sin(dLon/2) * Math.sin(dLon/2); 
  	
  	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  	var d = R * c; // Distance in km
  
  	return d;
};
