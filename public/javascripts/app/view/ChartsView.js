var app = app || {};
app.view = app.view || {};

app.view.ChartsView = Backbone.View.extend({

	el: '#ws-containter',
	currentData: null,
	currentChart: null,

	events: {
		'click a[data-toggle="tab"]': 'change'
	},

	initialize: function(options){
		var self = this;
		this.id = "place-charts";
		this.errorView = options.errorView;
		this.waitingView = options.waitingView;

		window.settings.place.charts = window.settings.place.charts || {};
		window.settings.place.charts.occupation = window.settings.place.charts.occupation || {};
		window.settings.place.charts.heatmap = window.settings.place.charts.heatmap || {};
		window.settings.place.charts.whiteSpaces = window.settings.place.charts.whiteSpaces || {};

		this.render();
		this.waitingView.hide();

		if(window.settings.place.charts.tab) this.change(null,window.settings.place.charts.tab);
		else if(options.type !== undefined) this.change(null,options.type);
		else this.change(null,0);

		Backbone.pubSub.off('charts-change-to-heatmap');
		Backbone.pubSub.on('charts-change-to-heatmap', function(){
			self.change(null,1);
		});

		Backbone.pubSub.off('charts-change-channels');
		Backbone.pubSub.on('charts-change-channels', function(channels){
			window.settings.place.charts.channels = channels;
		});
	},

	change: function(evt,index){
		if(index === undefined)
			index = $('a[data-toggle="tab"]').index(evt.currentTarget);
		else 
			$('#charts-tabs li:eq('+index+') a').tab('show');

		window.settings.place.charts.tab = index;

		switch (index) {
			case 0:
				if(window.place.get("isShared")) 
					window.location.hash = '#places/shared/'+window.place.id+'/charts?type=occupation';
				else
					window.location.hash = '#places/'+window.place.id+'/charts?type=occupation';
				if(this.$el.find('#occupation-tab').is(':empty')) this.renderOccupation();
				else window.settings.place.charts.occupation.view.updateDataByTab();
				break;
				
			case 1:
				if(window.place.get("isShared")) 
					window.location.hash = '#places/shared/'+window.place.id+'/charts?type=heatmap';
				else
					window.location.hash = '#places/'+window.place.id+'/charts?type=heatmap';
				if(this.$el.find('#heatmap-tab').is(':empty')) this.renderHeatmap();
				else window.settings.place.charts.heatmap.view.updateDataByTab();
				break;

			case 2:
				if(window.place.get("isShared")) 
					window.location.hash = '#places/shared/'+window.place.id+'/charts?type=white-spaces';
				else
					window.location.hash = '#places/'+window.place.id+'/charts?type=white-spaces';
				if(this.$el.find('#white-spaces-tab').is(':empty')) this.renderWhiteSpaces();
				else window.settings.place.charts.whiteSpaces.view.updateDataByTab();
				break;
		}
	},

	renderOccupation: function(){
		var self = this;
		window.settings.place.charts.occupation.view = new app.view.OccupationView({
			waitingView: this.waitingView,
			errorView : this.errorView,
		});

		this.$el.find('#occupation-tab').html(window.settings.place.charts.occupation.view.render().el);
		window.settings.place.charts.occupation.view.renderComponents();
	},

	renderHeatmap: function(){
		var self = this;
		window.settings.place.charts.heatmap.view = new app.view.HeatmapView({
			waitingView: this.waitingView,
			errorView : this.errorView,
		});

		this.$el.find('#heatmap-tab').html(window.settings.place.charts.heatmap.view.render().el);
		window.settings.place.charts.heatmap.view.renderComponents();
	},

	renderWhiteSpaces: function(){
		var self = this;
		window.settings.place.charts.whiteSpaces.view = new app.view.WhiteSpacesView({
			waitingView: this.waitingView,
			errorView : this.errorView,
		});

		this.$el.find('#white-spaces-tab').html(window.settings.place.charts.whiteSpaces.view.render().el);
		window.settings.place.charts.whiteSpaces.view.renderComponents();
	},

	render: function(){
		var template = Zebra.tmpl.charts;
		var html = template(window.place);
		this.$el.html(html);

		return this;
	},

});