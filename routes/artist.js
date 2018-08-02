'use strict'

console.log("Cargando rutas artistas.")

var express = require('express');
var ArtistController = require('../controllers/artist');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

//var multipart = require('connect-multiparty');
//var md_upload = multipart({uploadDir:'./uploads/artists'});

api.get('/artist', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);

console.log("Rutas de artista cargadas.")
module.exports = api;
