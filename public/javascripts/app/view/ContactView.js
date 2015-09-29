var app = app || {};
app.view = app.view || {};

app.view.ContactView = Backbone.View.extend({

    el: '#z-modal',

    events: {
    },

    initialize: function(options){
        this.waitingView = options.waitingView;
        this.render();
    },

    render: function(){
        var template = Zebra.tmpl.contact;
        var html = template();
        this.$el.html(html);

        this.$el.find('#contact-modal').modal({
            keyboard: false,
        });

        return this;
    },
});