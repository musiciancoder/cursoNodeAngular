'use strict'

var express =require('express');//para usar los metodos de rutas
var bodyParser =require('body-parser');

var app = express(); //para utilizar express

//cargar rutas
var user_routes =  require('./routes/user');
var artist_routes = require ('./routes/artist');
var album_routes = require ('./routes/album');
var song_routes = require ('./routes/song');


app.use(bodyParser.urlencoded({extended:false})); //para pasar a json respuestas http
app.use(bodyParser.json());

//configurar cabeceras http. Esto es necesario para que ajax funcione en las peticiones
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next(); //para seguir el flujo normal de ejecución
});

//rutas base. esto funciona gracias al sistema de rutas de express
app.use('/api',user_routes);//con esto sencillamente en la url va a llevar '/api' primero en la url y luego con user_routes se ejecuta el archivo './routes/user' que trae las rutas siguientes
app.use('/api',artist_routes);
app.use('/api',album_routes);
app.use('/api',song_routes);

//what are res and req parameters in Express functions? req is an object containing information about the HTTP request that raised the event. In response to req, you use res to send back the desired HTTP response.

//Those parameters can be named anything. You could change that code to this if it's more clear:


//solo para probar las rutas cuando recien estamos partiendo con el proyecto
app.get('/user/:id', function(request, response){
  response.send('user ' + request.params.id);
});
app.get('/pruebas', function(req,res){
	res.status(200).send({message: 'Bienvenido al curso de node'});
});//esto genera la ruta pruebas, solo para probar

module.exports= app;