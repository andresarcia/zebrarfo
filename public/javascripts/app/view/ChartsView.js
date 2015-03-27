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
		this.id = 'place-charts';
		this.errorView = options.errorView;
		this.waitingView = options.waitingView;
		this.data = options.data;

		window.settings.place.charts = window.settings.place.charts || {};
		window.settings.place.charts.occupation = window.settings.place.charts.occupation || {};
		window.settings.place.charts.heatmap = window.settings.place.charts.heatmap || {};

		this.render();
		this.waitingView.closeView();

		if(window.settings.place.charts.tab)
			this.change(null,window.settings.place.charts.tab);
		else if(options.type !== undefined)
			this.change(null,options.type);
		else
			this.change(null,0);

		Backbone.pubSub.off('single-place-change-to-heatmap');
		Backbone.pubSub.on('single-place-change-to-heatmap', function(){
			self.change(null,1);
		});

		Backbone.pubSub.off('single-place-charts-change-channels');
		Backbone.pubSub.on('single-place-charts-change-channels', function(channels){
			window.settings.place.charts.channels = channels;
			if(window.settings.place.charts.channels.length > 0)
				window.settings.place.charts.heatmap.frequencyBy = 'channels';
		});
	},

	change: function(evt,index){
		var self = this;

		if(index === undefined)
			index = $('a[data-toggle="tab"]').index(evt.currentTarget);
		else 
			$('#charts-tabs li:eq('+index+') a').tab('show');

		window.settings.place.charts.tab = index;

		var isEmpty;
		switch (index) {
			case 0:
				window.location.hash = '#places/'+this.data.id+'/charts?type=occupation';
				isEmpty = this.$el.find('#occupation-tab').is(':empty');

				if(isEmpty)
					self.renderOccupation();
				else 
					window.settings.place.charts.occupation.view.updateDataByTab({
						channels: window.settings.place.charts.channels
					});
				break;
				
			case 1:
				window.location.hash = '#places/'+this.data.id+'/charts?type=heatmap';
				isEmpty = this.$el.find('#heatmap-tab').is(':empty');
				if(isEmpty)
					self.renderHeatmap();
				else
					window.settings.place.charts.heatmap.view.updateDataByTab({
						frequencyBy: window.settings.place.charts.heatmap.frequencyBy,
						channels: window.settings.place.charts.channels
					});

				break;
		}
	},

	fetchData: function(callback){
		if(!this.data.attributes.charts){
			var self = this;
			var data = new app.model.ChartsData({idPlace:this.data.id});
			data.fetch({
				success: function(){
					self.data.attributes.charts = data.attributes.data;
					callback();
				},
				error: function(model, xhr, options){
					if(xhr.responseJSON.message == "Access token has expired"){
						localStorage.removeItem('token');
						window.location.hash = '#';
					} else {
						self.errorView.render([xhr.responseText]);
					}
				}
			});

		} else
			callback();
	},

	renderOccupation: function(){
		var self = this;
		window.settings.place.charts.occupation.view = new app.view.OccupationView({
			waitingView: this.waitingView,
			errorView : this.errorView,
			data: this.data,
			channels: window.settings.place.charts.channels
		});

		this.$el.find('#occupation-tab').html(window.settings.place.charts.occupation.view.render().el);

		this.fetchData(function(){
			if(app.util.CkeckUrl('#places/'+self.data.id+'/charts?type=occupation'))
				window.settings.place.charts.occupation.view.renderComponents();
		});
	},

	renderHeatmap: function(){
		var self = this;
		window.settings.place.charts.heatmap.view = new app.view.HeatmapView({
			waitingView: this.waitingView,
			errorView : this.errorView,
			data: this.data,
			frequencyBy: window.settings.place.charts.heatmap.frequencyBy,
			channels: window.settings.place.charts.channels
		});

		this.$el.find('#heatmap-tab').html(window.settings.place.charts.heatmap.view.render().el);

		this.fetchData(function(){
			if(app.util.CkeckUrl('#places/'+self.data.id+'/charts?type=heatmap'))
				window.settings.place.charts.heatmap.view.renderComponents();
		});
	},

	render: function(){
		var template = Zebra.tmpl.charts;
		var html = template(this.data);
		this.$el.html(html);	

		return this;
	},

});