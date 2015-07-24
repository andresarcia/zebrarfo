var app = app || {};
app.collection = app.collection || {};

app.collection.SharedPlaces = Backbone.Collection.extend({
  
    model: app.model.SharedPlace,
    url: '/api/places/shared/'

});