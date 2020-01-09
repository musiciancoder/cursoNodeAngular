'use strict'

var express = require ('express'); //para poder usar rutas
var SongController = require('../controllers/song');
var api = express.Router(); //para ocupar el método Router() e instanciar las funciones de este método: put, post, get, etc con nuestras propias rutas y funciones

var md_auth = require('../middlewares/authenticated');//este es el middleware, que usado en este controlador permite q ocupen solo este controlado los usuarios autenticados

var multipart = require('connect-multiparty'); //para subir archivos o ficheros por http

var md_upload = multipart({ uploadDir: './uploads/songs'});


api.get('/song/:id', md_auth.ensureAuth, SongController.getSong); //ruta para obtener cancion previamente guardada
api.post('/song', md_auth.ensureAuth, SongController.saveSong); //ruta guardar cancion
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile);
api.get('/get-song-file/:songFile', SongController.getSongFile);

module.exports = api;