var app = app || {};
app.view = app.view || {};

app.view.PaginationView = Backbone.View.extend({

	el: '.pagination',
	numberOfPages: null,
	currentPage: 1,
	maxOfPages: 5,
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
		
		if($(evt.currentTarget).hasClass('disabled'))
			return;

		if($(evt.currentTarget).hasClass('prev')){
			if(this.currentPage <= 1)
				return;

			this.mainView.fetchData(this.currentPage - 1);
			currentContainer.removeClass('active');
			this.currentPage = this.currentPage - 1;
			this.render();

		} else if($(evt.currentTarget).hasClass('next')){
			if(this.currentPage >= this.numberOfPages)
				return;

			this.mainView.fetchData(this.currentPage + 1);
			currentContainer.removeClass('active');
			this.currentPage = this.currentPage + 1;
			this.render();

		} else {
			currentContainer.removeClass('active');
			this.mainView.fetchData(Number($(evt.currentTarget).text()));
			this.currentPage = Number($(evt.currentTarget).text());
			this.render();
		}
		
		$('html, body').stop().animate({  
			scrollTop: $('#z-body').offset().top  
		}, 600);
	},

	render: function(){
		this.$el.html('');
		this.$el.append('<li><a href="javascript:;" class="pagination-item prev">←</a></li>');
		var i;
		
		if(this.numberOfPages > 7){
			if(this.currentPage < this.maxOfPages){
				for (i = 1; i < this.maxOfPages + 1; i++)
					this.$el.append('<li><a href="javascript:;" class="pagination-item">'+i+'</a></li>');
			
				this.$el.append('<li class="disabled"><a href="javascript:;" class="pagination-item disabled">...</a></li>');
				this.$el.append('<li><a href="javascript:;" class="pagination-item">'+this.numberOfPages+'</a></li>');
			
			} else if (this.currentPage >= this.numberOfPages - this.maxOfPages + 1){
				this.$el.append('<li><a href="javascript:;" class="pagination-item">1</a></li>');
				this.$el.append('<li class="disabled"><a href="javascript:;" class="pagination-item disabled">...</a></li>');
				for (i = this.numberOfPages - this.maxOfPages + 1; i < this.numberOfPages + 1; i++)
					this.$el.append('<li><a href="javascript:;" class="pagination-item">'+i+'</a></li>');
					
			} else {
				this.$el.append('<li><a href="javascript:;" class="pagination-item">1</a></li>');
				this.$el.append('<li class="disabled"><a href="javascript:;" class="pagination-item disabled">...</a></li>');
				this.$el.append('<li><a href="javascript:;" class="pagination-item">'+(this.currentPage - 1)+'</a></li>');
				this.$el.append('<li><a href="javascript:;" class="pagination-item">'+this.currentPage+'</a></li>');
				this.$el.append('<li><a href="javascript:;" class="pagination-item">'+(this.currentPage + 1) +'</a></li>');
				this.$el.append('<li class="disabled"><a href="javascript:;" class="pagination-item disabled">...</a></li>');
				this.$el.append('<li><a href="javascript:;" class="pagination-item">'+this.numberOfPages+'</a></li>');
			}

		} else {
			for (i = 1; i < this.numberOfPages + 1; i++) 
				this.$el.append('<li><a href="javascript:;" class="pagination-item">'+i+'</a></li>');
		}

		this.$el.append('<li><a href="javascript:;" class="pagination-item next">→</a></li>');
		this.$el.children().find('a:contains('+this.currentPage+')').first().parent().addClass('active');
		
		return this;
	},

	
});