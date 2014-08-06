var com = com || {};
com.spantons = com.spantons || {};
com.spantons.model = com.spantons.model || {};

com.spantons.model.UploadMeasuresContainers = Backbone.Model.extend({

	nameContainer: null,
	filesContainer: null,
	dragFilesContainer: null,
	filesInfoContainer: null,
	buttonSendDataContainer: null,
	buttonDeleteContainer: null,

	initialize: function(options){
		this.nameContainer= $('#upload-measures-name');
		this.filesContainer= $('#upload-measures-file');
		this.dragFilesContainer = $('.ws-dragandrophandler');
		this.filesInfoContainer = $('#upload-measures-files-info');
		this.buttonSendDataContainer = $('#upload-measures-button');
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

	enableNameContainer: function(){
		this.nameContainer.prop("disabled",false);
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

	enableFilesContainer: function(){
		this.filesContainer.filestyle('disabled', false);
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

	enableButtonSendDataContainer: function(){
		this.buttonSendDataContainer.prop("disabled",false);
	},

	disableButtonSendDataContainer: function(){
		this.buttonSendDataContainer.prop("disabled",true);
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