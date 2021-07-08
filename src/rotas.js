const express = require('express');
const usuarios = require('./controladores/usuarios');
const login = require('./controladores/login');
const verificarLogin = require('./filtros/verificarLogin');
const produtos = require('./controladores/produtos');

const rotas = express();

rotas.post('/cadastro', usuarios.cadastrarUsuario);

rotas.post('/login', login.efetuarLogin);

rotas.use(verificarLogin);

rotas.get('/perfil', usuarios.obterPerfil);
rotas.put('/perfil', usuarios.editarPerfil);


rotas.post('/produtos', produtos.cadastrarProduto);
rotas.get('/produtos', produtos.obterProdutos);
rotas.get('/produtos/:id', produtos.obterUmProduto);
rotas.put('/produtos/:id', produtos.editarProduto);
rotas.delete('/produtos/:id', produtos.excluirProduto);

module.exports = rotas;