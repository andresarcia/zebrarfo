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
		ext: null,
		gpsFunction: null
	},

	events : {
		'blur #upload-measures-name' : 'checkName',
		'click .item-zone-name' : 'pickName',
		'change #upload-measures-file' : 'checkFiles',
		'change #upload-measures-unit' : 'changeUnit',
		'change #upload-gps-position-function' : 'changeGpsFunction',
		'click #upload-measures-button' : 'uploadData',
		'click #upload-measures-button-delete' : 'deleteFiles',
		'click #upload-measures-info-help': 'help',
	},
	
	initialize: function(options){
		var self = this;

		this.errorView = options.errorView;
		this.waitingView = options.waitingView;
		this.data = options.data;

		this.waitingView.closeView();
		this.render();
		this.viewContainers = new app.model.UploadMeasuresContainers({el:self.$el});
   		$(".ws-dragandrophandler").bind("dragenter", _.bind(self.dragEnterEvent, self));
		$(".ws-dragandrophandler").bind("dragover", _.bind(self.dragOverEvent, self));
		$(".ws-dragandrophandler").bind("dragleave", _.bind(self.dragLeaveEvent, self));
		$(".ws-dragandrophandler").bind("drop", _.bind(self.dropEvent, self));	

		Backbone.pubSub.off('event-server-error');
		Backbone.pubSub.on('event-server-error', function(){
			self.enableForm();
			self.deleteFiles();
		}, self);

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

	help: function(){
		window.location.hash = '#help';
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
		var self = this;
		this.filesInfo.numFiles = this.filesInfo.files.length;
		var sizeFiles = 0;
		var filesBadType = [];

		_.find(this.filesInfo.files, function(file,i){
			var ext = file.name.split('.')[file.name.split('.').length - 1].toLowerCase();
			if(i == 0)
				self.filesInfo.ext = ext;

			if(ext != 'txt' && ext != 'json'){
				filesBadType.push('Only .txt and .json files are allowed');
				return;
			} else {
				if(self.filesInfo.ext != ext){
					filesBadType.push('All files must have the same extension');
					return;
				}
			}
			sizeFiles += file.size;
		});

		this.filesInfo.sizeFiles = app.util.FormatSizeUnits(sizeFiles);
		if(filesBadType.length > 0){
			this.deleteFiles();
			this.errorView.render(filesBadType);
		} else
			this.renderFilesInfo();
	},

	renderFilesInfo: function(){
		var self = this;
		this.viewContainers.renderFilesInfoContainer(this.filesInfo.numFiles,this.filesInfo.sizeFiles);

		if(this.options.supportHtml5){
			var fr = new FileReader();
			fr.readAsText(this.filesInfo.files[0]);
			fr.onload = function(e){ 
				var data = fr.result;
				var frequency;

				if(self.filesInfo.ext == 'txt'){
					var lines = data.split('\n');
					frequency = Number(lines[0].split('\t')[0]);
				} else if(self.filesInfo.ext == 'json'){
					var json = JSON.parse(data);
					frequency = json.frequencies.values[0];
				}

				if(frequency == null || frequency == undefined || frequency == 0){
					self.deleteFiles();
					self.errorView.render(["Error in files format"]);
					return;
				}

				var unit;
				if(frequency % 10 == frequency)
					unit = "GHz";

				else if(frequency % 10000 == frequency)
					unit = "MHz";

				else if(frequency % 1000000 == frequency)
					unit = "kHz";

				else if(frequency % 1000000000 == frequency)
					unit = "Hz";

				self.$el.find('#upload-measures-unit').select2("val", unit);
				self.filesInfo.unit = unit;
				self.viewContainers.setGoodUnitContainer();
			};
		}
	},

	deleteFiles: function(){
		this.filesInfo.sizeFiles= '0 Byte';
		this.filesInfo.numFiles= 0;
		this.filesInfo.numFilesParser= 0;
		this.filesInfo.files = [];
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
				ext: this.filesInfo.ext,
				unit: this.filesInfo.unit,
				gpsFunction: this.filesInfo.gpsFunction,
				errorView:this.errorView
			});
		}
	},

	render: function(){
		var template = Zebra.tmpl.upload_measures;
		var html = template(this.data);
		this.$el.html(html);

		this.$el.find("#upload-measures-unit").select2( { placeholder: "Pick frequency unit"});
		this.$el.find("#upload-gps-position-function").select2();

		return this;
	}

});