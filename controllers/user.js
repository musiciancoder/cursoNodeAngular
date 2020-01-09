'use strict'
var fs = require('fs');//para trabajar con  ficheros en el servidor
var path = require('path'); //para trabajar con rutas de archivos en el servidor
var bcrypt = require('bcrypt-nodejs'); //bcrypt libreria para encriptar, previamente instalada 
var User = require('../models/user');//importamos el modelo
var jwt = require('../services/jwt');  //importamos fichero de creacion de tokens. Con este codigo en Node permite importar el archivo y simultaneamente "instanciarlo" como si el archivo fuera una clase, por lo que se tienen acceso a todas las funciones y campos


function pruebas(req, res){ //request lo que recibe en la peticion y res es la respuesta
	res.status(200).send({
		message: 'Probando una acción del controlador de usuarios api Rest con Node y Mongo'
	});
}

function saveUser(req, res){ //funcion para guardar un usuario nuevo
	var user = new User(); //aca estamos instanciando un User del modelo

	var params = req.body; //con req.body recogemos los parametros que nos llegan por post en el cuerpo del request y los pasamos a objeto JSON. Para probar el backend se escriben los datos del usuario en el body de postman.

	console.log(params);

	user.name = params.name;//Asignamos los valores a las propiedades. user.name es propiedad de user en el modelo, params.name es lo que viene en el request
	user.surname = params.surname;
	user.email =params.email;
	user.role = 'ROLE_ADMIN';
	user.image = 'null';

	if(params.password){
		//Encriptar contraseña y guardar datos.
		//Una función criptográfica hash- usualmente conocida como “hash”- es un algoritmo matemático que transforma cualquier bloque arbitrario de datos en una nueva serie de caracteres con una longitud fija. Independientemente de la longitud de los datos de entrada, el valor hash de salida tendrá siempre la misma longitud. O sea encripta o codifica
		bcrypt.hash(params.password, null, null, function(err, hash){

			user.password = hash;

			if(user.name !=null && user.surname !=null && user.email !=null){

				//que guarde el usuario si los campos estan llenados correctmente
			user.save((err, userStored) => {//metodo de nojs para insertar en mongoDB
				if(err){
					res.status(500).send({message:'Error al guardar el usuario'});
				}else{

					if(!userStored){
						res.status(404).send({message:'No se ha registrado el usuario'});
					
					}else{
							res.status(200).send({user: userStored}); //que devuelva un objeto anonimo con los datos que se han guardado
					}
				}


			}); //cierre de user.save

			}else{
				res.status(200).send({message:'Rellena todos los campos'});
//status(200) cuando faltan por rellenar datos, status(400) cuando no existe un regustro, status(500) algun error en servidor
			}
		
		});

	}else{
		res.status(200).send({message:'introduce la contraseña'});//si no hay contraseña que muestre un mensaje en la response para q el usuario la introduzca
	}

}

function loginUser(req, res){

	var params = req.body; //con req.body recogemos los parametros que nos llegan por post en el cuerpo del request y los pasamos a objeto JSON 

	var email = params.email;
	var password = params.password;

	User.findOne({email: email.toLowerCase()}, (err, user) =>{ //encuentrame en la BD todos los objetos User de la coleccion de objetos Users cuyo email sea igual al email de la persona que se esta registrando
	
	if(err){
		res.status(500).send({message:'Error en la coneccion'});
		}else{
			if(!user){
			res.status(404).send({message:'El usuario no existe'});
		}else{

			//Comprobar la contraseña
			bcrypt.compare(password, user.password, function(err,check){ //compare el primer argumento de la persona que esta escribiendo su contraseña con el segundo argumento de la base de datos
				if(check){
					//devolver los datos del usuario logeado correctamente
				
				if(params.gethash){
					//devolver un token de jwt (JSON web token, es un identificador codificado, generado en nuestro caso en archivo services/jwt). https://es.wikipedia.org/wiki/JSON_Web_Token
					res.status(200).send({
						token: jwt.createToken(user) //user es el usuario que se esta intentando logear
					});			
					}else{
					res.status(200).send({user});//que devuelva el objeto user que ha logeado

				}
			}else{
				res.status(404).send({message: 'El usuario no ha podido loguearse coreectamente'});
			}
			});

		}
	}

	});

}

function updateUser(req, res){ //para actualizar el usuario
	var userId = req.params.id; //extraemos el id de la url
	var update = req.body; //extraemos los datos del body de la peticion

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if(err){
			res.status(500).send({message: 'Error al actualizar el usuario'});//error de servidor
		}else{
			if(!userUpdated){
				res.status(404).send({message: 'No se ha podido actualizar el usuario'}); //error en la peticion porque no existe userUpdated
			}else{
			res.status(200).send({user: userUpdated}); //pasamos el userUpdated a user

			}
		}

	});

}

//fn para subir avatar de usuario
function uploadImage(req,res){
	var userId = req.params.id;//extraemos id de la url
	var file_name = 'No subido...';

	if(req.files){ //si existe la imagen en la request
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\'); //cortar la ruta por las barras
		var file_name = file_split[2];


		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1]; //extension del fichero


if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'  ){

User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated)=>{//se actualiza la propiedad imagen
	if(!userUpdated){
	res.status(404).send({message: 'No se ha podido actualizar el usuario'}); //error en la peticion porque no existe userUpdated
	}else{
			res.status(200).send({image: file_name, user: userUpdated}); //pasamos el userUpdated a user

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
	var imageFile = req.params.imageFile; //extraemos el nombre de archivo de imagen de url

	var path_file = './uploads/users/'+imageFile;

	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));

		}else{
			res.status(200).send({message: 'No existe la imagen'});
		}

	});


}





module.exports = {
  pruebas,
  saveUser,
  loginUser,
  updateUser,
  uploadImage,
  getImageFile
};