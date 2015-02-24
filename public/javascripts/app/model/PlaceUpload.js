var app = app || {};
app.model = app.model || {};

app.model.PlaceUpload = Backbone.Model.extend({
	
	urlRoot: '/api/places/upload/',

	defaults: {
        name: null,
		powerMin : null,
		powerMax : null,
		coordinates : [],
		json: false,
        gpsFunction: 'avg'
	},

	sync: function(method, model, options) {

        function progress(e) {
            model.trigger('progress', e);
        }

        var newOptions = _.defaults({
            xhr: function() {
                var xhr = $.ajaxSettings.xhr();
                if(xhr instanceof window.XMLHttpRequest) {
                    xhr.addEventListener('progress', progress, false);
                }
                if(xhr.upload) {
                    xhr.upload.addEventListener('progress', progress, false);
                }
                return xhr;
            }
        }, options);

        return Backbone.sync.call(this, method, model, newOptions); 
    }

});