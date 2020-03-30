var mongoose = require('mongoose');
var Movies = db.model('Movies');
const imdb = require('../api rest/imdb.js');

const populateResolver = async (_, args) => {
	const { id } = args;
	try {
		await Movies.deleteMany({actorID: id});
		moviesJSON = await imdb(id);
		for(let i = 0; i < moviesJSON.length; i++) {
			const newMovie = new Movies ({
			actorID:id,
			id: moviesJSON[i].id,
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
		const numMovies = await Movies.countDocuments({ actorID: id }, (err, count) => {
			return count;
		});
		return { total: numMovies };
	}
	catch (err) {
		return { error: err.message };
	}
};

const randomMovieResolver = async () => {
	try {
		const numMovies = await Movies.countDocuments({ metascore: { $gt: 70 }});;
    	let index = Math.random() * Math.floor(numMovies);
		const randomMovie = await Movies.find({ metascore: { $gt: 70 }}).limit(1).skip(index);
		const { link, id, metascore, poster, rating, synopsis, title, votes, year } = randomMovie[0];
		return ({
			link,
			id,
			metascore,
			poster,
			rating,
			synopsis,
			title,
			votes,
			year
		});
	}
	catch (err) {
		return { error: err.message };
	}
};

const specificMovieResolver = async (_, args) => {
	const { id } = args;
	try {
		const movies = await Movies.find({ id });

		if (movies.length === 0)
			throw new Error('No movie found.');
		else {
			const response = {
				link: movies[0].link,
				id: movies[0].id,
				metascore: movies[0].metascore,
				poster: movies[0].poster,
				rating: movies[0].rating,
				synopsis: movies[0].synopsis,
				title: movies[0].title,
				votes: movies[0].votes,
				year: movies[0].year
			};
			if (movies[0].date)
				response.date = movies[0].date;
			if (movies[0].review)
				response.review = movies[0].review;
			return response;
		}
	}
	catch (err) {
		return { error: err.message };
	}
};

const searchMovieResolver = async (_, args) => {
	try {
		const limit = parseInt(args.limit);
		const metascore = parseInt(args.metascore);

		const movies = await Movies.aggregate([{ $match: { metascore: { $gt: metascore } } }, { $sample: { size: limit } }, { $sort: { metascore: -1 } }]);

		if (movies.length === 0)
			throw new Error('No movie found.');
		else {
			for (movie of movies) {
				delete movie._id;
				delete movie.actorID;
				delete movie.createdAt;
				delete movie.updatedAt;
				delete movie.__v;
			}
			return { movies };
		}
	}
	catch (err) {
		return { error: err.message };
	}
};

const postReviewResolver = async (_, args) => {
	const { id, date, review } = args;
	try {
		const movie = await Movies.findOne({ id });

		if (movie.length === 0)
			throw new Error('No movie found.');
		else {
			await Movies.updateOne({ _id: movie._id }, { date, review });
			return { _id: movie._id };
		}
	}
	catch (err) {
		return { error: err.message };
	}
};

module.exports = {
	populateResolver,
	randomMovieResolver,
	specificMovieResolver,
	searchMovieResolver,
	postReviewResolver
}
