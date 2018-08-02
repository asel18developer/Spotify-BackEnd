'use strict'

var mongoose = require("mongoose");
var app = require("./app");
var port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/spotify', (err, res) => {

  if (err) {
    throw err;
  } else {
    console.log("Conexión con la base de datois establecida.");

    app.listen(port, function(){
      console.log("Servidor API REST de spotify escuchando en http://localhost:"+port)
    });
  }

});
