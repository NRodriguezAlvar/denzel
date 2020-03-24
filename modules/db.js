'use strict';

//Modules
var mongoose = 	require('mongoose');

var db = mongoose.createConnection(config.URI, { useNewUrlParser: true, useUnifiedTopology: true });

db.on('error', function(err) {
	if (err) {
		throw err;
	}
});

db.once('open', function() {
	console.info('Successfully connected to Mongo ' + config.DB + ' database');
});

module.exports = db;