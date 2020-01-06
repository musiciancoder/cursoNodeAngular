'use strict'

var express = require ('express'); //para poder usar rutas
var ArtistController = require('../controllers/artist');
var api = express.Router(); //para ocupar el método Router() e instanciar las funciones de este método: put, post, get, etc con nuestras propias rutas y funciones

var md_auth = require('../middlewares/authenticated');//este es el middleware, que usado en este controlador permite q ocupen solo este controlado los usuarios autenticados

var multipart = require('connect-multiparty'); //para subir archivos o ficheros por http

var md_upload = multipart({ uploadDir: './uploads/artists'}); //uploadDir es


api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist); //para obtener un artista previamente guardado
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist); //para guardar un artista
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists); //para obtener el listado de artistas. page? significa que el parametro en la url es opcional
api.put('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);

module.exports = api;