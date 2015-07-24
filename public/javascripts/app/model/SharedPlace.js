var app = app || {};
app.model = app.model || {};

app.model.SharedPlace = app.model.Place.extend({

    urlRoot: '/api/places/shared',

});