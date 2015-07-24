var app = app || {};
app.view = app.view || {};

app.view.SharedPlacesView = Backbone.View.extend({

    initialize: function(options){
        this.errorView = options.errorView;
        this.waitingView = options.waitingView;
    },

    fetch: function(callback){
        this.waitingView.show();
        var self = this;

        this.sharedPlaces = new app.collection.SharedPlaces();
        this.sharedPlaces.fetch({
            success: function(){
                self.waitingView.hide();
                callback();
            },
            error: function(model, xhr, options){
                callback(xhr.responseJSON.message);
            }
        });
    },

    updateDataByTab: function(){

    },

    render: function(){
        var template = Zebra.tmpl.places_shared;
        var html = template(this.sharedPlaces);
        this.$el.html(html);

        return this;
    },

    renderComponents: function(){
        // draw gradient canvas
        _.each(document.getElementsByClassName('power-canvas'), function(canvas){
            var context = canvas.getContext('2d');
            context.rect(0, 0, canvas.width, canvas.height);
            var grd = context.createLinearGradient(0, 0, canvas.width, canvas.height);
            grd.addColorStop(0, 'RGBA(4, 3, 5, 1)');
            grd.addColorStop(0.142, 'RGBA(3, 4, 105, 1)');
            grd.addColorStop(0.284, 'RGBA(11, 52, 185, 1)');
            grd.addColorStop(0.426, 'RGBA(69, 233, 254, 1)');
            grd.addColorStop(0.568, 'RGBA(57, 183, 0, 1)');
            grd.addColorStop(0.710, 'RGBA(255, 252, 0, 1)');
            grd.addColorStop(0.852, 'RGBA(255, 141, 51, 1)');
            grd.addColorStop(1, 'RGBA(247, 26, 8, 1)');
            context.fillStyle = grd;
            context.fill();
        });
    },

});