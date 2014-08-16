var mongoose = require('mongoose');
var Place = mongoose.model('Place');

exports.create = function(req, res){

	Place.findOrCreate({
		name: req.body.name,
		userId: req.body.userId
	}, 
	function(err, place, created) {
		if (err)
			res.send(err);

		console.log(created);
		console.log(place);

		res.json({ message : 'Nice place!' });
  	});

};


exports.list = function(req,res){

	var userId = '53d6948c4f231a5934ac71b3';

	Place.find({userId: userId},function (err, docs) {
		if(err)
			res.send(err);
				
		res.send(docs);
	});
};