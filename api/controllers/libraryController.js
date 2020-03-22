'use strict';
//Modules
var mongoose         =   require('mongoose');
//Utils
var errorHandler     =   require('../handlers/errorHandler.js');
//Model
var Movie             =   db.model('Movie');

exports.getMovies = function(req, res) {
    Movie.find({}).then(function(movies) {
      res.status(200).json(movies);
    }).catch(function(err) {
      errorHandler.error(res, err.message, "Failed to get movies");
    });
};



