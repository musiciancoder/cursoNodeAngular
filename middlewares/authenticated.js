'use strict'

//este es fichero para funciones middleware, que son las funciones que primero  se van a ejecutar en una petición http, antes de ejecutar cualquier funcion del controlador (rutas, funciones, etc.)

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso'; //esta es la clave para hashear

//esta funcion se ejecuta en routes/user.js
exports.ensureAuth = function(req, res, next){ //esta funcion es un middleware, es decir se ejecuta antes que una accion directa de un controlador en la petición, y sirve para que los datos del usuario que ya se logeado correctamente esten disponibles en peticiones http requests

	if(!req.headers.authorization){ //en caso q no exista el header autorization
		return res.status(403).send({message : 'La petición no tiene la cabecera de autenticación'});
	}

	//si existe el header authorization
	var token = req.headers.authorization.replace(/['"]+/g, ''); //que elimine las comillas que vienen en el token

	try{
		var payload = jwt.decode(token, secret); //que decodifique el token y lo guarde en variable payload

		if(payload.exp <= moment().unix()){ //payload.exp la fecha de expiracion del token y moment().unix() la fecha actual
		return res.status(401).send({message : 'El token ha expirado'});
	}
	}catch(ex){
		//console.log(ex);
		return res.status(404).send({message : 'Token no valido'});
	}

	req.user = payload; //con esto vamos a tener disponible en cada metodo de la request que utilice este middleware (ensureAuth), un objeto user con todos los datos del usuario identificado, es decir con todos los datos que nos vienen en el token yua decodificados ( en este mismo fichero los hemos decodificado), por lo que ya no necesitaremos decodificarlo

	next(); //sale del middleware
};