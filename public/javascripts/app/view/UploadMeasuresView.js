var app = app || {};
app.view = app.view || {};

app.view.UploadMeasuresView = Backbone.View.extend({

	el: '#ws-containter',
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
		gpsFunction: null
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
        this.viewContainers = new app.model.UploadMeasuresContainers({el:self.$el});
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
		var template = Zebra.tmpl['upload_measures'];
		var html = template(this.data);
    	this.$el.html(html);

		this.$el.find("#upload-measures-unit").select2( { placeholder: "Pick frequency unit"});
		this.$el.find("#upload-gps-position-function").select2();
		this.$el.find(".upload-measures-info-help").popover({
	        title: 'Files Format',
	        placement: 'left',
	        container: $('body'),
	        html: 'true',
	        content: "<small>" +
	        			"A measurement campaign defines what we call a Place. This is regularly composed of many individual text files captured by a single device. We provide scripts that can process the data in the raw format (the one provided by the device alone) and convert it to Zebra RFO input format<br>" +
	        			"<br>" + 
	        			"Zebra RFO uses data formatted as follows. A single text file contains a location (LAT and LON) with a set of frequencies out of a bandwidth:<br>" +
	        			"<br>" + 
	        			"<div class='well well-sm'>" + 
	        				"frequency_1 \\t power_1<br>" + 
	        				"frequency_2 \\t power_2<br>" + 
	        				"...<br>" + 
	        				"frequency_n \\t power_n<br>" + 
	        				"latitude<br>" + 
	        				"longitude<br>" + 
	        				"date of capture" + 
	        			"</div>" + 
	        			"Please download the script according to your input device:<br><br>" +
	        			"<b>Android device</b><br><br>" + 
	        			"If you are using the android application to capture the spectrum activity (with RFExplorer), you can download the following script in python (" + 
	        			"<a href='javascript:void(0)' id='download-android-parser'>android parser</a>" + 
	        			"), copy the script into the folder where your captured data is located. Then run the script as follows:<br><br>" + 
	        			"<div class='well well-sm'>python android_parser.py</div>" + 
	        			"As a result, the script generate a folder of parsed data in Zebra RFO format, ready to be uploaded (and consumed) by the system. Then proceed as follows:<br><br>" + 
	        			"<ol>" +
	        				"<li>Name the zone</li>" +
	        				"<li>Select all the parsed files (*.txt) which are numbered from 1 to N</li>" +
	        				"<li>Select the common unit of the frequency sample (for Android should be kilohertz) </li>" +
	        				"<li>Click on Synchronise</li>" +
	        			"</ol>" +
	        			"Wait for the processing.<br><br>" +
	        			"Now you can visualise your data…<br><br>" +
	        			"Enjoy!</small>",
	    
	    }).on('shown.bs.popover', function (eventShown) {
    		var $popup = $('#' + $(eventShown.target).attr('aria-describedby'));
    		$popup.find('#download-android-parser').click(function (e) {
        		$.fileDownload('/downloads/android_parser.py');
    		});
		});

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

		this.filesInfo.sizeFiles = app.util.FormatSizeUnits(sizeFiles);
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

			new app.view.ParsingMeasuresView({
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