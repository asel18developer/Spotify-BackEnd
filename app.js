'use strict'

const API_ROUTE = '/api'

var express = require("express");
var bodyParser = require("body-parser");

var app = express();

// cargar rutas
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// configurar cabeceras http

//rutas base
app.use(API_ROUTE, user_routes);
app.use(API_ROUTE, artist_routes);
app.use(API_ROUTE, album_routes);

module.exports = app;
