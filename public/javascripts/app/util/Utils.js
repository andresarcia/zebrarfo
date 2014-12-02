var com = com || {};
com.spantons = com.spantons || {};
com.spantons.util = com.spantons.util || {};

com.spantons.util.FormatSizeUnits = function(bytes){
	if(bytes === 0) 
    	return '0 Byte';
   	
   	var k = 1000;
   	var sizes = ['Bytes', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'];
   	var i = Math.floor(Math.log(bytes) / Math.log(k));
   	return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
};

com.spantons.util.GetURLParameter = function(name){
    var results = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results === null)
       return null;
    else
       return results[1] || 0;
};

com.spantons.util.SetChannelsInRange = function(frequencyMin,frequencyMax){
  var data = [];
  _.each(window.appSettings.channels, function(item){
    var aux = [];
    _.each(item, function(channel){
      if(frequencyMin < channel.to && frequencyMax > channel.from)
        aux.push(channel);
    });
    data.push(aux);
  });
  return data;
};

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

com.spantons.util.GetDistanceFromLatLonInKm = function(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
};