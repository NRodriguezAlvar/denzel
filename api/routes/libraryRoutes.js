'use strict';

module.exports = function(app) {
  var library = require('../controllers/libraryController');

  app.route('/api/movies/populate/:id')
    .get(library.populate)
  app.route('/api/movies')
    .get(library.getMovies)
  
};