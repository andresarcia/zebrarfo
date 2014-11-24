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