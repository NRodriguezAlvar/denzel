'use strict';

//Modules
var express 	= 	require('express'),
	app 		= 	express(),
	mongoose 	= 	require('mongoose'),
    bodyParser 	= 	require('body-parser');

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
      
//Models
var	Movie 		= 	require('./api rest/models/libraryModel');

global.config 	= 	require('./modules/config');
global.db 		= 	require('./modules/db');

mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var routes = require('./api rest/routes/libraryRoutes');
routes(app);

var port = 	process.env.PORT || config.PORT;

app.listen(port, () => {
    MongoClient.connect(config.URI, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        console.log("Connected to `" + config.DB + "`!");
    });
});