'use strict'

var fs = require("fs");
var path = require("path");
var moongosePaginate = require("mongoose-pagination");

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

var extensions = ["mp3", "ogg"];

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

function updateSong(req, res){

  console.log("PUT: /api/song");

  var songID = req.params.id;
  var data = req.body;

  Song.findByIdAndUpdate(songID, data, function(err, songUpdated){

    if (err) {

      res.status(500).send({
        type: 'Error',
        message: 'Error en la petición',
        data: data
      });

    } else {

      if (!songUpdated) {
        res.status(404).send({
          type: 'Error',
          message: 'No existe la canción.',
          data: data
        });
      } else {

        res.status(200).send({
          type: 'Succesfull',
          message: 'Canción actualizada.',
          song: songUpdated,
        });

      }

    }
  });

}

function deleteSong(req, res){

  console.log("DELETE: /api/song");
  var songID = req.params.id;

  Song.findByIdAndRemove(songID, function(err, songRemoved){

    if (err) {

      res.status(500).send({
        message: 'Error en la petición.'
      });

    } else {

      if (!songRemoved) {

        res.status(404).send({
          message: 'La canción no existe.'
        });

      } else {

        res.status(200).send({
          message: 'La canción ha sido borrada.',
          songRemoved
        });

      }

    }

  });

}

function uploadFile(req, res){

  console.log("POST: /api/upload-file-song/:id");

  var songID = req.params.id;
  var file_name = "No subido";

  if (req.files) {

    var file_path = req.files.fileSong.path;
    var file_split = file_path.split("\/");
    var file_name = file_split[2];

    var ext_split = file_name.split("\.");
    var file_ext = ext_split[1];

    if (extensions.indexOf(file_ext) > -1){

      Song.findByIdAndUpdate(songID, {file: file_name}, function(err, songUpdated){

              if (err) {

                res.status(500).send({
                  type: 'Error',
                  message: 'Error en la petición.',
                  file_path: file_path,
                  file_name: file_name,
                  file_ext: file_ext
                });

              } else {

                if (!songUpdated) {
                  res.status(404).send({
                    type: 'Forbbiden',
                    message: 'No existe la canción.',
                    file_path: file_path,
                    file_name: file_name,
                    file_ext: file_ext
                  });
                } else {

                  res.status(200).send({
                    type: 'Succesfull',
                    message: 'El fichero se ha subido correctamente.',
                    file_path: file_path,
                    file_name: file_name,
                    file_ext: file_ext
                  });

                }

              }
      });



    }else{

      res.status(500).send({

        type: 'Error',
        message: 'Extensión del fichero invalida',
        file_path: file_path,
        file_name: file_name,
        file_ext: file_ext
      });

    }

  } else {
    res.status(404).send({
      type: 'Forbbiden',
      message: 'No se ha enviado ninguna canción.',
      files: req.files
    });
  }

}

function getFile(req, res){

    console.log("GET: /api/get-song-file/:songFile");

    var songFile = req.params.songFile
    var file = "./uploads/songs/"+songFile;
    fs.exists( file, function(exist){

      if (exist) {

        res.sendFile(path.resolve(file));

      } else {

        res.status(404).send({
          type: 'Forbbiden',
          message: 'No existe el fichero solicitado.',
          songFile
        });

      }

    });

};

module.exports = {
  getSong,
  getSongs,
  saveSong,
  updateSong,
  deleteSong,
  uploadFile,
  getFile

};
