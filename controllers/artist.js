'use strict'

var fs = require("fs");
var path = require("path");
var moongosePaginate = require("mongoose-pagination");

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

var extensions = ["jpg", "png", "jpeg"];

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

function deleteArtist(req, res){

  console.log("DELETE: /api/delete-artist");

  var artistID = req.params.id;

  Artist.findByIdAndRemove(artistID, function(err, artistRemoved){

    if (err) {

      res.status(500).send({
        message: 'Error al elimnar el artista.'
      });

    } else {

      if (!artistRemoved) {

        res.status(404).send({
          message: 'El artista no ha sido eliminado.'
        });

      } else {

        Album.find({artist: artistRemoved._id}).remove(function(err, albumRemoved){

          if (err) {

            res.status(500).send({
              message: 'Error al elimnar el album.'
            });

          } else {

            if (!albumRemoved) {

              res.status(404).send({
                message: 'El album no ha sido eliminado.'
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
                      message: 'El artista y toda su información ha sido eliminado correctamente.',
                      artistRemoved
                    });

                  }

                }

              });

            }

          }

        });

      }

    }

  });

}

function uploadImage(req, res){

  console.log("POST: /api/upload-image-artist/:id");

  var artistID = req.params.id;
  var file_name = "No subido";

  if (req.files) {

    var file_path = req.files.image.path;
    var file_split = file_path.split("\/");
    var file_name = file_split[2];

    var ext_split = file_name.split("\.");
    var file_ext = ext_split[1];

    if (extensions.indexOf(file_ext) > -1){

      Artist.findByIdAndUpdate(artistID, {image: file_name}, function(err, artistUpdated){

              if (err) {

                res.status(500).send({
                  type: 'Error',
                  message: 'Error al actualizar la imagen.',
                  file_path: file_path,
                  file_name: file_name,
                  file_ext: file_ext
                });

              } else {

                if (!artistUpdated) {
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
                    artistUpdated,
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

    console.log("GET: get-image-artist/:imageFile");

    var imageFile = req.params.imageFile
    var file = "./uploads/artists/"+imageFile;
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
  getArtist,
  getArtists,
  saveArtist,
  updateArtist,
  deleteArtist,
  uploadImage,
  getImage

};
