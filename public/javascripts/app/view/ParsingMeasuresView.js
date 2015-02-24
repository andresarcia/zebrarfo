var app = app || {};
app.view = app.view || {};

app.view.ParsingMeasuresView = Backbone.View.extend({

	el: '#modal-parsing-measures',

	reset: function(){
		this.model = null;
		this.files = null;
		this.html5 = null;
		this.stop = false;
		this.status = {};
		this.status.waitingForServer = false;
		this.status.done = false;
	},

	events: {
		'click #ws-modal-parsing-measures-button' : 'cancelUpload'
	},

	initialize: function(options){
		var self = this;
		this.reset();
		if (options.placeName && options.supportHtml5){
			this.model = new app.model.PlaceUpload({
				name:options.placeName,
				json:options.supportHtml5,
				coordinates: []
			});
			this.html5 = options.supportHtml5;
		} else 
			throw 'Place name or html5 support are not defined';
		
		if(options.gpsFunction)
			this.model.set("gpsFunction",options.gpsFunction);

		if (options.files) 
			this.files = options.files;
		else 
			throw 'Any selected file';

		if (!options.unit) 
			throw 'Any frequency unit';

		this.errorView = options.errorView;

		this.render();
		this.modal = $('#modal-parsing-measures-modal');
		this.modal.modal({keyboard: false, backdrop : 'static'});
		this.parentComponent = $('.list-group');
		this.progressBar = $('.progress-bar');
		this.lastPercentLoaded = 0;
		this.timeBase = 3;
		this.timeToWait = 0;

		this.restartProgressBar();

		if(this.html5){
			var parser = new app.util.Parser();

			parser.initialize(this.files, this.model.attributes, options.unit,
			function(numFilesProcessed){
				self.setNumberFilesParser(numFilesProcessed);
			}, function(){
				
			});
		}
	},

	render: function(){
		var template = Zebra.tmpl['modal_parsing_measures'];
		var html = template({numFiles: this.files.length});
        this.$el.html(html);

		return this;
	},

	updateProgressBar: function(){
		if(!this.stop){
			var percent = Math.round(this.percentLoaded);
			if(percent == this.lastPercentLoaded)
				return;

			this.progressBar.text(percent + '%');
			this.progressBar.css('width', percent + '%');
			this.lastPercentLoaded = percent;

			if(this.percentLoaded >= 100){
				this.progressBar.css('width','100%');
				this.progressBar.text('100%');
				this.progressBar.addClass('progress-bar-success');
			}
		}
	},	

	restartProgressBar: function(){
		this.percentLoaded = 0;
		this.lastPercentLoaded = 0;
		this.progressBar.removeClass('progress-bar-success');
		this.progressBar.css('width','0%');
		this.progressBar.text('0%');
	},

	setNumberFilesParser: function(numFilesProcessed){
		if(!this.stop){
			var self = this;
			this.timeToWait += this.timeBase;

			setTimeout(function() {
				self.parentComponent.children().first().children().text(numFilesProcessed+' / '+self.files.length);	
				self.percentLoaded = (numFilesProcessed / self.files.length) * 40;
				self.updateProgressBar();

				if(self.files.length == numFilesProcessed)
					self.showMeasuresData();

			}, this.timeToWait);
		}
	},

	showMeasuresData: function(){
		if(!this.stop){

			$('#ws-modal-parsing-measures-data-table-name').html(this.model.attributes.name);
			$('#ws-modal-parsing-measures-data-table-numberCoordinates').html(this.model.attributes.coordinates.length);
			$('#ws-modal-parsing-measures-data-table-numberPowerFrequency').html(this.model.attributes.frequencies.values.length);
			$('#ws-modal-parsing-measures-data-table-frequenciesBandwidth').html('['+this.model.attributes.frequencies.values[0]/1000+' - '+this.model.attributes.frequencies.values[this.model.attributes.frequencies.values.length - 1]/1000+'] <small><b>MHz</b></small>');
			$('#ws-modal-parsing-measures-data-table-powerMin').html(this.model.attributes.powerMin + ' <small><b>dBm</b></small>');
			$('#ws-modal-parsing-measures-data-table-powerMax').html(this.model.attributes.powerMax + ' <small><b>dBm</b></small>');
			
			this.parentComponent.children().first().removeClass('active').addClass('list-group-item-success');
			$('#ws-modal-parsing-measures-data-table').fadeIn(800);
			
			this.uploadDataToServer();
		}
	},

	uploadDataToServer: function(){
		var self = this;
		this.parentComponent.children().eq(2).addClass('active');
		this.parentComponent.children().eq(2).find($('.glyphicon-refresh-animate')).show();

		this.model.on('progress', function(evt) { 
			if (evt.lengthComputable) {
		    	self.percentLoaded += Math.round((evt.loaded / evt.total) * 40);

		    	if(self.percentLoaded < 80)
		    		self.updateProgressBar();

		    	else {
		    		$('.modal-footer').children().prop("disabled",true);
		    		self.status.waitingForServer = true;
		    		self.percentLoaded = 80;
       				self.updateProgressBar();
		    		self.parentComponent.children().eq(2).removeClass('active').addClass('list-group-item-success');
		    		self.parentComponent.children().eq(2).find($('.glyphicon-refresh-animate')).hide();
		    		self.parentComponent.children().eq(3).addClass('active');
		    		self.parentComponent.children().eq(3).find($('.glyphicon-refresh-animate')).show();
		    	}
		    }
		});

		this.model.save(this.model.attributes,{
       		success: function(){
       			self.status.done = true;
       			$('.modal-footer').children().prop("disabled",false);
       			self.percentLoaded = 100;
       			self.updateProgressBar();
            	self.parentComponent.children().eq(3).removeClass('active').addClass('list-group-item-success');
            	$('.modal-footer').children().removeClass('btn-danger').addClass('btn-success').text('Success!');
            	self.parentComponent.children().eq(3).find($('.glyphicon-refresh-animate')).hide();
       		},
       		error: function(model, xhr, options){
       			$('.modal-footer').children().prop("disabled",false);
       			self.modal.modal('hide');
       			Backbone.pubSub.trigger('event-server-error');
               	self.errorView.render([xhr.responseText]);
			} 
		});

	},

	cancelUpload: function(){
		if (!this.status.waitingForServer) {
			this.stop = true;
			this.model.clear();
			Backbone.pubSub.trigger('event-server-error');
		} 
		else if (this.status.done){
			window.appRouter.currentData.data = null;
			window.settings.place = {};
			window.location.hash = '#places/'+this.model.id;
		}
	}

});