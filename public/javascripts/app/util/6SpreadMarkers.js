var app = app || {};
app.util = app.util || {};

app.util.SpreadMarkers = function(){};

app.util.SpreadMarkers.prototype = {

    initialize: function(markers){
        if(markers.length < 1) throw "Must have markers";

        this.markers = _.clone(markers);
        this.tree = VPTreeFactory.build(markers, function(a,b){
            var aCoord = a.getPosition();
            var bCoord = b.getPosition();
            return app.util.GetDistanceFromLatLonInKm(
                aCoord.lat(), aCoord.lng(), bCoord.lat(), bCoord.lng()); 
        });
    },

    spread: function(distance, unit){
        // --------
        var t0 = performance.now();
        // --------
        var radio;
        if(unit == "m") radio = distance / 1000;
        else if(unit == "km") radio = Number(distance);
        else radio = 0;

        var res = this._spread(radio);
        
        var t1 = performance.now();
        console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");

        return res;
    },

    _spread: function(radio){
        var self    = this,
            ids     = {},
            markers = this.markers;

        _.each(markers, function(item){
            if(item.visibleCount > 0 || item.icon == window.settings.markers.iconHover || ids[item.id])
                return;

            var sorted = self.tree.search(item, markers.length);
            sorted.splice(0,1);
            var inner = [];

            _.find(sorted, function(sortedItem, i){
                var marker = markers[sortedItem.i];
                if(marker.visibleCount < 1){
                    if(sortedItem.d <= radio && marker.icon != window.settings.markers.iconHover){
                        marker.setIcon(window.settings.markers.iconHover);
                        inner.push(marker.id);

                    } else if(sortedItem.d > radio && marker.icon == window.settings.markers.iconIdle)
                        return item;
                }
            });

            if(inner.length > 0) ids[item.id] = inner;
        });

        return ids;
    },

};