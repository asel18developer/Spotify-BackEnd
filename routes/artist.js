'use strict'

console.log("Cargando rutas artistas.")

var express = require('express');
var ArtistController = require('../controllers/artist');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);

console.log("Rutas de artista cargadas.")
module.exports = api;
