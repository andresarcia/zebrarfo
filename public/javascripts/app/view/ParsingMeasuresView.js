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
		waitingForServer: false,
		done: false
	},

	errorView: null,
	stop: false,

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

		if (!options.unit) 
			throw 'Any frequency unit';

		if (options.errorView) 
			this.errorView = options.errorView;

		this.render();
		this.modal = $('#modal-parsing-measures-modal');
		this.modal.modal({keyboard: false, backdrop : 'static'});
		this.parentComponent = $('.list-group');
		this.progressBar = $('.progress-bar');

		this.restartProgressBar();

		if(this.html5){
			var parser = new com.spantons.util.Parser();
			parser.initialize(this.files,this.model.attributes,options.unit,
			function(numFilesProcessed){
				self.setNumberFilesParser(numFilesProcessed);
			}, function(){
				self.showMeasuresData();
			});
		}
	},

	render: function(){
		var html = this.template({numFiles: this.files.length});
        this.$el.html(html);

		return this;
	},

	updateProgressBar: function(){
		if(!this.stop){
			this.progressBar.css('width',this.percentLoaded + '%');
			this.progressBar.text(this.percentLoaded + '%');

			if(this.percentLoaded >= 100){
				this.progressBar.css('width','100%');
				this.progressBar.text('100%');
				this.progressBar.addClass('progress-bar-success');
			}
		}
	},	

	restartProgressBar: function(){
		this.progressBar.removeClass('progress-bar-success');
		this.progressBar.css('width','0%');
		this.progressBar.text('0%');
	},

	setNumberFilesParser: function(numFilesProcessed){
		if(!this.stop){
			this.parentComponent.children().first().children().text(numFilesProcessed+' / '+this.files.length);	
			this.percentLoaded = (numFilesProcessed / this.files.length) * 40;
			this.updateProgressBar();
		}
	},

	showMeasuresData: function(){
		if(!this.stop){

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
		    	self.updateProgressBar();

		    	if(self.percentLoaded >= 80){
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
		else if (this.status.done) {
			window.appRouter.currentData.id = 'singlePlace';
			var newModelData = this.model.attributes;
			delete newModelData.json;
			delete newModelData.coordinates;
			var newModel = new com.spantons.model.Place(newModelData, {parse: true});
			
			window.appRouter.currentData.data = newModel;
			window.location.hash = '#places/'+this.model.id;
		}
	}

});