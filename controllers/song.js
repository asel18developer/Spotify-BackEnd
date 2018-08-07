'use strict'

var fs = require("fs");
var path = require("path");
var moongosePaginate = require("mongoose-pagination");

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

var extensions = ["jpg", "png", "jpeg"];

function getSong(req, res){

  res.status(200).send({
    message: 'Petición recibida correctamente.'
  });

}

function saveSong(req, res){

  console.log("Post: /api/song");

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

      console.error("Error in call to Post: /api/song" + JSON.stringify(err));

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
  saveSong
};
