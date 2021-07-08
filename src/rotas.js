const express = require('express');
const usuarios = require('./controladores/usuarios');
const login = require('./controladores/login');
const verificarLogin = require('./filtros/verificarLogin')

const rotas = express();

rotas.post('/cadastro', usuarios.cadastrarUsuario);

rotas.post('/login', login.efetuarLogin);

rotas.use(verificarLogin);

rotas.get('/perfil', usuarios.obterPerfil);
rotas.put('/perfil', usuarios.editarPerfil);

module.exports = rotas;