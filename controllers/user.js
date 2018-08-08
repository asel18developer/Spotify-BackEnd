'use strict'

var fs = require("fs");
var path = require("path");
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt')

var extensions = ["jpg", "png", "jpeg"];

function pruebas(req, res){

  console.log("GET: /api/probando-controlador");

  res.status(200).send({
    message: 'Probabando una acción del controlador de usuarios api rest con node y mongodb'
  });

}

function saveUser(req, res){

  console.log("POST: /api/register");

  var user = new User();

  var data = req.body;

  console.log(data);

  user.name = data.name;
  user.surname = data.surname;
  user.email = data.email;
  user.role = 'ROLE_USER';
  user.image = 'null';

  if(data.password){

    bcrypt.hash(data.password, null, null, function(err, hash){
      user.password = hash;

      if (user.name != null && user.surname != null && user.email != null) {
        //Guardar usuario
        user.save(function(err, userStored){
          if (err) {
            res.status(500).send({
              type: 'Error',
              message: 'Mongo no pude guardar el usuario.',
              data: data
            });
          } else {
            res.status(200).send({
              type: 'Succesfull',
              message: 'Usuario almacenado correctamente.',
              user: userStored
            });
          }
        });

      } else {
        res.status(200).send({
          type: 'Error',
          message: 'Datos insuficientes.',
          data: data
        });
      }

    });

  }else{
    res.status(200).send({
      type: 'Error',
      message: 'No se recibe contraseña.',
      data: data
    });
  }


}

function loginUser(req, res){

  console.log("POST: /api/login");

  var data = req.body;
  console.log(data);

  User.findOne({email: data.email.toLowerCase()}, function (err, user){

    if (err) {
        res.status(500).send({
        type: 'Error',
        message: 'No se recibe contraseña.',
        data: data
      });

    } else {

      if (!user) {
          res.status(404).send({
          type: 'Error',
          message: 'El usuario no existe.',
          data: data
        });

      } else {
        //Comprobar comtraseña
        bcrypt.compare(data.password, user.password,(err, check) =>{

          if(check){

            if(data.gethash){
              //Devolver un token de jwt
              res.status(200).send({
                type: 'Succesfull',
                token: jwt.createToken(user),
                data: data
              });

            }else{
              //Devuelve el usuario sin jwt
              res.status(200).send({
                type: 'Succesfull',
                user: user,
                data: data,
              });
            }

          }else{

            res.status(404).send({
              type: 'Error',
              message: 'Contraseña incorrecta.',
              data: data
            });

          }
        });

      }
    }

  });


}

function updateUser(req, res){

    console.log("POST: /api/update-user/:id");

    //Se obtiene de la url
    var userId = req.params.id;
    var data = req.body;

    User.findByIdAndUpdate(userId, data, function(err, userUpdated){

      if (err) {

        res.status(500).send({
          type: 'Error',
          message: 'Error actualizar el usuario.',
          data: data
        });

      } else {

        if (!userUpdated) {
          res.status(404).send({
            type: 'Error',
            message: 'No se pudo actualizar el usuario.',
            data: data
          });
        } else {

          res.status(200).send({
            type: 'Succesfull',
            message: 'Usuario actualizado.',
            user: userUpdated,
          });

        }

      }
    });

};

function uploadImage(req, res){

    console.log("POST: upload-image-user/:id");
    //Se obtiene de la url
    var userId = req.params.id;

    if (req.files) {

      var file_path = req.files.image.path;
      var file_split = file_path.split("\/");
      var file_name = file_split[2];

      var ext_split = file_name.split("\.");
      var file_ext = ext_split[1];

      if (extensions.indexOf(file_ext) > -1){

        User.findByIdAndUpdate(userId, {image: file_name}, function(err, userUpdated){

                if (err) {

                  res.status(500).send({
                    type: 'Error',
                    message: 'Error al actualizar la imagen.',
                    file_path: file_path,
                    file_name: file_name,
                    file_ext: file_ext
                  });

                } else {

                  if (!userUpdated) {
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
                      userUpdated,
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

};

function getImage(req, res){

    console.log("GET: get-image/:imageFile");

    var imageFile = req.params.imageFile
    var file = "./uploads/users/"+imageFile;
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
  pruebas,
  saveUser,
  loginUser,
  updateUser,
  uploadImage,
  getImage
};
