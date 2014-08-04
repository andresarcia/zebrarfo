var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

// TODO: change to red bg of input name when this is empty and show a error msg and shake input effect (animate.css)
//		 show a error msg when the input file has not file/files
//  	 Actualizar el numero de archivos procesados cada vez que uno esta listo
//		 Mostrar los datos obtenidos numero y peso cuando salga del input file
//		 mostrar los datos obtenidos cuando se procesen todos los archivos
//		 hacer que el choosefile cambie de color tambien
//		 si le da directo al boton que se pongan en rojo los que no han sido seleccionados
//		 validar el tipo de archivo

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
	errorView: null,

	events : {
		'blur #upload-measures-name' : 'checkName',
		'change #upload-measures-file' : 'checkFiles',
		'click #upload-measures-button' : 'uploadData',
		'click #upload-measures-button-delete' : 'delateFiles'
	},
	
	initialize: function(options){
		if (options.errorView) 
			this.errorView = options.errorView;

		if (window.File && window.FileReader && window.FileList && window.Blob)
            this.options.supportHtml5 = true;
        else 
        	this.options.supportHtml5 = false;
		this.render();
		$('#upload-measures-button-delete').prop("disabled",true);

		$("#upload-measures-file").filestyle({buttonBefore: true, buttonName: "btn-primary"});
		
		$(".ws-dragandrophandler").bind("dragenter", _.bind(this.dragEnterEvent, this));
		$(".ws-dragandrophandler").bind("dragover", _.bind(this.dragOverEvent, this));
		$(".ws-dragandrophandler").bind("dragleave", _.bind(this.dragLeaveEvent, this));
		$(".ws-dragandrophandler").bind("drop", _.bind(this.dropEvent, this));
		
	},

	render: function(){
		var source = $('#upload-template').html();
        var template = Handlebars.compile(source);
        this.$el.html(template);

		return this;
	},

	checkName: function(evt){
		var container = $(evt.target);
		var containerParent = container.parent();
		if(container.val() === '') {
			this.options.fillName = false;
			containerParent.addClass('has-error');
			containerParent.removeClass('has-success');
			containerParent.children().last().addClass('glyphicon-remove');
			containerParent.children().last().removeClass('glyphicon-ok');
		}
		else {
			this.options.fillName = true;
			this.place.name = container.val();
			containerParent.addClass('has-success');
			containerParent.removeClass('has-error');
			containerParent.children().last().addClass('glyphicon-ok');
			containerParent.children().last().removeClass('glyphicon-remove');
		}
	},

	checkFiles: function(evt){
		var container = $(evt.target);
		
		if(this.options.supportHtml5)
			this.files = evt.target.files;

        if($(evt.target).val() !== ''){
			this.options.fillFiles = true;
			$("#upload-measures-file").filestyle('success');
			$('.ws-dragandrophandler').css('border', '2px dashed #5CB85C');
			$('#upload-measures-button-delete').prop("disabled",false);
			this.fillFilesInfo();
        } else {
        	this.options.fillFiles = false;
        	$("#upload-measures-file").filestyle('error');
        	$('.ws-dragandrophandler').css('border', '2px dashed #D9534F');
        }
	},

	dragEnterEvent: function(evt){
		evt.stopPropagation();
    	evt.preventDefault();
	},

	dragOverEvent: function(evt){
		evt.stopPropagation();
    	evt.preventDefault();
    	$('.ws-dragandrophandler').css('border', '2px solid #0B85A1');
	},

	dragLeaveEvent: function(evt){
		evt.stopPropagation();
    	evt.preventDefault();
    	$('.ws-dragandrophandler').css('border', '2px dashed #C3C5C7');
	},

	dropEvent: function(evt){
		evt.stopPropagation();
    	evt.preventDefault();
    	$("#upload-measures-file").filestyle('clear');
		$('.ws-dragandrophandler').css('border', '2px dashed #5CB85C');
		$('#upload-measures-button-delete').prop("disabled",false);

		if(this.options.supportHtml5){
			this.files = evt.originalEvent.dataTransfer.files;
			this.options.fillFiles = true;
			$("#upload-measures-file").filestyle('success');
			this.fillFilesInfo();
		}
	},

	fillFilesInfo: function(){
		this.filesInfo.numFiles = this.files.length;
		var sizeFiles = 0;
		var filesBadType = [];
		_.each(this.files, function(file){
			if (file.name.split('.')[file.name.split('.').length - 1].toLowerCase() != 'txt') 
        		filesBadType.push(file);
			sizeFiles += file.size;
		});

		this.filesInfo.sizeFiles = formatSizeUnits(sizeFiles);
		if(filesBadType.length > 0){
			this.delateFiles();
			this.errorView.render('Only .txt files are allowed');
		} else 
			this.renderFilesInfo();
	},

	renderFilesInfo: function(){

	},

	delateFiles: function(){
		this.filesInfo.sizeFiles= 0;
		this.filesInfo.numFiles= 0;
		this.filesInfo.numFilesParser= 0;
		this.files = [];
		$("#upload-measures-file").filestyle('clear');
		$("#upload-measures-file").filestyle('primary');
		$('.ws-dragandrophandler').css('border', '2px dashed #C3C5C7');
		this.options.fillFiles = false;
		$('#upload-measures-button-delete').prop("disabled",true);
	},

	uploadData: function(evt){
		evt.preventDefault();
		var container = $(evt.target);

		if(!this.options.fillFiles || !this.options.fillName){
			this.errorView.render('hola');
		
		} else {
			$('#upload-measures-name').prop("disabled",true);
			$("#upload-measures-file").filestyle('disabled', true);
			$('#upload-measures-button-delete').prop("disabled",true);
			container.prop("disabled",true);

			if(!this.options.supportHtml5){
				console.log('no html5');
				// enviar datos a procesar al servidor
			}
			else 
				this.parseFiles(this.files);
		}
	},
	/* ------------------------------------------------------------------------- */
	parseFiles: function(files){
		var self = this;

		_.each(files, function(file){
   			var fr = new FileReader();
		    fr.onload = function(e) { 
		        parser(self.place,fr.result);
		        self.filesInfo.numFilesParser++;
		        if (self.filesInfo.numFilesParser == self.filesInfo.numFiles) 
					self.formatStatPlace();
		    };
		    fr.readAsText(file);
		});
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