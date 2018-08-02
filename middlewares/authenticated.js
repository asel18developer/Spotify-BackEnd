'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_spotify';

exports.ensureAuth = function(req, res, next){

  if(!req.headers.authorization){

    return res.status(403).send({
      type: 'Forbbiden',
      message: "La petición no tiene la cabecera authorization"
    });

  }

  var token = req.headers.authorization.replace(/['""']/g, '');

  try {

    var payload = jwt.decode(token, secret);

    if (payload.exp <= moment().unix()) {

      return res.status(401).send({
        type: 'Error',
        message: "El token ha expirado"
      });

    }

  } catch (err) {
    return res.status(500).send({
      type: 'Error',
      message: "Token invalido."
    });
  }

  req.user = payload;

  next();

  };
