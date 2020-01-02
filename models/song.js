'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //esto permite crear un objeto de tipo schema, que permite guardar datos en colecciones

var SongSchema = Schema({ //SongSchema es el objeto de tipo Schema a persistir en la BD
	number: String,
	name: String,
	duration:String,
	file: String,
	album: {type: Schema.ObjectId, ref: 'Album'} //con esto le pasamos el id de album. ref es la coleccion de objetos Albums y dentro de ella buscara el id que nosotros le vayamos a pasar por medio de type:Schema.ObjectId
	});

module.exports = mongoose.model ('Song', SongSchema); //esto exporta. Al hacerlo se tendrá el objeto Song de la coleccion Songs (en plural) que podremos instanciar asignandole valores para cada una de las propiedades. El id no es necesario, se asigna automaticamente