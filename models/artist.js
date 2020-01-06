'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //esto permite crear un objeto de tipo schema, que permite guardar datos en colecciones

var ArtistSchema = Schema({ //ArtistSchema es el objeto de tipo Schema a persistir en la BD
	name: String,
	description: String,
	image: String
	});

module.exports = mongoose.model ('Artist', ArtistSchema); //esto exporta. Al hacerlo se tendrá disponible el objeto Artist que podremos instanciar en el metodo para guardar artistas en el controlador, asignandole valores para cada una de las propiedades de ArtistSchema. 
//cuando se ejecute la funcion saveArtist guardará el objeto instanciado (en nuestro caso lo llamo artist, con minuscula) en la coleccion Artist en la base de datos
//El id no es necesario, se asigna automaticamente.