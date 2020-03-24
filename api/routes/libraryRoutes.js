'use strict';

module.exports = function(app) {
  var library = require('../controllers/libraryController');

  app.route('/movies/populate/:id')
    .get(library.populate)
  app.route('/movies')
    .get(library.getMovie)
  app.route('/movies/all')
    .get(library.getMovies)
  app.route('/movies/:id')
    .get(library.getMovieId)
    .post(library.editMovie)
};