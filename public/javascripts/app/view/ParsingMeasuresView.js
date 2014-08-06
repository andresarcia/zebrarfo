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
		waitingForServer: false
	},

	errorView: null,

	initialize: function(options){
		var self = this;
		if (options.model) 
			this.model = options.model;

		if (options.files) 
			this.files = options.files;

		if (options.errorView) 
			this.errorView = options.errorView;

		this.html5 = this.model.attributes.json;

		this.render();
		this.modal = $('#modal-parsing-measures-modal');
		this.modal.modal({keyboard: false,backdrop : 'static'});
		this.parentComponent = $('.list-group');
		this.progressBar = $('.progress-bar');

		this.setNumberFilesParser(0);
		this.status.initialize = true;
		this.status.parsing = true;

		if(this.html5){
			parserFiles(this.files,this.model.attributes,
			function(numFilesProcessed){
				self.setNumberFilesParser(numFilesProcessed);
			}, function(place){
				// console.log(self.model);
			});
		}
	},

	render: function(){
        this.$el.html(this.template);

		return this;
	},

	updateProgressBar: function(val){
		var total;

		if(!this.status.uploading)
			total = this.files.length;

		var percentLoaded = Math.round((val / total) * 40);
		this.progressBar.css('width',percentLoaded + '%');
		this.progressBar.text(percentLoaded + '%');
	},

	setNumberFilesParser: function(numFilesProcessed){
		var self = this;
		window.setTimeout(function(){
			self.parentComponent.children().first().children().text(numFilesProcessed+' / '+self.files.length);	
			self.updateProgressBar(numFilesProcessed);

			if(self.files.length == numFilesProcessed)
				self.showMeasuresData();

		}, 500);

	},

	showMeasuresData: function(){
		var self = this;

		$('#ws-modal-parsing-measures-data-table-name').text(this.model.attributes.name);
		$('#ws-modal-parsing-measures-data-table-numberCoordinates').text(this.model.attributes.numberCoordinates);
		$('#ws-modal-parsing-measures-data-table-potencyMin').text(this.model.attributes.potencyMin);
		$('#ws-modal-parsing-measures-data-table-potencyMax').text(this.model.attributes.potencyMax);
		$('#ws-modal-parsing-measures-data-table-potencyAvg').text(this.model.attributes.potencyAvg);
		$('#ws-modal-parsing-measures-data-table-sdPotencyAvg').text(this.model.attributes.sdPotencyAvg);
		$('#ws-modal-parsing-measures-data-table-avgPotencySD').text(this.model.attributes.avgPotencySD);
		
		this.parentComponent.children().first().removeClass('active').addClass('list-group-item-success');
		$('#ws-modal-parsing-measures-data-table').fadeIn(800);
		
		window.setTimeout(function(){
			self.uploadDataToServer();
		}, 500);
	},

	uploadDataToServer: function(){
		var self = this;
		this.parentComponent.children().first().next().next().addClass('active');
		
		this.model.save(this.model.attributes,{
       		success: function(model, response, options){
            	console.log('Model saved');
            	console.log(model);
       		},
       		error: function(model, xhr, options){
       			self.modal.modal('hide');
       			Backbone.pubSub.trigger('event-server-error');
               	self.errorView.render(['Failed procesing data in the server']);
			} 
		});

	}

});