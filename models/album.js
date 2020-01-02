'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //esto permite crear un objeto de tipo schema, que permite guardar datos en colecciones

var AlbumSchema = Schema({ //AlbumSchema es el objeto de tipo Schema a persistir en la BD
	title: String,
	description: String,
	year:Number,
	image: String,
	artist: {type: Schema.ObjectId, ref: 'Artist'} //con esto le pasamos el id de artist. ref es la coleccion de objetos Artist y dentro de ella buscara el id que nosotros le vayamos a pasar por medio de type:Schema.ObjectId
	});

module.exports = mongoose.model ('Album', AlbumSchema); //esto exporta. Al hacerlo se tendrá el objeto Album de la coleccion Albums (en plural) que podremos instanciar asignandole valores para cada una de las propiedades de AlbumSchema. El id no es necesario, se asigna automaticamente