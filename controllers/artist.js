'use strict'

var fs = require("fs");
var path = require("path");

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');



function getArtist(req, res){

  console.log("GET: /api/artist");

  res.status(200).send({
    message: 'Probabando una acción del controlador de artistas api rest con node y mongodb'
  });

}

function saveArtist(req, res){

  console.log("Post: /api/artist");

  var artist = new Artist();

  var data = req.body;

  artist.name = data.name;
  artist.description = data.description;
  artist.image = 'null';

  // Funciones flecha en el fichero controllers/user.js se usa una función
  // tradiciona. Esto se hace para tener ambos ejemplos
  artist.save((err, artistStored) => {

    if (err) {

      res.status(500).send({
        message: 'Error al guardar el artista.'
      });

    } else {

      if (!artistStored) {

        res.status(404).send({
          message: 'El artista no ha sido guardado.'
        });

      } else {

        res.status(200).send({
          message: 'Artista guardado correctamente.',
          artist: artistStored
        });

      }
    }

  });

  res.status(200).send({
    message: 'Probabando una acción del controlador de artistas api rest con node y mongodb'
  });

}

module.exports = {
  getArtist,
  saveArtist
};
