'use strict';

var HOST = 'localhost',
	PORT = 9292,
	DB	 = 'denzelMovies',
	URI  = 'mongodb+srv://userRW:admin@denzel-cluster-fvdyr.mongodb.net/'+DB+'?retryWrites=true&w=majority';
    ;

module.exports = {
	HOST: HOST,
	PORT: PORT,
	DB: DB,
	URI: URI
}