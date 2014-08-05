var parserTxt = require('./utils/parser');

exports.create = function(req, res){
	var place = req.body;
	
	if(place.json){
		console.log('asdas');
	}
   	
   	// response.send(place);

	// console.log(req.body);

	// if (req.body.zone && req.files.data && req.files.data.length > 0) {
		
	// 	parse.toJSON(req.body.zone,req.files.data, function(data){

	// 		fs.writeFile('public/my.json', JSON.stringify(data, null, 4), function(err) {
	// 		    if(err) 
	// 		      	console.log(err);
	// 		    else 
	// 		      	res.redirect('/');
	// 		});

	// 	});
	// }
	// else {
	// 	// call errorHanldler
	// 	console.log('Error occured incomplete data');
	// 	res.send('ERROR');
	// }	

};
