'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router(); //esto permite crear  rutas
var md_auth = require('../middlewares/authenticated');

api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas); //se crea la ruta con el controlador asociado. pruebas es una funcion definida en user.js de carpeta controladores.  md_auth.ensureAuth es el middleware definido en middlewares/authenticated.js
//en api.get cuando reciba el primer argumento se ejecutará el segundo 

api.post('/register', UserController.saveUser);

api.post('/login', UserController.loginUser);

module.exports = api;