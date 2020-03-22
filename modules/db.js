'use strict';

//Modules
var mongoose = 	require('mongoose');

var db = mongoose.createConnection(config.URI);

db.on('error', function(err) {
	if (err) {
		throw err;
	}
});

module.exports = db;