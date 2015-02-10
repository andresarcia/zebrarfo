var app = app || {};
app.util = app.util || {};

app.util.HeatmapDataProcessor = function(){};

app.util.HeatmapDataProcessor.prototype = {

    dataStat: new app.util.Stats(),
    statsMin: new app.util.Stats(),
    statsMax: new app.util.Stats(),
    distanceStat: new app.util.Stats(),
    normalizeMin: new app.util.Stats(),
    normalizeMax: new app.util.Stats(),

    require: function(options) {
        this.place = options.place;
        this.data = options.data;
    },

    process: function(boundaries, functionName, distance, unit){
        var self = this;

        if(unit == "m")
            this.spreadDistance = distance / 1000;
        else if(unit == "km")
            this.spreadDistance = distance;
        else
            this.spreadDistance = 0;

        this.dataProcessed = {};
        this.dataProcessed.data = [];
        this.statsMin.reset();
        this.statsMax.reset();
        this.normalizeMin.reset();
        this.normalizeMax.reset();
        
        var data = [];
        var indexForBoundaries = 0;
        for (var i = 0; i < this.data.length; i++){
            if( this.data[i].frequency / 1000 >= boundaries[indexForBoundaries].from && 
                this.data[i].frequency / 1000 <= boundaries[indexForBoundaries].to){

                data.push(this.data[i]);
            }

            if(this.data[i].frequency / 1000 > boundaries[indexForBoundaries].to){
                if(indexForBoundaries < boundaries.length - 1)
                    indexForBoundaries += 1;
                else 
                    break;
            }
        }

        data = _.groupBy(data, function(sample){
            return sample.id;
        });

        _.each(data, function(itemsSameId){
            self.dataStat.reset();
            _.each(itemsSameId, function(item){
                switch (functionName) {
                    case 'avg':
                        self.dataStat.avg(item.power);
                        break;

                    case 'max':
                        self.dataStat.max(item.power);
                        break;

                    case 'min':
                        self.dataStat.min(item.power);
                        break;

                    default:
                        self.dataStat.avg(item.power);
                }
            });

            self.checkDistance({
                lat: itemsSameId[0].lat, 
                lng: itemsSameId[0].lng, 
                count: self.dataStat.getResult(),
            });
        });

        this.normalize();
        this.dataProcessed.min = this.statsMin.getResult();
        this.dataProcessed.max = this.statsMax.getResult();
        this.dataProcessed.normalizeMin = this.normalizeMin.getResult();
        this.dataProcessed.normalizeMax = this.normalizeMax.getResult();

        return this.dataProcessed;
    },

    checkDistance: function(item){
        var distance;
        var lastSaved = this.dataProcessed.data[this.dataProcessed.data.length - 1];
        if (lastSaved)
            distance = app.util.GetDistanceFromLatLonInKm(lastSaved.lat,lastSaved.lng,item.lat,item.lng);
        else {
            this.saveItem(item);
            return;
        }

        if(distance && distance < this.spreadDistance)
            this.distanceStat.max(item.count);
        
        else {
            this.distanceStat.max(item.count);
            this.saveItem({
                lat: item.lat,
                lng: item.lng,
                count: this.distanceStat.getResult()
            });
            this.distanceStat.reset();
        } 
    },

    saveItem: function(item){
        this.statsMax.max(item.count);
        this.statsMin.min(item.count);
        this.dataProcessed.data.push(item);
    },

    normalize: function(){
        var self = this;
        _.each(this.dataProcessed.data, function(item){
            item.count = self.normalizeValue(item.count);
            self.normalizeMin.min(item.count);
            self.normalizeMax.max(item.count);
        });
    },

    normalizeValue: function(value){
        value = Number(value);
        return (value - this.statsMin.getResult() + 1).toFixed(1);
    },

    denormalizeValue: function(value){
        value = Number(value);
        return (value + this.statsMin.getResult() - 1).toFixed(1);
    }
    
};