var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.OccupationView = Backbone.View.extend({

	template: Handlebars.compile($("#occupation-template").html()),

	initialize: function(options){
		var self = this;
		this.errorView = options.errorView;
		this.errorView.closeView();
		this.waitingView = options.waitingView;
	},

	renderChart: function(data){
		this.waitingView.closeView();

		console.log(data);


		var ctx = this.$el.find('#chart_canvas_occupation').get(0).getContext("2d");
		var data1 = {
    		labels: [4,3,4],
    		datasets: [
		        {
		            label: "My First dataset",
		            fillColor: "rgba(220,220,220,0.2)",
		            strokeColor: "rgba(220,220,220,1)",
		            pointColor: "rgba(220,220,220,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(220,220,220,1)",
		            data: [5,10,20]
		        },
		    ]
		};
		var myLineChart = new Chart(ctx).Line(data1);
	},

	render: function(){
		var html = this.template();
    	this.$el.html(html);	

		return this;
	},

});