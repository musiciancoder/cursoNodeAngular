'use strict'

var path = require('path');//libreria de nodejs para manejar rutas de archivos
var fs = require('fs'); //libreria de nodejs para manejar archivos
var mongoosePaginate = require('mongoose-pagination');//para hacer paginacion del listado de artistas
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

//fn para obtener un artista previamente guardado en la BD
function getArtist(req, res){
	//el id del artista no es una propiedad definida en models/artist.js sino que la da node/mongo
	var artistId = req.params.id; //rescatar el id que viene por url

	Artist.findById(artistId, (err, artist)=>{ //findById es fn nodeJS predefinida busca en la BD el artista segun id (en nuestro caso en la coleccion Artist, con argumentos err (error) y artista (lo que ha encontrado segun el id que le pasamos)
		if(err){ //si hay error...
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!artist){ //si no viene un artista en la respuesta
			res.status(404).send({message: 'No se ha encontrado el artista'});
				}else{
			res.status(200).send({artist});//si ha encontrado un objeto exitosamente, que envie lo que ha encontrado
			}
		}
	});
	
}

//fn para obtener un listado de los artistas que hemos guardado previamente en la BD
function getArtists(req, res){
	if(req.params.page){ //el parametro page es opcional en la url, por eso en la ruta definimos en la url el parametro con nomenclatura page?
		var page = req.params.page; //esto rescata page por url, si este parametro existe
	}else{
		var page = 1; //valor por defecto si no viene el parametro page en la url
	}
	 
	var itemsPerPage = 3; //que muestre tres artistas en cada pagina

	Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total){ //find() es metodo nodeJS que devuelve listado de colecciones (en nuestro caso Artist), sort ordenaalfabeticamente, err es error, artists la respuesta existosa del listado de artistas y total el numero de objetos en la coleccion
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!artists){
				res.status(404).send({message: 'No hay artistas !!'});
			}else{
				return res.status(200).send({
					total_items: total, //total de objetos 
					artists: artists
				});
			}
		}
	});
						}

					//fn para guardar un artista en la BD
 function saveArtist(req, res){
	var artist = new Artist();  //instanciamos un objeto Artist de clase models/artist. Notar que esta es la unica funcion en que se instancia

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

	});
  
  }







    //fn para actualizar algun artista
	function updateArtist(req, res){
		var artistId= req.params.id; //rescatar id por url
		var update = req.body; //rescatar el cuerpo del request

		Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) =>{
			if(err){
				res.status(500).send({message: 'Error de servidor. No se ha podido actualizar el artista'});
			}else{
				if(!artistUpdated){
					res.status(404).send({message: 'El artista no ha sido actualizado. Error tipo HttpRequest'});
				}else{
					res.status(200).send({artist: artistUpdated});
				}
			}
		});
	}

//fn para eliminar artista, conjuntamente con los albumes y canciones asociados a él
function deleteArtist(req,res) {
    var artistId = req.params.id;//rescatamos por url

    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => { //metodo NodeJS para eliminar por id

        if (err) {
            res.status(500).send({message: 'Error de servidor. No se ha podido borrar el artista'});
        } else {//**
            if (!artistRemoved) {
                res.status(404).send({message: 'El artista no ha sido borrado. Error tipo HttpRequest'});
            } else {//*
                Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => { //buscar en la coleccion de albumes el artista asociado que estamos eliminando por id de artista

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
                                        res.status(200).send({artist: artistRemoved}); //que devuelva el artista que estamos borrando
                                    }

                                }
                            });


                        }
                    }//

                });//de remove

            }//*

        }//**

    });


}

//fn subir imagen para cada artista
function uploadImage(req,res){
	var artistId = req.params.id;//extraemos id de la url
	var file_name = 'No subido...';

	if(req.files){ //si existe la imagen en la request
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\'); //cortar la ruta por las barras
		var file_name = file_split[2];


		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1]; //extension del fichero


		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'  ){

			Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated)=>{//se actualiza la propiedad imagen
				if(!artistUpdated){
					res.status(404).send({message: 'No se ha podido actualizar el usuario'}); //error en la peticion porque no existe artistUpdated
				}else{
					res.status(200).send({artist: artistUpdated}); //pasamos el userUpdated a user

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

	var path_file = './uploads/artists/'+imageFile;

	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));

		}else{
			res.status(200).send({message: 'No existe la imagen'});
		}

	});


}


module.exports = {
	getArtist,
	saveArtist,
	getArtists,
	updateArtist,
	deleteArtist,
	uploadImage,
	getImageFile
}