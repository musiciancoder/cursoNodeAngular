'use strict'

//en package JSON escribio  "start":"nodemon index.js", para que al escribir en cosola npm start se conecte a la BD

//mongoose.Promise = global.Promise; //Para eliminar el aviso de mongoose que devuelve por la consola donde hemos lanzado el npm start

var mongoose = require('mongoose'); //mongoose es libreria intermediaria para conectar a mongobd. https://mongoosejs.com/
var app = require('./app');//carga la app
var port = process.env.PORT || 3977; //hablita puerto en local  localhost:3977
mongoose.connect('mongodb://localhost:27017/curso_mean2', (err,res) => {

	if(err){//si hay error
		throw err; //arroja el error
	}else{

		console.log("La base de datos está corriendo correctamente");

		app.listen(port, function(){ //asocia nuestra app con el servidor mediante el puerto que está escuchando
			console.log("Servidor del api rest escuchando en http://localhost:" + port); //con esto ya podemos abrir un navegador a traves de localhost:3977 en la url
		});
}


	});