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
	template: Handlebars.compile($("#upload-measures-template").html()),
	model: null,

	options: {
		supportHtml5: false,
		fillName: false,
		fillNameError: 'You must select a zone or enter a new zone',
		fillFiles: false,
		fillFilesError: 'You must select or drag at least one file'
	},

	modelPlace: null,

	filesInfo: {
		files: null,
		sizeFiles: 0,
		numFiles: 0,
		numFilesParser: 0
	},

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

		this.render();
		this.model = new com.spantons.model.UploadMeasuresContainers();
		this.modelPlace = new com.spantons.model.Place();

		if (window.File && window.FileReader && window.FileList && window.Blob){
            this.options.supportHtml5 = true;
            this.modelPlace.attributes.json = true;
		} else 
        	this.options.supportHtml5 = false;
		
		$(".ws-dragandrophandler").bind("dragenter", _.bind(this.dragEnterEvent, this));
		$(".ws-dragandrophandler").bind("dragover", _.bind(this.dragOverEvent, this));
		$(".ws-dragandrophandler").bind("dragleave", _.bind(this.dragLeaveEvent, this));
		$(".ws-dragandrophandler").bind("drop", _.bind(this.dropEvent, this));	

		Backbone.pubSub.on('event-server-error', this.enableForm, this);
	},

	render: function(){
        this.$el.html(this.template);

		return this;
	},

	checkName: function(){
		if(this.model.getNameContainerVal() === '') {
			this.options.fillName = false;
			this.model.setBadNameContainer();
		}
		else {
			this.options.fillName = true;
			this.modelPlace.attributes.name = this.model.getNameContainerVal();
			this.model.setGoodNameContainer();
		}
	},

	checkFiles: function(evt){
		if(this.options.supportHtml5)
			this.filesInfo.files = evt.target.files;
			
        if(this.model.getFilesContainerVal() !== ''){
			this.options.fillFiles = true;
			this.model.setGoodFilesContainer();
        } else {
        	this.options.fillFiles = false;
        	this.model.setBadFilesContainer();
        }

        this.fillFilesInfo();
	},

	dragEnterEvent: function(evt){
		evt.stopPropagation();
    	evt.preventDefault();
	},

	dragOverEvent: function(evt){
		evt.stopPropagation();
    	evt.preventDefault();
    	this.model.setDragFilesContainerOver();
	},

	dragLeaveEvent: function(evt){
		evt.stopPropagation();
    	evt.preventDefault();
    	this.model.setDragFilesContainerLeave();
	},

	dropEvent: function(evt){
		evt.stopPropagation();
    	evt.preventDefault();
    	this.filesInfo.files = evt.originalEvent.dataTransfer.files;
    	this.options.fillFiles = true;
    	this.model.setDragFilesContainerDrop();
		this.fillFilesInfo();
	},

	fillFilesInfo: function(){
		this.filesInfo.numFiles = this.filesInfo.files.length;
		var sizeFiles = 0;
		var filesBadType = [];
		_.each(this.filesInfo.files, function(file){
			if (file.name.split('.')[file.name.split('.').length - 1].toLowerCase() != 'txt') 
        		filesBadType.push(file);
			sizeFiles += file.size;
		});

		this.filesInfo.sizeFiles = formatSizeUnits(sizeFiles);
		if(filesBadType.length > 0){
			this.delateFiles();
			this.errorView.render(['Only .txt files are allowed']);
		} else 
			this.renderFilesInfo();
	},

	renderFilesInfo: function(){
		this.model.renderFilesInfoContainer(this.filesInfo.numFiles,this.filesInfo.sizeFiles);
	},

	delateFiles: function(){
		this.filesInfo.sizeFiles= '0 Byte';
		this.filesInfo.numFiles= 0;
		this.filesInfo.numFilesParser= 0;
		this.filesInfo.files = [];
		this.renderFilesInfo();
		this.options.fillFiles = false;
		this.model.setDeleteFilesContainerDefault();
	},

	enableForm: function(){
		this.model.enableNameContainer();
		this.model.enableFilesContainer();
		this.model.enableButtonDeleteContainer();
		this.model.enableButtonSendDataContainer();
	},

	disableForm: function(){
		this.model.disableNameContainer();
		this.model.disableFilesContainer();
		this.model.disableButtonDeleteContainer();
		this.model.disableButtonSendDataContainer();
	},

	uploadData: function(evt){
		evt.preventDefault();

		if(!this.options.fillFiles || !this.options.fillName){
			var error = [];
			if(!this.options.fillName){
				error.push(this.options.fillNameError);
				this.model.setBadNameContainer();
			}

			if(!this.options.fillFiles){
				error.push(this.options.fillFilesError);
				this.model.setBadFilesContainer();
			}

			this.errorView.render(error);
		
		} else {
			this.disableForm();

			new com.spantons.view.ParsingMeasuresView({
				model:this.modelPlace,
				files:this.filesInfo.files,
				errorView:this.errorView
			});
		}
	},
	
});