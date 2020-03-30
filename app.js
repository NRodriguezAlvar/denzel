'use strict';

//Modules for REST API
var express 	= 	require('express'),
	app 		= 	express(),
	mongoose 	= 	require('mongoose'),
    bodyParser 	= 	require('body-parser');

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
      
//Module for GRAPHQL
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const graphqlHTTP = require('express-graphql');
const { GraphQLSchema } = require('graphql');
const path = require("path")

//Models
var	Movie 		= 	require('./api rest/models/libraryModel');

global.config 	= 	require('./modules/config');
global.db 		= 	require('./modules/db');

mongoose.Promise = global.Promise;

var routes = require('./api rest/routes/libraryRoutes');
var { queryType } = require('./graphql/query');

//For REST API 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
routes(app);

//For GRAPHQL
var schema = new GraphQLSchema({ query: queryType });

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());
app.options('*', cors());
app.use("/graphql",graphqlHTTP({schema,graphiql:true}));


var port = 	process.env.PORT || config.PORT;

app.listen(port, () => {
    MongoClient.connect(config.URI, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        console.log("Connected to `" + config.DB + "`!");
    });
});