var app = app || {};
app.util = app.util || {};

app.util.HeatmapDataProcessor = function(){};

app.util.HeatmapDataProcessor.prototype = {
    currentData: {
        data: [],
        item: null,
        operation: null,
        count: 0,
        min: null,
        max: null,
        normalizeMax: null,
        normalizeMin: null
    },

    require: function(options) {
        this.place = options.place;
        this.data = options.data;
    },

    resetData: function(){
        this.currentData = {};
        this.currentData.data = [];
        this.currentData.item = null;
        this.currentData.operation = null;
        this.currentData.count = 0;
        this.currentData.min = null;
        this.currentData.max = null;
        this.currentData.normalizeMax = null;
    },

    process: function(boundaries, functionName){
        var self = this;
        this.resetData();
        /*----------------------------------------------------*/
        // var a = performance.now();
        /*----------------------------------------------------*/
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

        data = _.sortBy(data, function(sample){
            return sample.id;
        });
        
        this.currentData.item = data[0];
        _.each(data, function(item){
            switch (functionName) {
                case 'avg':
                    self.averageFunction(item);
                    break;

                case 'max':
                    self.maxFunction(item);
                    break;

                case 'min':
                    self.minFunction(item);
                    break;

                default:
                    self.averageFunction(item);
            }
        });

        if(this.currentData.data.length === 0)
            this.saveItem(this.currentData.item);

        this.normalize();

        /*----------------------------------------------------*/
        // console.log('max: ' + this.currentData.max);
        // console.log('max ref: ' + this.normalizeValue(this.currentData.max));

        // _.each(this.currentData.data, function(item,index){
            // console.log(item.lat + ',' + item.lng + ',' + item.count);
            // console.log(index + ',' + item.count);
            // console.log(item.count);
        // });
        // console.log(this.currentData);
        // console.log('#' + this.currentData.data.length);
        // var b = performance.now();
        // console.log('It took ' + (b - a) + ' ms.');
        // console.log('-------------------------------');
        /*----------------------------------------------------*/

        return this.currentData;
    },

    averageFunction: function(item){
        if(this.currentData.item.id == item.id){
            this.currentData.operation += item.power;
            this.currentData.count += 1;

        } else {
            this.currentData.operation = this.currentData.operation / this.currentData.count;
            this.saveItem(item);
        }
    },

    maxFunction: function(item){
        if(this.currentData.item.id == item.id){
            if(this.currentData.operation < item.power || this.currentData.operation === null)
                this.currentData.operation = item.power;

        } else {
            this.currentData.operation = this.currentData.operation;
            this.saveItem(item);
        }
    },

    minFunction: function(item){
        if(this.currentData.item.id == item.id){
            if(this.currentData.operation > item.power || this.currentData.operation === null)
                this.currentData.operation = item.power;

        } else {
            this.currentData.operation = this.currentData.operation;
            this.saveItem(item);
        }
    },

    calculateMaxMin: function(val){
        if(this.currentData.min === null && this.currentData.max === null)
            this.currentData.min = this.currentData.max = val;
            
        else {
            if(this.currentData.min > val)
                this.currentData.min = val;
            if(this.currentData.max < val)
                this.currentData.max = val;
        }
    },

    saveItem: function(item){

        var distance = 0;
        var lastSaved = this.currentData.data[this.currentData.data.length - 1];

        if (lastSaved !== undefined){
            distance = app.util.GetDistanceFromLatLonInKm(
                lastSaved.lat,
                lastSaved.lng,
                this.currentData.item.lat,
                this.currentData.item.lng);
        }

        // if(distance < this.place.distanceMax && lastSaved !== undefined){
        if(distance < 0.5 && lastSaved !== undefined){
            this.currentData.item = item;
            this.currentData.operation = item.power;
            this.currentData.count = 1;
            return;
        }
        
        this.currentData.data.push({
            lat: this.currentData.item.lat, 
            lng: this.currentData.item.lng, 
            count: this.currentData.operation,
        });

        this.calculateMaxMin(this.currentData.operation);

        this.currentData.item = item;
        this.currentData.operation = item.power;
        this.currentData.count = 1;

    },

    normalize: function(){
        var self = this;

        _.each(this.currentData.data, function(item){
            item.count = self.normalizeValue(item.count);

            if(self.currentData.normalizeMax === null && self.currentData.normalizeMin === null)
                self.currentData.normalizeMax = self.currentData.normalizeMin = item.count;
            else {
                if(self.currentData.normalizeMax < item.count)
                    self.currentData.normalizeMax = item.count;
                if(self.currentData.normalizeMin > item.count)
                    self.currentData.normalizeMin = item.count;
            }
        });
    },

    normalizeValue: function(value){
        return (value - this.currentData.min + 1).toFixed(1);
    },

    denormalizeValue: function(value){
        return (Number(value) + this.currentData.min - 1).toFixed(1);
    }
    
};