'use strict'

var path = require('path');//libreria de nodejs para manejar rutas de archivos
var fs = require('fs'); //libreria de nodejs para manejar archivos

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

//fn para obtener el artista
function getArtist(req, res){
	res.status(200).send({message: 'Metodo getArtist'});
}

//fn para guardar un artista en BD
function saveArtist(req, res){
	var artist = new Artist()  //instanciamos un objeto Artist de clase models/artist

	var params = req.body; //rescatamos lo que nos llega en el body del request 
	artist.name = params.name; //esto seria lo mismo a escribir en el parentesis de new Artist (name= params.name)
	artist.description = params.description;
	artist.image = 'null';

	artist.save((err, artistStored) => {//save es metodo de nojs para guardar en BD en mongoDB. Recibe como argumentos un error o artistStored que es el artista guardado correctamente
		if(err){
			res.status(500).send({message: 'Error al guardar el artista. Error de servidor'});

		}else{
			if(!artistStored){
				res.status(404).send({message: 'El artista no ha sido guardado. Error tipo HttpRequest'});

			}else{
				res.status(200).send({artist: artistStored});

			}
		}

	});//cierre de artist.save
}

module.exports = {
	getArtist,
	saveArtist


};