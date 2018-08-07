'use strict'

var fs = require("fs");
var path = require("path");
var moongosePaginate = require("mongoose-pagination");

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

var extensions = ["jpg", "png", "jpeg"];

function getSong(req, res){

  console.log("GET: /api/song");

  var songID = req.params.id;

  Song.findById(songID).populate({path: 'album'}).exec(function (err, song){

    if (err) {

      console.error("Error in call to GET /api/song" + JSON.stringify(err));

      res.status(500).send({
        message: 'Error al realizar la petición en el servidor'
      });

    } else {

      if (!song) {

        res.status(404).send({
          message: 'No existe esa canción'
        });

      } else {

        res.status(200).send({
          message: 'Canción encontrada.',
          song
        });

      }
    }

  });

}

function getSongs(req, res){

  console.log("GET: /api/songs");

  var albumID = req.params.album;

  if (!albumID) {
    var find = Song.find({}).sort('number');
  } else {
    var find = Song.find({album: albumID}).sort('number');
  }

  find.populate({
    path: 'album',
    populate: {
      path: 'artist',
      model: 'Artist'
    }
  }).exec(function (err, songs){

    if (err) {

      console.error("Error in call to GET /api/songs" + JSON.stringify(err));

      res.status(500).send({
        message: 'Error al realizar la petición en el servidor'
      });

    } else {

      if (!songs) {

        res.status(404).send({
          message: 'No existen canciones'
        });

      } else {

        res.status(200).send({
          message: 'Canciones obtenidas correctamente.',
          songs
        });

      }
    }

  });

}

function saveSong(req, res){

  console.log("POST: /api/song");

  var song = new Song();
  var data = req.body;
  //console.log("Data: " + JSON.stringify(data));

  song.number = data.number;
  song.name = data.name;
  song.duration = data.duration;
  song.album = data.album;
  song.file = 'null';

  song.save((err, songStored) => {

    if (err) {

      console.error("Error in call to POST /api/song" + JSON.stringify(err));

      res.status(500).send({
        message: 'Error al realizar la petición en el servidor'
      });

    } else {

      if (!songStored) {

        res.status(404).send({
          message: 'La canción no se ha podido guardar'
        });

      } else {

        res.status(200).send({
          message: 'Canción guardado correctamente.',
          song: songStored
        });

      }
    }

  });

}

module.exports = {
  getSong,
  getSongs,
  saveSong
};
