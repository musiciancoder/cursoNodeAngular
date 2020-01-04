'use strict'

//https://mongoosejs.com/docs/models.html

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //esto permite crear un objeto de tipo schema, que permite guardar datos en colecciones

var UserSchema = Schema({ //UserSchema es el objeto de tipo Schema a persistir en la BD
	name: String,
	surname: String,
	email:String,
	password: String,
	role:String,
	image: String
	});

module.exports = mongoose.model ('User', UserSchema); //esto exporta. Al hacerlo se tendrá el objeto User de la coleccion Users (en plural) que podremos instanciar asignandole valores para cada una de las propiedades de AlbumSchema. El id no es necesario, se asigna automaticamente
//lo exportamos asi para que 'User'pueda udar los metodos de 