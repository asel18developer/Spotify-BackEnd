'use strict'

var fs = require("fs");
var path = require("path");
var moongosePaginate = require("mongoose-pagination");

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

var extensions = ["jpg", "png", "jpeg"];

function getAlbum(req, res){

}

function saveAlbum(req, res){

  console.log("POST: /api/album");

  var album = new Album();
  var data = req.body;

  album.title = data.title;
  album.description = data.description;
  album.year = data.year;
  album.image = 'null';
  album.artist = data.artist;

  album.save((err, albumStored) =>{

    if (err) {

      res.status(500).send({
        message: 'Error en la petición'
      });

    } else {

      if (!albumStored) {

        res.status(404).send({
          message: 'No se ha guardado el album'
        });

      } else {

        res.status(200).send({
          message: 'Album guardado correctamente',
          albumStored
        });

      }

    }

  });

}

module.exports = {
  getAlbum,
  saveAlbum
};
