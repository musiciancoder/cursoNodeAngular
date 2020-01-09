'use strict'

var path = require('path');//libreria de nodejs para manejar rutas de archivos
var fs = require('fs'); //libreria de nodejs para manejar archivos
var mongoosePaginate = require('mongoose-pagination');//para hacer paginacion de un listado
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function  getSong(req,res) {
    //solo para probar: res.status(200).send({message: 'Controlador canción'});
    var songId = req.params.id;//rescatamos de url

    Song.findById(songId).populate({path: 'album'}).exec((err,song) =>{ // Song.findById(songId) encuentra la cancion; .populate({path: 'album'}) muestrame los datos el album asociado a la cqncion; exec es para ejecutar
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else {
            if (!song) {
                res.status(404).send({message: 'La canción no existe'});
            } else {
                res.status(200).send({song});
            }
        }
    });
}


function saveSong( req,res){
    var song = new Song();

    var params =req.body;
    song.number= params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err, songStored) => {
        if (err) {

            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if (!songStored) {
                res.status(404).send({message: 'No se ha guardado la canción'});
            } else {
                res.status(200).send({song: songStored});
            }
        }


    });

}

//fn para obtener el listado de canciones de un album o de todos los albums
function getSongs(req, res) {
    var albumId = req.params.album;

    if (!albumId) { //si no le pasamos un album...
        var find = Song.find({}).sort('number'); //...que devuelva todas las canciones de la coleccion Song
    } else { //sino...
        var find = Song.find({album: albumId}).sort('number'); //que devuelva las canciones del album albumId
    }


    find.populate({ //esto es para popular los albums y los artistas
        path: 'album', //acá popula el album al que pertence la cancion
        populate: {
            path: 'artist', //acá a su vez reemplazamos el artista al que pertence el album por el objeto que hay en la coleccion de artista
            model: 'Artist'
        }
    }).exec(function (err, songs) {
        if (err) {
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!songs){
                res.status(404).send({message: 'No hay ninguna canción'});
            }else{
                res.status(200).send({songs});
            }
        }
    });
}

//actualizar una cancion
function updateSong(req, res){
    var songId= req.params.id; //recatar de url
    var update =req.body; //rescatar del body

    Song.findByIdAndUpdate(songId, update, (err, songUpdated) =>{ //que encuentre por id un objeto song en la coleccion Song y lo actualize
        if (err) {
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!songUpdated){
                res.status(404).send({message: 'No se ha actualizado canción'});
            }else{
                res.status(200).send({song: songUpdated});
            }
        }

    });
}


function deleteSong(req, res){
    var songId = req.params.id; //rescata de url
    Song.findByIdAndRemove(songId, (err, songRemoved )=>{
        if (err) {
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!songRemoved){
                res.status(404).send({message: 'No se ha borrado la canción, porque la canción ya ha sido borrada anteriormente o porque nunca ha sido creada. No existe en la BD'});
            }else{
                res.status(200).send({song: songRemoved});
            }
        }

    })
}

//fn para subir archivo de audio
function uploadFile(req,res){
    var songId = req.params.id;//extraemos id de la url
    var file_name = 'No subido...';

    if(req.files){ //si existe el fichero en la request
        var file_path = req.files.file.path;//file es el archivo de audio y req.files.file.path es la ruta del archivo
        var file_split = file_path.split('\\'); //cortar la ruta por las barras
        var file_name = file_split[2];


        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1]; //extension del fichero


        if(file_ext == 'mp3' || file_ext == 'ogg'  ){

            Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated)=>{//se actualiza la propiedad file_name. songId es la canción a la cual le queremos subir el audio, file:file_name es el audio que ya estaba y que queremos reemplazar, songUpdated es el nuevo audio
                if(!songUpdated){
                    res.status(404).send({message: 'No se ha podido actualizar la canción'}); //error en la peticion porque no existe albumUpdated
                }else{
                    res.status(200).send({album: songUpdated}); //mostramos el objeto songUpdated

                }
            });

        }else{
            res.status(200).send({message: 'Extension de archivo no válida'});
        }


    }else{
        res.status(200).send({message: 'No has subido el fichero de audio...'});
    }
}

//metodo para obtener un audio del servidor (para mostrar una imagen, por ejemplo)
function getSongFile(req,res){
    var imageFile = req.params.songFile; //extraemos el nombre de archivo de imagen por url

    var path_file = './uploads/songs/'+imageFile;

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));//envia el fichero al usuario

        }else{
            res.status(200).send({message: 'No existe el fichero de audio..'});
        }

    });


}


module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
}