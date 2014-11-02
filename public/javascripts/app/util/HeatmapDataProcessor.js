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
        normalizeMax: null
    },
    
    require: function(data) {
        this.data = data;
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

        _.each(this.data, function(item){
            var frequency = item.frequency / 1000;
            if(frequency >= boundaries.from && frequency <= boundaries.to){
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
                        self.defaultFunction(item);
                }
            }
        });
        console.log(this.currentData);
        // this.normalize();
        return this.currentData;
    },

    averageFunction: function(item){
        if(this.currentData.item.lat == item.lat && this.currentData.item.lng == item.lng){
            this.currentData.operation += item.power;
            this.currentData.count += 1;

        } else {
            var count = this.currentData.operation / this.currentData.count;
            
            this.currentData.data.push({
                lat: this.currentData.item.lat, 
                lng: this.currentData.item.lng, 
                count: count
            });

            this.calculateMaxMin(count);
                        
            this.currentData.item = item;
            this.currentData.operation = item.power;
            this.currentData.count = 1;
        }
    },

    maxFunction: function(item){
        if(this.currentData.item.lat == item.lat && this.currentData.item.lng == item.lng){
            if(this.currentData.operation < item.power || this.currentData.operation === null)
                this.currentData.operation = item.power;

        } else {
            var count = this.currentData.operation;
            
            this.currentData.data.push({
                lat: this.currentData.item.lat, 
                lng: this.currentData.item.lng, 
                count: count
            });

            this.calculateMaxMin(count);
                        
            this.currentData.item = item;
            this.currentData.operation = item.power;
            this.currentData.count = 1;
        }
    },

    minFunction: function(item){
        if(this.currentData.item.lat == item.lat && this.currentData.item.lng == item.lng){
            if(this.currentData.operation > item.power || this.currentData.operation === null)
                this.currentData.operation = item.power;

        } else {
            var count = this.currentData.operation;
            
            this.currentData.data.push({
                lat: this.currentData.item.lat, 
                lng: this.currentData.item.lng, 
                count: count
            });

            this.calculateMaxMin(count);
                        
            this.currentData.item = item;
            this.currentData.operation = item.power;
            this.currentData.count = 1;
        }
    },

    defaultFunction: function(item){
        this.calculateMaxMin(item.power);

        this.currentData.data.push({
            lat: item.lat, 
            lng: item.lng, 
            count: item.power
        });
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

    normalize: function(){
        var self = this;
        _.each(this.currentData.data, function(item){
            item.count = (item.count - self.currentData.max);
            if(item.count === 0)
                item.count = 1;

            if(self.currentData.normalizeMax === null)
                self.currentData.normalizeMax = item.count;
            else {
                if(self.currentData.normalizeMax < item.count)
                    self.currentData.normalizeMax = item.count;
            }

        });
    }
    
};