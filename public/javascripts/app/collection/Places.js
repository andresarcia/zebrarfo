var com = com || {};
com.spantons = com.spantons || {};
com.spantons.collection = com.spantons.collection || {};

com.spantons.collection.Places = Backbone.Collection.extend({
  
 	model: com.spantons.model.Place,
  	url: '/api/places/'

});