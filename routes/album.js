'use strict'

var express = require ('express'); //para poder usar rutas
var AlbumController = require('../controllers/album');
var api = express.Router(); //para ocupar el método Router() e instanciar las funciones de este método: put, post, get, etc con nuestras propias rutas y funciones

var md_auth = require('../middlewares/authenticated');//este es el middleware, que usado en este controlador permite q ocupen solo este controlado los usuarios autenticados

var multipart = require('connect-multiparty'); //para subir archivos o ficheros por http

var md_upload = multipart({ uploadDir: './uploads/albums'}); //uploadDir es


api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum); //ruta para obtener un album previamente guardado
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum); //ruta para guardar album en la BD
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
api.put('/album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);

module.exports = api;