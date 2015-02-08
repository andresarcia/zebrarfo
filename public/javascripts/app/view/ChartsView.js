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
		this.id = 'placeChart';
		this.errorView = options.errorView;
		this.errorView.closeView();
		this.waitingView = options.waitingView;
		this.data = options.data;

		if(!window.appRouter.currentData.innerData.charts){
			window.appRouter.currentData.innerData.charts = {};
			window.appRouter.currentData.innerData.charts.occupation = {};
			window.appRouter.currentData.innerData.charts.heatmap = {};
		}

		this.render();
		this.waitingView.closeView();

		if(window.appRouter.currentData.innerData.charts.tab)
			this.change(null,window.appRouter.currentData.innerData.charts.tab);
		else if(options.type !== undefined)
			this.change(null,options.type);
		else
			this.change(null,0);

		Backbone.pubSub.on('single-place-change-to-heatmap', function(){
			self.change(null,1);
		});

		Backbone.pubSub.on('single-place-charts-change-channels', function(channels){
			window.appRouter.currentData.innerData.charts.channels = channels;
			if(window.appRouter.currentData.innerData.charts.channels.length > 0)
				window.appRouter.currentData.innerData.charts.heatmap.frequencyBy = 'channels';
		});

	},

	change: function(evt,index){
		var self = this;

		if(index === undefined)
			index = $('a[data-toggle="tab"]').index(evt.currentTarget);
		else 
			$('#charts-tabs li:eq('+index+') a').tab('show');

		window.appRouter.currentData.innerData.charts.tab = index;

		var isEmpty;
		switch (index) {
			case 0:
				window.location.hash = '#places/'+this.data.id+'/charts?type=occupation';
				isEmpty = this.$el.find('#occupation-tab').is(':empty');
				if(isEmpty)
					self.renderOccupation();
				else
					window.appRouter.currentData.innerData.charts.occupation.view.updateDataByTab({
						channels: window.appRouter.currentData.innerData.charts.channels
					});

				break;
			case 1:
				window.location.hash = '#places/'+this.data.id+'/charts?type=heatmap';
				isEmpty = this.$el.find('#heatmap-tab').is(':empty');
				if(isEmpty)
					self.renderHeatmap();
				else
					window.appRouter.currentData.innerData.charts.heatmap.view.updateDataByTab({
						frequencyBy: window.appRouter.currentData.innerData.charts.heatmap.frequencyBy,
						channels: window.appRouter.currentData.innerData.charts.channels
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
		     		self.errorView.render([xhr.responseText]);
		    	}
			});

		} else
			callback();
	},

	renderOccupation: function(){
		var self = this;
		window.appRouter.currentData.innerData.charts.occupation.view = new app.view.OccupationView({
			waitingView: this.waitingView,
			errorView : this.errorView,
			data: this.data,
			channels: window.appRouter.currentData.innerData.charts.channels
		});

		this.$el.find('#occupation-tab').html(window.appRouter.currentData.innerData.charts.occupation.view.render().el);

		this.fetchData(function(){
			if(app.util.CkeckUrl('#places/'+self.data.id+'/charts?type=occupation'))
				window.appRouter.currentData.innerData.charts.occupation.view.renderComponents();
		});
	},

	renderHeatmap: function(){
		var self = this;
		window.appRouter.currentData.innerData.charts.heatmap.view = new app.view.HeatmapView({
			waitingView: this.waitingView,
			errorView : this.errorView,
			data: this.data,
			frequencyBy: window.appRouter.currentData.innerData.charts.heatmap.frequencyBy,
			channels: window.appRouter.currentData.innerData.charts.channels
		});

		this.$el.find('#heatmap-tab').html(window.appRouter.currentData.innerData.charts.heatmap.view.render().el);

		this.fetchData(function(){
			if(app.util.CkeckUrl('#places/'+self.data.id+'/charts?type=heatmap'))
				window.appRouter.currentData.innerData.charts.heatmap.view.renderComponents();
		});
	},

	render: function(){
		var template = Zebra.tmpl['charts'];
		var html = template(this.data);
		this.$el.html(html);	

		return this;
	},

});