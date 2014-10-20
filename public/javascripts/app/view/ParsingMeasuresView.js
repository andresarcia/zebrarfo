var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.ParsingMeasuresView = Backbone.View.extend({

	el: '#modal-parsing-measures',
	model: null,
	files: null,
	html5: null,
	template: Handlebars.compile($("#modal-parsing-measures-template").html()),

	modal: null,
	progressBar: null,
	parentComponent: null,

	status: {
		initialize: false,
		parsing: false,
		uploading: false,
		waitingForServer: false,
		done: false
	},

	errorView: null,
	stop: false,

	timeBase: 3,
	timeToWait: 0,

	events: {
		'click #ws-modal-parsing-measures-button' : 'cancelUpload'
	},

	initialize: function(options){
		var self = this;

		if (options.placeName && options.supportHtml5){
			this.model = new com.spantons.model.PlaceUpload({name:options.placeName,json:options.supportHtml5});
			this.html5 = options.supportHtml5;
		} else 
			throw 'Place name or html5 support are not defined';
		
		if (options.files) 
			this.files = options.files;
		else 
			throw 'Any selected file';

		if (options.errorView) 
			this.errorView = options.errorView;

		this.render();
		this.modal = $('#modal-parsing-measures-modal');
		this.modal.modal({keyboard: false, backdrop : 'static'});
		this.parentComponent = $('.list-group');
		this.progressBar = $('.progress-bar');

		this.setNumberFilesParser(0);
		this.status.initialize = true;
		this.status.parsing = true;

		if(this.html5){
			
			var parser = new com.spantons.util.Parser();
			parser.initialize(this.files,this.model.attributes,
			function(numFilesProcessed){
				self.setNumberFilesParser(numFilesProcessed);
			}, function(){

			});

		}
	},

	render: function(){
		var html = this.template({numFiles: this.files.length});
        this.$el.html(html);

		return this;
	},

	updateProgressBar: function(val){
		if(!this.stop){
			var total;
			var percentLoaded;

			if(!this.status.uploading)
				percentLoaded = Math.round((val / this.files.length) * 40);
			else 
				percentLoaded = Math.round(40 + val);
				
			this.progressBar.css('width',percentLoaded + '%');
			this.progressBar.text(percentLoaded + '%');

			if(percentLoaded >= 100)
				this.progressBar.addClass('progress-bar-success');
		}
	},	

	setNumberFilesParser: function(numFilesProcessed){
		if(!this.stop){
			var self = this;

			this.timeToWait += this.timeBase;

			setTimeout(function() {
				self.parentComponent.children().first().children().text(numFilesProcessed+' / '+self.files.length);	
				self.updateProgressBar(numFilesProcessed);

				if(self.files.length == numFilesProcessed)
					self.showMeasuresData();
			}, this.timeToWait);
		}
	},

	showMeasuresData: function(){
		if(!this.stop){
			var self = this;

			$('#ws-modal-parsing-measures-data-table-name').html(this.model.attributes.name);
			$('#ws-modal-parsing-measures-data-table-numberCoordinates').html(this.model.attributes.numberCoordinates);
			$('#ws-modal-parsing-measures-data-table-numberPowerFrequency').html(this.model.attributes.numberPowerFrequency);
			$('#ws-modal-parsing-measures-data-table-frequenciesBandwidth').html('['+this.model.attributes.frequencyMin/1000+' - '+this.model.attributes.frequencyMax/1000+'] <small><b>MHz</b></small>');
			$('#ws-modal-parsing-measures-data-table-powerMin').html(this.model.attributes.powerMin + ' <small><b>dBm</b></small>');
			$('#ws-modal-parsing-measures-data-table-powerMax').html(this.model.attributes.powerMax + ' <small><b>dBm</b></small>');
			$('#ws-modal-parsing-measures-data-table-powerAvg').html(this.model.attributes.powerAvg + ' <small><b>dBm</b></small>');
			$('#ws-modal-parsing-measures-data-table-sdPowerAvg').html(this.model.attributes.sdPowerAvg + ' <small><b>dBm</b></small>');
			$('#ws-modal-parsing-measures-data-table-avgPowerSD').html(this.model.attributes.avgPowerSD + ' <small><b>dBm</b></small>');
			
			this.parentComponent.children().first().removeClass('active').addClass('list-group-item-success');
			$('#ws-modal-parsing-measures-data-table').fadeIn(800);
			
			window.setTimeout(function(){
				self.uploadDataToServer();
			}, 500);
		}
	},

	uploadDataToServer: function(){
		var self = this;
		this.parentComponent.children().eq(2).addClass('active');
		this.parentComponent.children().eq(2).find($('.glyphicon-refresh-animate')).show();
		this.status.uploading = true;

		this.model.on('progress', function(evt) { 
			if (evt.lengthComputable) {
		    	var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
		    	self.updateProgressBar(percentLoaded * 40 / 100);

		    	if(percentLoaded >= 40){
		    		$('.modal-footer').children().prop("disabled",true);
		    		self.status.waitingForServer = true;
		    		self.parentComponent.children().eq(2).removeClass('active').addClass('list-group-item-success');
		    		self.parentComponent.children().eq(2).find($('.glyphicon-refresh-animate')).hide();
		    		self.parentComponent.children().eq(3).addClass('active');
		    		self.parentComponent.children().eq(3).find($('.glyphicon-refresh-animate')).show();
		    	}
		    }
		});

		this.model.save(this.model.attributes,{
       		success: function(model, response, options){
       			self.status.done = true;
       			$('.modal-footer').children().prop("disabled",false);
       			self.updateProgressBar(60);
            	self.parentComponent.children().eq(3).removeClass('active').addClass('list-group-item-success');
            	$('.modal-footer').children().removeClass('btn-danger').addClass('btn-success').text('Success!');
            	self.parentComponent.children().eq(3).find($('.glyphicon-refresh-animate')).hide();
       		},
       		error: function(model, xhr, options){
       			$('.modal-footer').children().prop("disabled",false);
       			self.modal.modal('hide');
       			Backbone.pubSub.trigger('event-server-error');
               	self.errorView.render(['Failed procesing data in the server']);
			} 
		});

	},

	cancelUpload: function(){
		if (!this.status.waitingForServer) {
			this.stop = true;
			this.model.clear();
			Backbone.pubSub.trigger('event-server-error');
		} 
		else if (this.status.done) 
			window.location.hash = '#places/'+this.model.id+'/coordinates';
	}

});