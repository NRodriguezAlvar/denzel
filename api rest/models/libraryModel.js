'use strict';

//Modules
var mongoose  = require('mongoose');
//Schema
var Schema    = mongoose.Schema;
var movieSchema = new Schema({
    actorID: {
		type: String,
		required: true
	},
	link: {
		type: String
	},
	idMovie: {
		type: String
	},
	metascore: {
		type: Number
	},
	poster: {
		type: String
	},
	rating: {
		type: Number
	},
	synopsis: {
		type: String
	},
	title: {
		type: String
	},
	votes: {
		type: Number
	},
	year: {
		type: Number
	},
	date: {
		type: String
	},
	review: {
		type: String
	}
}, { versionKey: false });

module.exports = mongoose.model('Movies', movieSchema);