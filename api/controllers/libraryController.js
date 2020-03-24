'use strict';
//Modules
var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
//Utils
var errorHandler = require('../handlers/errorHandler.js');
//Model
var Movies = db.model('Movies');
//IMDB data
const imdb = require('../imdb');

//populate database
exports.populate = async(req, res) => {
  var moviesJSON;
  try {
    //to avoid doublons
    await Movies.deleteMany({actorID: req.params.id});
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
    errorHandler.error(res, err.message, "Probably wrong actor id.");
  }
};

// get all movies
exports.getMovies = function(req, res) {
    Movies.find({}).then(function(movies) {
      res.status(200).json(movies);
    }).catch(function(err) {
      errorHandler.error(res, err.message, "Failed to get movies");
    });
};

//get a random movie
exports.getMovie = async(req,res) => {
  try {
    const numMovies = await Movies.countDocuments({ metascore: { $gt: 70 }});;
    let index = Math.random() * Math.floor(numMovies);
    const randomMovie = await Movies.find({ metascore: { $gt: 70 }}).limit(1).skip(index);
    const { link, idMovie, metascore, poster, rating, synopsis, title, votes, year } = randomMovie[0];
    return res.status(200).json({
			link,
			idMovie,
			metascore,
			poster,
			rating,
			synopsis,
			title,
			votes,
			year
		});

  } catch(err) {
    errorHandler.error(res, err.message, "Not working");
  }
}

//get a movie by his id
exports.getMovieId = async(req, res) => {
  if(req.params.id === "search") {
    try {
      let limit = 5, metascore = 0;
      if(req.query.limit) {
        limit = Number(req.query.limit);
      }
      if(req.query.metascore) {
        metascore = Number(req.query.metascore);
      }
      const movies = await Movies.aggregate([{ $match: { metascore: { $gt: metascore } } }, { $sample: { size: limit } }, { $sort: { metascore: -1 } }])
      return res.status(200).json(movies);
    } catch(err) {
      errorHandler.error(res, err.message, "No movies found", 404);
    }
  } else {
    Movies.find({idMovie: req.params.id}).exec().then(function(movies) {
      if (movies === null) {
        throw new Error("Movie not found for value \"" + req.params.id + "\"");
      }
      res.status(200).json(movies);
    }).catch(function(err) {
      errorHandler.error(res, err.message, "Movie not found", 404);
    });    
  }
}

//edit a movie to add date and review
exports.editMovie = function(req, res) {
  Movies.findOneAndUpdate({idMovie: req.params.id}, req.body, {new: true}).exec().then(function(movies) {
    if (movies === null) {
      throw new Error("Movie not found for value \"" + req.params.id + "\"");
    }
    res.status(200).json(movies);
  }).catch(function(err) {
    errorHandler.error(res, err.message, "Movie not found", 404);
  });
}
