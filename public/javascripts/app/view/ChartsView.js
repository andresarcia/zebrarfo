var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.ChartsView = Backbone.View.extend({

	el: '#ws-containter',
	template: Handlebars.compile($("#charts-template").html()),
	currentData: null,
	currentChart: null,

	events: {
		'click a[data-toggle="tab"]': 'changeChart'
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

		if(window.appRouter.currentData.innerData.charts.tab)
			this.changeChart(null,window.appRouter.currentData.innerData.charts.tab);
		else if(options.type !== undefined)
			this.changeChart(null,options.type);
		else
			this.changeChart(null,0);

		Backbone.pubSub.on('single-place-change-to-heatmap', function(){
			self.changeChart(null,1);
		});

		Backbone.pubSub.on('single-place-charts-change-channels', function(channels){
			window.appRouter.currentData.innerData.charts.channels = channels;
			if(window.appRouter.currentData.innerData.charts.channels.length > 0)
				window.appRouter.currentData.innerData.charts.heatmap.frequencyBy = 'channels';
		});

	},

	changeChart: function(evt,index){
		var self = this;

		if(index === undefined)
			index = $('a[data-toggle="tab"]').index(evt.currentTarget);
		else 
			$('#charts-tabs li:eq('+index+') a').tab('show');

		window.appRouter.currentData.innerData.charts.tab = index;

		var isEmpty;
		switch (index) {
    		case 0:
    			this.changeUrl('occupation');
    			isEmpty = this.$el.find('#occupation-tab').is(':empty');
    			if(isEmpty)
    				self.renderOccupation();
    			else
    				window.appRouter.currentData.innerData.charts.occupation.view.updateDataByTab({
    					channels: window.appRouter.currentData.innerData.charts.channels
    				});

    			break;
    		case 1:
    			this.changeUrl('heatmap');
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

	changeUrl: function(url){
		var type = com.spantons.util.GetURLParameter('type');
		if(type != url)
			window.location.hash = '#places/'+this.data.id+'/charts?type='+url;
	},

	renderOccupation: function(){
		if(window.appRouter.currentData.innerData.charts.occupation.data) {
			window.appRouter.currentData.innerData.charts.occupation.view = new com.spantons.view.OccupationView({
				waitingView: this.waitingView,
				errorView : this.errorView,
				place: this.data,
				data: window.appRouter.currentData.innerData.charts.occupation.data,
				channels: window.appRouter.currentData.innerData.charts.channels
			});
			this.$el.find('#occupation-tab').html(window.appRouter.currentData.innerData.charts.occupation.view.render().el);
			window.appRouter.currentData.innerData.charts.occupation.view.renderComponents();
			
		} else {
			var self = this;
			this.waitingView.render();

			this.currentData = new com.spantons.model.Occupation({idPlace:this.data.id});
			this.currentData.fetch({
				success: function(e){                      
					window.appRouter.currentData.innerData.charts.occupation.view = new com.spantons.view.OccupationView({
						waitingView: self.waitingView,
						errorView : self.errorView,
						place: self.data,
						data: self.currentData,
						channels: window.appRouter.currentData.innerData.charts.channels
					});
					window.appRouter.currentData.innerData.charts.occupation.data = self.currentData;
					self.$el.find('#occupation-tab').html(window.appRouter.currentData.innerData.charts.occupation.view.render().el);
					window.appRouter.currentData.innerData.charts.occupation.view.renderComponents();
			    },
			    error: function(e){  
			     	self.waitingView.closeView();
			     	self.errorView.render(['Occurred an error retrieving the coordinates']);
			    }
			});
		}
	},

	renderHeatmap: function(){
		if(window.appRouter.currentData.innerData.charts.heatmap.data) {
			window.appRouter.currentData.innerData.charts.heatmap.view = new com.spantons.view.HeatmapView({
				waitingView: this.waitingView,
				errorView : this.errorView,
				place: this.data,
				data: window.appRouter.currentData.innerData.charts.heatmap.data,
				frequencyBy: window.appRouter.currentData.innerData.charts.heatmap.frequencyBy,
				channels: window.appRouter.currentData.innerData.charts.channels
			});
			this.$el.find('#heatmap-tab').html(window.appRouter.currentData.innerData.charts.heatmap.view.render().el);
			window.appRouter.currentData.innerData.charts.heatmap.view.renderComponents();

		} else {
			var self = this;
			this.waitingView.render();
			
			this.currentData = new com.spantons.model.Heatmap({idPlace:this.data.id});
			this.currentData.fetch({
				success: function(e){       
					window.appRouter.currentData.innerData.charts.heatmap.view = new com.spantons.view.HeatmapView({
						waitingView: self.waitingView,
						errorView : self.errorView,
						place: self.data,
						data: self.currentData,
						frequencyBy: window.appRouter.currentData.innerData.charts.heatmap.frequencyBy,
						channels: window.appRouter.currentData.innerData.charts.channels
					});               
					window.appRouter.currentData.innerData.charts.heatmap.data = self.currentData;
					
					self.$el.find('#heatmap-tab').html(window.appRouter.currentData.innerData.charts.heatmap.view.render().el);
					window.appRouter.currentData.innerData.charts.heatmap.view.renderComponents();
			    },
			    error: function(e){  
			     	self.waitingView.closeView();
			     	self.errorView.render(['Occurred an error retrieving the coordinates']);
			    }
			});
		}
	},

	render: function(){
		var html = this.template(this.data);
    	this.$el.html(html);	

		return this;
	},

});