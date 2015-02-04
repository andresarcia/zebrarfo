var app = app || {};
app.util = app.util || {};

app.util.FormatSizeUnits = function(bytes){
	if(bytes === 0) 
    	return '0 Byte';
   	
   	var k = 1000;
   	var sizes = ['Bytes', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'];
   	var i = Math.floor(Math.log(bytes) / Math.log(k));
   	return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
};

app.util.GetURLParameter = function(name){
    var results = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results === null)
       return null;
    else
       return results[1] || 0;
};

app.util.CkeckUrl = function(url){
  if(window.location.hash == url)
    return true;
    
  return false;
};

app.util.deg2rad = function(deg) {
  return deg * (Math.PI/180);
}

app.util.GetDistanceFromLatLonInKm = function(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = app.util.deg2rad(lat2-lat1);
  var dLon = app.util.deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(app.util.deg2rad(lat1)) * Math.cos(app.util.deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
};

app.util.GetPrecision = function() {
    var s = this + "",
        d = s.indexOf('.') + 1;

    return !d ? 0 : s.length - d;
};