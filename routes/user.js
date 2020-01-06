'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router(); //esto permite crear  rutas

var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty'); //para subir archivos o ficheros por http

var md_upload = multipart({ uploadDir: './uploads/users'}); //uploadDir es objeto con la carpeta de subida pasado como parametro a fx multipart de libreria externa connect-multiparty

api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas); //se crea la ruta con el controlador asociado. pruebas es una funcion definida en user.js de carpeta controladores.  md_auth.ensureAuth es el middleware definido en middlewares/authenticated.js
//en api.get cuando reciba el primer argumento se ejecutará el segundo 

api.post('/register', UserController.saveUser);

api.post('/login', UserController.loginUser);

//ojo que al escribir el put en postman y ejecutarlo va a arrojar los datos antiguos. Al ejecutar el login de nuevo va a reconocer los datos nuevos
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);//metodo put para actualizar

api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);

api.get('/get-image-user/:imageFile', UserController.getImageFile);


module.exports = api;