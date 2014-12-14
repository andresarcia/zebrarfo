var app = app || {};
app.collection = app.collection || {};

app.collection.Places = Backbone.Collection.extend({
  
 	model: app.model.Place,
  	url: '/api/places/'

});