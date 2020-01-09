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

//fn obtener listado de albums
function getAlbums(req,res) {

    var artistId = req.params.artist; //rescatamos artista por url
    if (!artistId) {
//sacar todos los albumes de la BD
        var find = Album.find({}).sort('title'); //Album.find({}) saca toda la coleccion y .sort('title') la ordena alfabeticamente por titulo
    } else {
        //sacar los albumes de un artista concret de la BD
        var find = Album.find({artist: artistId}).sort('year');//ordena por año los albums de ese artista

    }
    find.populate({path: 'artist'}).exec((err, albums) =>{ //ver getAlbum() para explicacion de populate
        if(err){
            res.status(500).send({message : 'Error en la petición'});
        }else{
            if(!albums){
                res.status(404).send({message : 'No hay albums'});
            }else {
                res.status(200).send({albums});
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

function updateAlbum(req, res){
    var albumId= req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) =>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(!albumUpdated){
                res.status(404).send({message: 'No se ha actualizado el album'});
            }else{
                res.status(200).send({album: albumUpdated});
            }
        }

    });

}

function deleteAlbum(req, res){
    var albumId = req.params.id;

    Album.find({artist: albumId}).remove((err, albumRemoved) => { //copio y pego desde deleteArtist en controllers/artist

        if (err) {
            res.status(500).send({message: 'Error de servidor. No se ha podido borrar el album'});

        } else {//
            if (!albumRemoved) {
                res.status(404).send({message: 'El album no ha sido borrado. Error tipo HttpRequest'});
            } else {


                Song.find({album: albumRemoved._id}).remove((err, songRemoved) => { //buscar en la coleccion de canciones el album asociado al artista que estamos eliminando por id de album
                    if (err) {
                        res.status(500).send({message: 'Error de servidor. No se ha podido borrar la canción'});
                    } else {
                        if (!songRemoved) {
                            res.status(404).send({message: 'La canción no ha sido borrada. Error tipo HttpRequest'});
                        } else {
                            res.status(200).send({album: albumRemoved}); //que devuelva el album que estamos borrando
                        }

                    }
                });


            }
        }//

    });//de remove

}


//fn subir imagen para cada lbum
function uploadImage(req,res){
    var albumId = req.params.id;//extraemos id de la url
    var file_name = 'No subido...';

    if(req.files){ //si existe la imagen en la request
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\'); //cortar la ruta por las barras
        var file_name = file_split[2];


        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1]; //extension del fichero


        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'  ){

            Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated)=>{//se actualiza la propiedad imagen
                if(!albumUpdated){
                    res.status(404).send({message: 'No se ha podido actualizar el usuario'}); //error en la peticion porque no existe albumUpdated
                }else{
                    res.status(200).send({album: albumUpdated}); //mostramos el objeto albumUpdated

                }
            });

        }else{
            res.status(200).send({message: 'Extension de archivo no válida'});
        }


    }else{
        res.status(200).send({message: 'No has subido ninguna imagen aún'});
    }
}

//metodo para obtener un fichero del servidor (para mostrar una imagen, por ejemplo)
function getImageFile(req,res){
    var imageFile = req.params.imageFile; //extraemos el nombre de archivo de imagen por url

    var path_file = './uploads/albums/'+imageFile;

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));

        }else{
            res.status(200).send({message: 'No existe la imagen'});
        }

    });


}

module.exports = {
        getAlbum,
        saveAlbum,
        getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}
