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
};

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

app.util.alphanum = function(a,b) {
  function chunkify(t) {
    var tz = [];
    var x = 0, y = -1, n = 0, i, j;

    while (i = (j = t.charAt(x++)).charCodeAt(0)) {
      var m = (i == 46 || (i >=48 && i <= 57));
      if (m !== n) {
        tz[++y] = "";
        n = m;
      }
      tz[y] += j;
    }
    return tz;
  }

  var aa = chunkify(a.toLowerCase());
  var bb = chunkify(b.toLowerCase());

  for (x = 0; aa[x] && bb[x]; x++) {
    if (aa[x] !== bb[x]) {
      var c = Number(aa[x]), d = Number(bb[x]);
      if (c == aa[x] && d == bb[x]) {
        return c - d;
      } else return (aa[x] > bb[x]) ? 1 : -1;
    }
  }
  return aa.length - bb.length;
};

app.util.isWifi = function(){
  var isWifi = _.filter(window.place.attributes.frequenciesBands, function(item){
    return item.text == "2.4 GHz" || item.text == "5 GHz";
  });

  return isWifi.length > 0 ? true : false;
};

app.util.WifiChannelMap = function(ch){
  var map = {
    '1': 2412,
    '2': 2417,
    '3': 2422,
    '4': 2427,
    '5': 2432,
    '6': 2437,
    '7': 2442,
    '8': 2447,
    '9': 2452,
    '10': 2457,
    '11': 2462,
    '12': 2467,
    '13': 2472,
    '14': 2484,
  };
  return map[ch];
};

app.util.WifiCentralFqMap = function(fq){
  var map = {
    '2412': 1,
    '2417': 2,
    '2422': 3,
    '2427': 4,
    '2432': 5,
    '2437': 6,
    '2442': 7,
    '2447': 8,
    '2452': 9,
    '2457': 10,
    '2462': 11,
    '2467': 12,
    '2472': 13,
    '2484': 14
  };

  return map[fq];
};