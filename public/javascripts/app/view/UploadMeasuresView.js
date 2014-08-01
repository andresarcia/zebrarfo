var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

// TODO: change to red bg of input name when this is empty and show a error msg and shake input effect (animate.css)
//		 show a error msg when the input file has not file/files
//  	 Actualizar el numero de archivos procesados cada vez que uno esta listo
//		 mostrar los datos obtenidos cuando se procesen todos los archivos

com.spantons.view.UploadMeasuresView = Backbone.View.extend({

	el: '#upload-measures',

	options: {
		supportHtml5: false,
		fillName: false,
		fillFiles: false,
	},

	place: {
		name: null,
		numberCoordinates : 0,
		potencyMin : null,
		potencyMax : null,
		potencyAvg : null,
		sdPotencyAvg : null,
		placePotencySD_X : null,
		placePotencySD_M : null,
		avgPotencySD : null,
		coordinates : []
	},

	filesInfo: {
		sizeFiles: 0,
		numFiles: 0,
		numFilesParser: 0
	},

	files: null,

	events : {
		'change #upload-measures-name' : 'checkName',
		'change #upload-measures-file' : 'checkFiles',
		'click #upload-measures-button' : 'uploadData'
	},
	
	initialize: function(options){

		this.render();
	},

	render: function(){
		var source = $('#upload-template').html();
        var template = Handlebars.compile(source);
        this.$el.html(template);

		return this;
	},

	checkName: function(evt){
		var container = $(evt.target);

		if(container.val() === '') {
			this.options.fillName = false;
			// append class error bootstrap
		}
		else {
			this.options.fillName = true;
			this.place.name = container.val();
		}
	},

	checkFiles: function(evt){
		var container = $(evt.target);

		if (window.File && window.FileReader && window.FileList && window.Blob){
            this.options.supportHtml5 = true;
        	this.files = evt.target.files;

        } else 
        	this.options.supportHtml5 = false;

        if($(evt.target) !== '')
			this.options.fillFiles = true;
	},

	uploadData: function(evt){
		evt.preventDefault();
		var container = $(evt.target);

		if(!this.options.fillFiles || !this.options.fillName){
			console.log('append class error bootstra');
		
		} else {
			container.prop("disabled",true);
    		container.addClass('disable-button');

			if(!this.options.supportHtml5){
				console.log('no html5');
				// enviar datos a procesar al servidor
			}
			else 
				this.parseFiles(this.files);
		}
	},

	parseFiles: function(files){
		var self = this;
		var sizeFiles = 0;
		var fileContent = '';

		_.each(files, function(file){
			// if (!file.type.match('.txt')) 
        		// continue;
        	// else
        		// console.error('error de archivo');

   			var fr = new FileReader();
		    fr.onload = function(e) { 
		        parser(self.place,fr.result);
		        self.filesInfo.numFilesParser++;
		        if (self.filesInfo.numFilesParser == self.filesInfo.numFiles) 
					self.formatStatPlace();
		    };
		    fr.readAsText(file);
			sizeFiles += file.size;
		});

		self.filesInfo.sizeFiles = this.formatSizeUnits(sizeFiles);
		self.filesInfo.numFiles = files.length;
	},

	formatSizeUnits: function(bytes){
        if(bytes === 0) return '0 Byte';
	   	var k = 1000;
	   	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	   	var i = Math.floor(Math.log(bytes) / Math.log(k));
	   	return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
	},

	formatStatPlace: function(){
		this.place.potencyAvg = this.place.potencyAvg / this.place.numberCoordinates;
		this.place.potencyAvg = Number(this.place.potencyAvg.toFixed(5));
		
		if(this.place.numberCoordinates === 1)
			this.place.sdPotencyAvg = 0;
		else {
			this.place.placePotencySD_X = Math.sqrt((this.place.placePotencySD_X - (this.place.placePotencySD_M*this.place.placePotencySD_M)/this.place.numberCoordinates)/(this.place.numberCoordinates - 1));
			this.place.sdPotencyAvg = Number(this.place.placePotencySD_X.toFixed(5));
		}
		this.place.avgPotencySD = this.place.avgPotencySD / this.place.numberCoordinates;
		this.place.avgPotencySD = Number(this.place.avgPotencySD.toFixed(5));

		delete this.place.placePotencySD_X;
		delete this.place.placePotencySD_M;

		console.log(this.place);
	}


});