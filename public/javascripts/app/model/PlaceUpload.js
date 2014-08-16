var com = com || {};
com.spantons = com.spantons || {};
com.spantons.model = com.spantons.model || {};

com.spantons.model.PlaceUpload = Backbone.Model.extend({
	
	urlRoot: '/api/upload/',

	defaults: {
    	name: null,
		numberCoordinates : 0,
		potencyMin : null,
		potencyMax : null,
		potencyAvg : null,
		sdPotencyAvg : null,
		placePotencySD_X : null,
		placePotencySD_M : null,
		avgPotencySD : null,
		coordinates : [],
		json: false
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