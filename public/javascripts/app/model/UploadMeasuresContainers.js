var com = com || {};
com.spantons = com.spantons || {};
com.spantons.model = com.spantons.model || {};

com.spantons.model.UploadMeasuresContainers = Backbone.Model.extend({

	nameContainer: null,
	filesContainer: null,
	unitContainer: null,
	dragFilesContainer: null,
	filesInfoContainer: null,
	buttonSendDataContainer: null,
	buttonDeleteContainer: null,

	initialize: function(options){
		if(options.el)
			this.el = options.el;

		this.nameContainer= this.el.find($('#upload-measures-name'));
		this.filesContainer= this.el.find($('#upload-measures-file'));
		this.unitContainer = this.el.find($('#upload-measures-unit'));
		this.dragFilesContainer = this.el.find($('.ws-dragandrophandler'));
		this.filesInfoContainer = this.el.find($('#upload-measures-files-info'));
		this.buttonSendDataContainer = this.el.find($('#upload-measures-button'));
		this.buttonDeleteContainer = this.el.find($('#upload-measures-button-delete'));

		this.filesContainer.filestyle({buttonBefore: true, buttonName: "btn-primary"});
		this.disableButtonDeleteContainer();
	},

	getNameContainerVal: function(){
		return this.nameContainer.val();
	},

	setNameContainerVal: function(val){
		this.nameContainer.val(val);
	},

	setGoodNameContainer: function(){
		var containerParent = this.nameContainer.parent();
		containerParent.children().first().children().first().removeClass('btn-default');
		containerParent.children().first().children().first().removeClass('btn-danger');
		containerParent.children().first().children().first().addClass('btn-success');
		containerParent.addClass('has-success');
		containerParent.removeClass('has-error');
		containerParent.children().last().addClass('glyphicon-ok');
		containerParent.children().last().removeClass('glyphicon-remove');
	},

	setBadNameContainer: function(){
		var containerParent = this.nameContainer.parent();
		containerParent.children().first().children().first().removeClass('btn-default');
		containerParent.children().first().children().first().removeClass('btn-success');
		containerParent.children().first().children().first().addClass('btn-danger');
		containerParent.addClass('has-error');
		containerParent.removeClass('has-success');
		containerParent.children().last().addClass('glyphicon-remove');
		containerParent.children().last().removeClass('glyphicon-ok');
	},

	disableNameContainer: function(){
		this.nameContainer.prop("disabled",true);
		this.nameContainer.parent().children().first().children().first().prop("disabled",true);
	},

	enableNameContainer: function(){
		this.nameContainer.prop("disabled",false);
		this.nameContainer.parent().children().first().children().first().prop("disabled",false);
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

	setGoodUnitContainer: function(){
		var containerParent = this.unitContainer.parent();
		containerParent.addClass('has-success');
		containerParent.removeClass('has-error');
	},

	setBadUnitContainer: function(){
		var containerParent = this.unitContainer.parent();
		containerParent.addClass('has-error');
		containerParent.removeClass('has-success');
	},

	disableUnitContainer: function(){
		this.unitContainer.prop("disabled",true);
	},

	enableUnitContainer: function(){
		this.unitContainer.prop("disabled",false);
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
		var containers = this.filesInfoContainer.find('span');

		containers.first().text(numFiles);
		containers.last().text(sizeFiles);
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