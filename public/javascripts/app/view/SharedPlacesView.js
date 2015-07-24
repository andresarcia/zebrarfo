var app = app || {};
app.view = app.view || {};

app.view.SharedPlacesView = Backbone.View.extend({

    initialize: function(options){
        this.errorView = options.errorView;
        this.waitingView = options.waitingView;
    },

    updateDataByTab: function(){

    },

    render: function(){
        var template = Zebra.tmpl.places_shared;
        var html = template(window.place);
        this.$el.html(html);

        return this;
    },

});