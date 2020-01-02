'use strict'

//este es fichero para generar los token (identificadores) para autentificar usuarios

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso'; //esta es la clave para hashear

module.exports.createToken= function(user){  //crea el identificador
	
	var payload = { 
		sub:user._id,
		surname:user.surname,
		email: user.email,
		role: user.role,
		image:user.image,
		iat: moment().unix(), //para obtener la fecha
		exp: moment().add(30, 'days').unix //que expire luego de 30 dias

	};


	return jwt.encode(payload, secret); //esto hashea



};