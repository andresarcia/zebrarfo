var app = app || {};
app.view = app.view || {};

app.view.ParsingMeasuresView = Backbone.View.extend({

	el: '#z-modal',

	reset: function(){
		this.model = null;
		this.files = null;
		this.stop = false;
		this.status = {};
		this.status.waitingForServer = false;
		this.status.done = false;
	},

	events: {
		'click #u-modal-parsing-cancel-btn' : 'cancelUpload'
	},

	initialize: function(options){
		var self = this;
		this.reset();
		if (options.placeName){
			this.model = new app.model.PlaceUpload({
				name:options.placeName,
				coordinates: []
			});
		} else 
			throw 'Place name are not defined';
		
		if(options.gpsFunction)
			this.model.set("gpsFunction",options.gpsFunction);

		if (options.files) 
			this.files = options.files;
		else 
			throw 'Any selected file';

		if (!options.unit) 
			throw 'Any frequency unit';

		if (!options.ext) 
			throw 'Any extension files';

		this.errorView = options.errorView;

		this.render();
		this.modal = $('#u-modal-parsing');
		this.modal.modal({keyboard: false, backdrop : 'static'});
		this.parentComponent = $('.list-group');
		this.progressBar = $('.progress-bar');
		this.lastPercentLoaded = 0;
		this.timeBase = 3;
		this.timeToWait = 0;

		this.restartProgressBar();

		var parser = new app.util.Parser();
		parser.initialize(this.files, this.model.attributes, options.unit, options.ext,
		function(numFilesProcessed){
			self.setNumberFilesParser(numFilesProcessed);
		}, function(err,place){
			if(err){
				$('.modal-footer').children().prop("disabled",false);
				self.modal.modal('hide');
				Backbone.pubSub.trigger('event-server-error');
				self.errorView.render(err);
			} else {
				self.model.attributes = place;
				self.showMeasuresData();
			}
		});
	},

	render: function(){
		var template = Zebra.tmpl.modal_parsing_measures;
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
			this.parentComponent.children().first().children().text(numFilesProcessed+' / '+this.files.length);	
			this.percentLoaded = (numFilesProcessed / this.files.length) * 40;
			this.updateProgressBar();
		}
	},

	showMeasuresData: function(){
		if(!this.stop){
			var tableCol = $('#u-modal-parsing-table').find('tr');
			// name 
			tableCol.eq(0).children().eq(1).html(this.model.attributes.name);
			// number of samples
			tableCol.eq(1).children().eq(1).html(this.model.attributes.coordinates.length);
			// number of frequencies
			tableCol.eq(2).children().eq(1).html(this.model.attributes.frequencies.values.length);
			// frequencies range
			tableCol.eq(3).children().eq(1).html('['+this.model.attributes.frequencies.values[0]+' - '+this.model.attributes.frequencies.values[this.model.attributes.frequencies.values.length - 1]+'] <small><b>'+this.model.attributes.frequencies.unit+'</b></small>');

			this.parentComponent.children().first().removeClass('active').addClass('list-group-item-success');

			$('#u-modal-parsing-table-heading').show();
			$('#u-modal-parsing-table').fadeIn(800);

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

				delete window.places;
				delete window.place;
				window.settings.place = {};
				window.location.hash = '#places/'+self.model.id;
			},
			error: function(model, xhr, options){
				if(xhr.responseJSON.message == "Access token has expired"){
						localStorage.removeItem('token');
						window.location.hash = '#';
				} else {
					$('.modal-footer').children().prop("disabled",false);
					self.modal.modal('hide');
					Backbone.pubSub.trigger('event-server-error');
					self.errorView.render([xhr.responseJSON.message]);
				}
			}
		});

	},

	cancelUpload: function(){
		if (!this.status.waitingForServer) {
			this.stop = true;
			this.model.clear();
			Backbone.pubSub.trigger('event-server-error');
		}
	}

});