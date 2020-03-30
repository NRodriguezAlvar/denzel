const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLFloat, GraphQLList, GraphQLID } = require('graphql');
const { populateResolver, randomMovieResolver, specificMovieResolver, searchMovieResolver, postReviewResolver } = require('./resolvers.js');

const populateType = new GraphQLObjectType({
	name: 'populateType',
	fields: {
		total: { type: GraphQLInt },
		error: { type: GraphQLString }
	}
})

const movieType = new GraphQLObjectType({
	name: 'movieType',
	fields: {
		link: { type: GraphQLString },
		id: { type: GraphQLString },
		metascore: { type: GraphQLInt },
		poster: { type: GraphQLString },
		rating: { type: GraphQLFloat },
		synopsis: { type: GraphQLString },
		title: { type: GraphQLString },
		votes: { type: GraphQLFloat },
		year: { type: GraphQLInt },
		date: { type: GraphQLString },
		review: { type: GraphQLString },
		error: { type: GraphQLString }
	}
});

const movieSearchType = new GraphQLObjectType({
	name: "movieSearchType",
	fields: {
		movies: { type: new GraphQLList(movieType) },
		error: { type: GraphQLString }
	}
});

const movieIdType = new GraphQLObjectType({
	name: "movieIdType",
	fields: {
		_id: { type: GraphQLID },
		error: { type: GraphQLString }
	}
});

const queryType = new GraphQLObjectType({
	name: 'Query',
	fields: {
		populate: {
			type: populateType,
			args: {
				id: { type: GraphQLString }
			},
			resolve: populateResolver
		},
		randomMovie: {
			type: movieType,
			resolve: randomMovieResolver
		},
		specificMovie: {
			type: movieType,
			args: {
				id: { type: GraphQLString }
			},
			resolve: specificMovieResolver
		},
		searchMovie: {
			type: movieSearchType,
			args: {
				limit: { type: GraphQLInt, defaultValue: 5 },
				metascore: { type: GraphQLInt, defaultValue: 0 }
			},
			resolve: searchMovieResolver
		},
		postReview: {
			type: movieIdType,
			args: {
				id: { type: GraphQLString },
				date: { type: GraphQLString, defaultValue: null },
				review: { type: GraphQLString, defaultValue: null }
			},
			resolve: postReviewResolver
		}
	}
});

module.exports = {
	queryType
}
