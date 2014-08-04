var com = com || {};
com.apress = com.apress || {};
com.apress.model = com.apress.model || {};

com.apress.model.UploadMeasuresContainers = Backbone.Model.extend({

	nameContainer: null,
	filesContainer: null,
	dragFilesContainer: null,
	filesInfoContainer: null,
	buttonDeleteContainer: null,

	initialize: function(options){
		this.nameContainer= $('#upload-measures-name');
		this.filesContainer= $('#upload-measures-file');
		this.dragFilesContainer = $('.ws-dragandrophandler');
		this.filesInfoContainer = $('#upload-measures-files-info');
		this.buttonDeleteContainer = $('#upload-measures-button-delete');

		this.filesContainer.filestyle({buttonBefore: true, buttonName: "btn-primary"});
		this.disableButtonDeleteContainer();
	},

	getNameContainerVal: function(){
		return this.nameContainer.val();
	},

	setGoodNameContainer: function(){
		var containerParent = this.nameContainer.parent();
		containerParent.addClass('has-success');
		containerParent.removeClass('has-error');
		containerParent.children().last().addClass('glyphicon-ok');
		containerParent.children().last().removeClass('glyphicon-remove');
	},

	setBadNameContainer: function(){
		var containerParent = this.nameContainer.parent();
		containerParent.addClass('has-error');
		containerParent.removeClass('has-success');
		containerParent.children().last().addClass('glyphicon-remove');
		containerParent.children().last().removeClass('glyphicon-ok');
	},

	disableNameContainer: function(){
		this.nameContainer.prop("disabled",true);
	},

	/* ------------------------------------------------------------------------- */
	
	getFilesContainerVal: function(){
		return this.filesContainer.val();
	},

	setGoodFilesContainer: function(){
		this.filesContainer.filestyle('success');
		this.dragFilesContainer.css('border', '2px dashed #5CB85C');
		this.enableButtonDeleteContainer();
	},

	setBadFilesContainer: function(){
		this.filesContainer.filestyle('error');
        this.dragFilesContainer.css('border', '2px dashed #D9534F');
        this.disableButtonDeleteContainer();
	},

	disableFilesContainer: function(){
		this.filesContainer.filestyle('disabled', true);
	},

	/* ------------------------------------------------------------------------- */

	setDragFilesContainerOver: function(){
		this.dragFilesContainer.css('border', '2px solid #0B85A1');
	},

	setDragFilesContainerLeave: function(){
		this.dragFilesContainer.css('border', '2px dashed #C3C5C7');
	},

	setDragFilesContainerDrop: function(){
		this.filesContainer.filestyle('clear');
		this.setGoodFilesContainer();
	},

	/* ------------------------------------------------------------------------- */

	renderFilesInfoContainer: function(numFiles,sizeFiles){
		this.filesInfoContainer.children().first().children().text(numFiles);
		this.filesInfoContainer.children().last().children().text(sizeFiles);
	},

	/* ------------------------------------------------------------------------- */
	
	setDeleteFilesContainerDefault: function(){
		this.filesContainer.filestyle('clear');
		this.filesContainer.filestyle('primary');
		this.setDragFilesContainerLeave();
		this.disableButtonDeleteContainer();
	},

	enableButtonDeleteContainer: function(){
		this.buttonDeleteContainer.prop("disabled",false);
	},

	disableButtonDeleteContainer: function(){
		this.buttonDeleteContainer.prop("disabled",true);
	}

});