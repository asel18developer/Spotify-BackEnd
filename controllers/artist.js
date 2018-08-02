'use strict'

var fs = require("fs");
var path = require("path");

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');



function getArtist(req, res){

  console.log("GET: /api/artist");

  res.status(200).send({
    message: 'Probabando una acción del controlador de usuarios api rest con node y mongodb'
  });

}

module.exports = {
  getArtist
};
