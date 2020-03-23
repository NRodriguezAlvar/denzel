'use strict';
//Modules
var mongoose = require('mongoose');
//Utils
var errorHandler = require('../handlers/errorHandler.js');
//Model
var Movies = db.model('Movies');
//IMDB data
const imdb = require('../imdb');

exports.populate = async(req, res) => {
  var moviesJSON;
  try {
    await Movies.deleteMany({});
    console.log(`Fetching filmography of ${req.params.id}...`);
    moviesJSON = await imdb(req.params.id);
    for(let i = 0; i < moviesJSON.length; i++) {
        const newMovie = new Movies ({
          actorID: req.params.id,
          idMovie: moviesJSON[i].id,
          link: moviesJSON[i].link,
          metascore: moviesJSON[i].metascore,
          poster: moviesJSON[i].poster,
          rating: moviesJSON[i].rating,
          synopsis: moviesJSON[i].synopsis,
          title: moviesJSON[i].title,
          votes: moviesJSON[i].votes,
          year: moviesJSON[i].year
        });
        await newMovie.save();
    }
    const numMovies = await Movies.estimatedDocumentCount();
    return res.status(200).json({ total: numMovies });
  } catch (err) {
		return res.status(404).send('Probably wrong actor id.');
  }

  
};

exports.getMovies = function(req, res) {
    Movies.find({}).then(function(movies) {
      res.status(200).json(movies);
    }).catch(function(err) {
      errorHandler.error(res, err.message, "Failed to get movies");
    });
};

