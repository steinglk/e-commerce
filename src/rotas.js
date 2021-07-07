const express = require('express');
const usuarios = require('./controladores/usuarios');
const login = require('./controladores/login');

const rotas = express();

rotas.post('/cadastro', usuarios.cadastrarUsuario);


rotas.get('/login', login.efetuarLogin);

module.exports = rotas;