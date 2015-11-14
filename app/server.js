var express  = require('express');
var app      = express();
var port  	 = process.env.PORT || 8084;

function start() {
	var server = app.listen(port);
	console.log("App listening on port " + port);	
}

require('./serialReader.js');


exports.start = start;
exports.app = app;
