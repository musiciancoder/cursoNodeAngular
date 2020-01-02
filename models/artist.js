'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //esto permite crear un objeto de tipo schema, que permite guardar datos en colecciones

var ArtistSchema = Schema({ //ArtistSchema es el objeto de tipo Schema a persistir en la BD
	name: String,
	description: String,
	image: String
	});

module.exports = mongoose.model ('Artist', ArtistSchema); //esto exporta. Al hacerlo se tendrá el objeto Artist de la colección Artists (en plural) que podremos instanciar asignandole valores para cada una de las propiedades de ArtistSchema. El id no es necesario, se asigna automaticamente