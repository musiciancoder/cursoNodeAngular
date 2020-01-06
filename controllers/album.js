'use strict'

var path = require('path');//libreria de nodejs para manejar rutas de archivos
var fs = require('fs'); //libreria de nodejs para manejar archivos
var mongoosePaginate = require('mongoose-pagination');//para hacer paginacion de un listado
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

//fn para obtener un album previamente guardado en la BD
function getAlbum(req, res){
    var albumId = req.params.id;

    Album.findById(albumId).populate({path: 'artist'}).exec((err, album)=>{ //  Album.findById(albumId) que encuentre el album por el id del album. con populate({path: 'artist'}); conseguimos todos los datos del artista que ha publicado este album. recordar que definimos que un album pertenece a un artista en el modelo del album con el codigo artist: {type: Schema.ObjectId, ref: 'Artist'} como una propiedad de el objeto Album
        if(err){
            res.status(500).send({message : 'Error en la petición'});
        }else{
            if(!album){
                res.status(404).send({message : 'El album no existen'});
            }else {
                res.status(200).send({album});
            }
        }
    });

}

//fn para guardar un album.
function saveAlbum(req, res){
    var album = new Album (); //instanciamos la clase modelo

    var params = req.body; //que rescate el body en la peticion
    //las tres siguientes lineas es lo mismo que  var album = new Album (params.title, params.description, params.year);
    album.title = params.title; //extrae de url
    album.description = params.description;
    album.year = params.year;
    album.image = "null";
    album.artist = params.artist;

    album.save((err, albumStored) => {  //save es metodo de nodeJS
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(!albumStored){
                res.status(404).send({message: 'No se ha guardado el album'});
            }else{
                res.status(200).send({album: albumStored});
            }
        }
    })

}

module.exports = {
        getAlbum,
        saveAlbum
}
