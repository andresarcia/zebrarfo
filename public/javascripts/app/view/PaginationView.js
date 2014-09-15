var com = com || {};
com.spantons = com.spantons || {};
com.spantons.view = com.spantons.view || {};

com.spantons.view.PaginationView = Backbone.View.extend({

	el: '.pagination',
	numberOfPages: null,
	currentPage: 1,
	mainView: null,

	events: {
		'click .pagination-item' : 'calculatePagination'
	},
	
	initialize: function(options){
		this.numberOfPages = options.numberOfPages;
		this.mainView = options.mainView;
		if(options.currentPage)
			this.currentPage = options.currentPage;

		this.render();
	},

	calculatePagination: function(evt){
		var currentContainer = this.$el.find('.active');
		var currentIndex = Number(currentContainer.children().text());

		if($(evt.currentTarget).hasClass('prev')){
			if(currentIndex <= 1)
				return;

			this.mainView.fetchData(currentIndex - 1);
			currentContainer.removeClass('active');
			this.$el.children().eq(currentIndex - 1).addClass('active');

		} else if($(evt.currentTarget).hasClass('next')){
			if(currentIndex >= this.numberOfPages)
				return;

			this.mainView.fetchData(currentIndex + 1);
			currentContainer.removeClass('active');
			this.$el.children().eq(currentIndex + 1).addClass('active');

		} else {
			this.mainView.fetchData(Number($(evt.currentTarget).text()));
			currentContainer.removeClass('active');
			this.$el.children().eq($(evt.currentTarget).text()).addClass('active');
		}
	},

	render: function(){
		this.$el.append('<li><a href="javascript:;" class="pagination-item prev">&laquo;</a></li>');
		for (var i = 1; i < this.numberOfPages + 1; i++) 
			this.$el.append('<li><a href="javascript:;" class="pagination-item">'+i+'</a></li>');

		this.$el.append('<li><a href="javascript:;" class="pagination-item next">&raquo;</a></li>');
				
		this.$el.children().eq(this.currentPage).addClass('active');

		return this;
	},

	
});