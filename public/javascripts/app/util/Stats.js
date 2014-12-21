var app = app || {};
app.util = app.util || {};

app.util.Stats = function(){};
app.util.Stats.prototype = {
	count: 0,
	product: null,
	operation: null,

	min: function(value){
		value = Number(value);
		this.product = this.product === null ? value : (this.product > value ? value : this.product);
		this.count += 1;
	},

	max: function(value){
		value = Number(value);
		this.product = this.product === null ? value : (this.product < value ? value : this.product);
		this.count += 1;
	},

	avg: function(value){
		value = Number(value);
		this.operation = 'avg';
		this.product = this.product === null ? value : this.product += value;
		this.count += 1;
	},

	getCount: function(){
		return this.count;
	},

	getResult: function(){
		if(this.operation == 'avg')
			return this.product / this.count;

		return this.product;
	},

	reset: function(){
		this.count = 0;
		this.product = null;
		this.operation = null;
	},
};