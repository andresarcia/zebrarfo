var mongoose = require('mongoose');
var Place = mongoose.model('Place');
var sanitize = require('validator').sanitize;
var async = require('async');

exports.list = function(req,res){

	var userId = '53d6948c4f231a5934ac71b3';

	Place.find({userId: userId})
	.select('name numberCoordinates potencyMin potencyMax potencyAvg avgPotencySD sdPotencyAvg')
	.exec(function(err, docs){
		if(err)
			res.status(500).send({ error: err });

		res.send(docs);
	});
};

exports.get = function(req,res){
	if(req.params.id){
		var id = sanitize(req.params.id).xss();
		id = sanitize(id).entityDecode();

		Place.findOne({_id: id}, function (err, doc) {
			if(err)
				res.status(500).send({ error: err });
				
			res.send(doc);
		});
	}
};