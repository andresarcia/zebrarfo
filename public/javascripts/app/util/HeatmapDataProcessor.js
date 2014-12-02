var com = com || {};
com.spantons = com.spantons || {};
com.spantons.util = com.spantons.util || {};

com.spantons.util.HeatmapDataProcessor = function(){};

com.spantons.util.HeatmapDataProcessor.prototype = {
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
        this.data = options.data.data;
    },

    resetData: function(){
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
        this.currentData.item = this.data[0];

        /*----------------------------------------------------*/
        var a = performance.now();
        /*----------------------------------------------------*/
        _.each(boundaries, function(itemBoundaries){
            var filter = _.filter(self.data, function(itemData){ 
                return itemData.frequency / 1000 >= itemBoundaries.from && itemData.frequency / 1000 <= itemBoundaries.to; 
            });
            /*----------------------------------------------------*/
            // console.log(filter[0].frequency);
            // console.log(filter[filter.length - 1].frequency);
            /*----------------------------------------------------*/
            _.each(filter, function(item){
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
        });

        if(this.currentData.data.length === 0)
            this.saveItem(this.currentData.item);

        this.normalize();

        /*----------------------------------------------------*/
        // console.log(this.currentData.data);
        console.log('#' + this.currentData.data.length);
        var b = performance.now();
        console.log('It took ' + (b - a) + ' ms.');
        console.log('-------------------------------');
        /*----------------------------------------------------*/


        return this.currentData;
    },

    averageFunction: function(item){
        if(this.currentData.item.lat == item.lat && this.currentData.item.lng == item.lng){
            this.currentData.operation += item.power;
            this.currentData.count += 1;

        } else {
            this.currentData.operation = this.currentData.operation / this.currentData.count;
            this.saveItem(item);
        }
    },

    maxFunction: function(item){
        if(this.currentData.item.lat == item.lat && this.currentData.item.lng == item.lng){
            if(this.currentData.operation < item.power || this.currentData.operation === null)
                this.currentData.operation = item.power;

        } else {
            this.currentData.operation = this.currentData.operation;
            this.saveItem(item);
        }
    },

    minFunction: function(item){
        if(this.currentData.item.lat == item.lat && this.currentData.item.lng == item.lng){
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
        var distance = com.spantons.util.GetDistanceFromLatLonInKm(this.currentData.item.lat,this.currentData.item.lng,item.lat,item.lng);
            if(distance < this.place.distaceAvg)
                return;

        this.currentData.data.push({
            lat: this.currentData.item.lat, 
            lng: this.currentData.item.lng, 
            count: this.currentData.operation
        });

        this.calculateMaxMin(this.currentData.operation);

        this.currentData.item = item;
        this.currentData.operation = item.power;
        this.currentData.count = 1;
    },

    normalize: function(){
        var self = this;

        _.each(this.currentData.data, function(item){
            item.count = item.count - self.currentData.min + 1;
            item.count = Number(item.count.toFixed(1));

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
    }
    
};