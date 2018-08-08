'use strict'

var fs = require("fs");
var path = require("path");
var moongosePaginate = require("mongoose-pagination");

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

var extensions = ["jpg", "png", "jpeg"];

function getAlbum(req, res){

  console.log("GET: /api/album");

  var albumID = req.params.artist;

  Album.findById(albumID).populate({path: 'artist'}).exec((err, album) => {

    if (err) {

      res.status(500).send({
        message: 'Error en la petición'
      });

    } else {

      if (!album) {

        res.status(404).send({
          message: 'El album no existe'
        });

      } else {

        res.status(200).send({
          message: 'Album encontrado correctamente',
          album
        });

      }

    }

  });
}

function getAlbums(req, res){

  console.log("GET: /api/album");

  var artistID = req.params.id;

  if (!artistID) { //Todos los albums

    var find = Album.find({}).sort('title');

  } else { // Unicamente los albums del artista pasado

    var find = Album.find({artist: artistID}).sort('year');

  }

  find.populate({path: 'artist'}).exec((err, albums) => {

    if (err) {

      res.status(500).send({
        message: 'Error en la petición'
      });

    } else {

      if (!albums) {

        res.status(404).send({
          message: 'No existen albums'
        });

      } else {

        res.status(200).send({
          message: 'Albums encontrado correctamente',
          albums
        });

      }

    }
  });

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

function updateAlbum(req, res){

  console.log("PUT: /api/album");

  var albumID = req.params.id;
  var updateInfo = req.body;

  Album.findByIdAndUpdate(albumID, updateInfo, (err, albumUpdated) => {

    if (err) {

      res.status(500).send({
        message: 'Error en la petición'
      });

    } else {

      if (!albumUpdated) {

        res.status(404).send({
          message: 'No se ha actualizado el album, porque no existe'
        });

      } else {

        res.status(200).send({
          message: 'Album actualziado correctamente',
          albumUpdated
        });

      }

    }

  });




}

function deleteAlbum(req, res){

  console.log("DELETE: /api/album");

  var albumID = req.params.id;

  Album.findByIdAndRemove(albumID, function(err, albumRemoved){

    if (err) {

      res.status(500).send({
        message: 'Error al elimnar el album.'
      });

    } else {

      if (!albumRemoved) {

        res.status(404).send({
          message: 'El album no existe.'
        });

      } else {

        Song.find({album: albumRemoved._id}).remove(function(err, songRemoved){

          if (err) {

            res.status(500).send({
              message: 'Error al elimnar la canción.'
            });

          } else {

            if (!songRemoved) {

              res.status(404).send({
                message: 'La canción no ha sido eliminada.'
              });

            } else {

              res.status(200).send({
                message: 'El album y toda su información ha sido eliminado correctamente.',
                albumRemoved
              });

            }

          }

        });

      }

    }

  });

}

function uploadImage(req, res){

  console.log("POST: /api/upload-image-album/:id");

  var albumID = req.params.id;
  var file_name = "No subido";

  if (req.files) {

    var file_path = req.files.image.path;
    var file_split = file_path.split("\/");
    var file_name = file_split[2];

    var ext_split = file_name.split("\.");
    var file_ext = ext_split[1];

    if (extensions.indexOf(file_ext) > -1){

      Album.findByIdAndUpdate(albumID, {image: file_name}, function(err, albumUpdated){

              if (err) {

                res.status(500).send({
                  type: 'Error',
                  message: 'Error al actualizar la imagen.',
                  file_path: file_path,
                  file_name: file_name,
                  file_ext: file_ext
                });

              } else {

                if (!albumUpdated) {
                  res.status(404).send({
                    type: 'Error',
                    message: 'No se pudo actualizar la imagen.',
                    file_path: file_path,
                    file_name: file_name,
                    file_ext: file_ext
                  });
                } else {

                  res.status(200).send({
                    type: 'Succesfull',
                    message: 'Imagen subida correctamente.',
                    albumUpdated,
                    file_name: file_name
                  });

                }

              }
      });



    }else{
      res.status(500).send({

        type: 'Error',
        message: 'Extensión de la imagen invalida.',
        file_path: file_path,
        file_name: file_name,
        file_ext: file_ext
      });

    }
  } else {
    res.status(404).send({
      type: 'Forbbiden',
      message: 'Sin imagen.',
      files: req.files
    });
  }

}

function getImage(req, res){

    console.log("GET: /api/get-image-album/:imageFile");

    var imageFile = req.params.imageFile
    var file = "./uploads/albums/"+imageFile;
    fs.exists( file, function(exist){

      if (exist) {

        res.sendFile(path.resolve(file));

      } else {

        res.status(404).send({
          type: 'Forbbiden',
          message: 'No existe la imagen solicitada.',
          imageFile: imageFile
        });

      }

    });

};

module.exports = {
  getAlbum,
  getAlbums,
  saveAlbum,
  updateAlbum,
  deleteAlbum,
  getImage,
  uploadImage

};
