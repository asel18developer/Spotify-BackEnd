'use strict'

var fs = require("fs");
var path = require("path");
var moongosePaginate = require("mongoose-pagination");

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');



function getArtist(req, res){

  console.log("GET: /api/artist/:id");

  var artistID = req.params.id;

  Artist.findById(artistID, (err, artist) => {

    if (err) {

      res.status(500).send({
        message: 'Error en la petición'
      });

    } else {
      if (!artist) {

        res.status(404).send({
          message: 'Artista no encontrado'
        });

      } else {

        res.status(200).send({
          message: 'Artista encontrado',
          artist
        });

      }
    }

  });


}

function getArtists(req, res){

  console.log("GET: /api/artists/:page");

  if (req.params.page) {
    var page = req.params.page;
  } else {
    var page = 1;
  }

  var itemsPerPage = 3;

  Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total) => {

    if (err) {

      res.status(500).send({
        message: 'Error en la petición'
      });

    } else {
      if (!artists) {

        res.status(404).send({
          message: 'No se han encontrado artistas.'
        });

      } else {

        return res.status(200).send({
          message: 'Artistas encontrados',
          total_artists: total,
          artists: artists
        });

      }
    }

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

}

function updateArtist(req, res){

  console.log("PUT: /api/artist");

  var artistID = req.params.id;
  var update = req.body;

  Artist.findByIdAndUpdate(artistID, update, (err, artistUpdated) => {

    if (err) {

      res.status(500).send({
        message: 'Error al actualizar el artista.'
      });

    } else {

      if (!artistUpdated) {

        res.status(404).send({
          message: 'El artista no ha sido actualizado.'
        });

      } else {

        res.status(200).send({
          message: 'Artista actualizado.',
          artistUpdated
        });

      }

    }

  });

}
module.exports = {
  getArtist,
  getArtists,
  saveArtist,
  updateArtist

};
