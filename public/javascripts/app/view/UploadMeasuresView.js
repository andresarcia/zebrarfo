var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.UploadMeasuresView = Backbone.View.extend({

	el: '#ws-containter',
	template: Handlebars.compile($("#upload-measures-template").html()),
	viewContainers: null,

	options: {
		supportHtml5: false,
		fillName: false,
		fillNameError: 'You must pick a zone or enter a new zone',
		fillFiles: false,
		fillFilesError: 'You must select or drag at least one file',
		fillUnitError: 'You must pick a frequency unit'
	},

	placeName: null,

	filesInfo: {
		files: null,
		sizeFiles: 0,
		numFiles: 0,
		numFilesParser: 0,
		unit: null,
		gpsFunction: 'avg'
	},

	events : {
		'blur #upload-measures-name' : 'checkName',
		'click .item-zone-name' : 'pickName',
		'change #upload-measures-file' : 'checkFiles',
		'change #upload-measures-unit' : 'changeUnit',
		'change #upload-gps-position-function' : 'changeGpsFunction',
		'click #upload-measures-button' : 'uploadData',
		'click #upload-measures-button-delete' : 'delateFiles',
	},
	
	initialize: function(options){
		var self = this;

		this.errorView = options.errorView;
		this.errorView.closeView();
		this.waitingView = options.waitingView;
		this.data = options.data;

		this.waitingView.closeView();
        this.render();
        this.viewContainers = new com.spantons.model.UploadMeasuresContainers({el:self.$el});
   	    $(".ws-dragandrophandler").bind("dragenter", _.bind(self.dragEnterEvent, self));
		$(".ws-dragandrophandler").bind("dragover", _.bind(self.dragOverEvent, self));
		$(".ws-dragandrophandler").bind("dragleave", _.bind(self.dragLeaveEvent, self));
		$(".ws-dragandrophandler").bind("drop", _.bind(self.dropEvent, self));	

		Backbone.pubSub.on('event-server-error', self.enableForm, self);
		
		if(window.appRouter.currentData.id == 'singlePlace'){
			this.options.fillName = true;
			this.placeName = this.data.attributes.name;
			this.viewContainers.setNameContainerVal(this.placeName);
			this.viewContainers.setGoodNameContainer();
			this.viewContainers.disableNameContainer();
		}

		this.viewContainers.setGoodGpsFunctionContainer();

		if (window.File && window.FileReader && window.FileList && window.Blob)
            this.options.supportHtml5 = true;
		else 
        	this.options.supportHtml5 = false;	
	},

	render: function(){
		
		var html = this.template(this.data);
    	this.$el.html(html);

		this.$el.find("#upload-measures-unit").select2( { placeholder: "Pick frequency unit"});
		this.$el.find("#upload-gps-position-function").select2();

		return this;
	},

	pickName: function(evt){
		this.viewContainers.nameContainer.val($(evt.currentTarget).text());
		this.viewContainers.setGoodNameContainer();
		this.options.fillName = true;
		this.placeName = this.viewContainers.getNameContainerVal();
	},

	checkName: function(){
		if(this.viewContainers.getNameContainerVal() === '') {
			this.options.fillName = false;
			this.viewContainers.setBadNameContainer();
		}
		else {
			this.options.fillName = true;
			this.placeName = this.viewContainers.getNameContainerVal();
			this.viewContainers.setGoodNameContainer();
		}
	},

	checkFiles: function(evt){
		if(this.options.supportHtml5){
			this.filesInfo.files = null;
			this.filesInfo.files = evt.target.files;
		}
		
        if(this.viewContainers.getFilesContainerVal() !== ''){
			this.options.fillFiles = true;
			this.viewContainers.setGoodFilesContainer();
        } else {
        	this.options.fillFiles = false;
        	this.viewContainers.setBadFilesContainer();
        }

        this.fillFilesInfo();
	},

	changeUnit: function(evt){
		this.filesInfo.unit = evt.val;
		this.viewContainers.setGoodUnitContainer();
	},

	changeGpsFunction: function(evt){
		this.filesInfo.gpsFunction = evt.val;
	},

	dragEnterEvent: function(evt){
		evt.stopPropagation();
    	evt.preventDefault();
	},

	dragOverEvent: function(evt){
		evt.stopPropagation();
    	evt.preventDefault();
    	this.viewContainers.setDragFilesContainerOver();
	},

	dragLeaveEvent: function(evt){
		evt.stopPropagation();
    	evt.preventDefault();
    	this.viewContainers.setDragFilesContainerLeave();
	},

	dropEvent: function(evt){
		evt.stopPropagation();
    	evt.preventDefault();
    	this.filesInfo.files = null;
    	this.filesInfo.files = evt.originalEvent.dataTransfer.files;
    	this.options.fillFiles = true;
    	this.viewContainers.setDragFilesContainerDrop();
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

		this.filesInfo.sizeFiles = com.spantons.util.FormatSizeUnits(sizeFiles);
		if(filesBadType.length > 0){
			this.delateFiles();
			this.errorView.render(['Only .txt files are allowed']);
		} else 
			this.renderFilesInfo();
	},

	renderFilesInfo: function(){
		this.viewContainers.renderFilesInfoContainer(this.filesInfo.numFiles,this.filesInfo.sizeFiles);
	},

	delateFiles: function(){
		this.filesInfo.sizeFiles= '0 Byte';
		this.filesInfo.numFiles= 0;
		this.filesInfo.numFilesParser= 0;
		this.filesInfo.files = [];
		this.renderFilesInfo();
		this.options.fillFiles = false;
		this.viewContainers.setDeleteFilesContainerDefault();
	},

	enableForm: function(){
		this.viewContainers.enableNameContainer();
		this.viewContainers.enableFilesContainer();
		this.viewContainers.enableUnitContainer();
		this.viewContainers.enableGpsFunctionContainer();
		this.viewContainers.enableButtonDeleteContainer();
		this.viewContainers.enableButtonSendDataContainer();
	},

	disableForm: function(){
		this.viewContainers.disableNameContainer();
		this.viewContainers.disableFilesContainer();
		this.viewContainers.disableUnitContainer();
		this.viewContainers.disableGpsFunctionContainer();
		this.viewContainers.disableButtonDeleteContainer();
		this.viewContainers.disableButtonSendDataContainer();
	},

	uploadData: function(evt){

		evt.preventDefault();

		if(!this.options.fillFiles || !this.options.fillName || !this.filesInfo.unit){
			var error = [];
			if(!this.options.fillName){
				error.push(this.options.fillNameError);
				this.viewContainers.setBadNameContainer();
			}

			if(!this.options.fillFiles){
				error.push(this.options.fillFilesError);
				this.viewContainers.setBadFilesContainer();
			}

			if(!this.filesInfo.unit){
				error.push(this.options.fillUnitError);
				this.viewContainers.setBadUnitContainer();
			}

			this.errorView.render(error);
		
		} else {
			
			this.disableForm();

			new com.spantons.view.ParsingMeasuresView({
				placeName:this.placeName,
				supportHtml5: this.options.supportHtml5,
				files:this.filesInfo.files,
				unit: this.filesInfo.unit,
				gpsFunction: this.filesInfo.gpsFunction,
				errorView:this.errorView
			});
		}
	},
	
});