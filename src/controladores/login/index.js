const jwt = require('jsonwebtoken');
const knex = require('../../conexao');
const segredo = require('../../segredo');
const bcrypt = require('bcrypt');

const efetuarLogin = async (req, res) => {
    const {email, senha} = req.body; 
    if(!email) {
        return res.status(400).json('O campo email é obrigatório!');
    }
    if(!senha) {
        return res.status(400).json('O campo senha é obrigatório!');
    }
    try {
        const verificarEmail = await knex('usuarios').where('email', email);
        if(verificarEmail.length === 0) {
            return res.status(404).json('Email ou senha incorretos');
        }
        const usuario = verificarEmail[0];
        const verificarSenha = await bcrypt.compare(senha, usuario.senha);
        if(!verificarSenha) {
            return res.status(404).json('Email ou senha incorretos');
        }
        try {
            const token = jwt.sign({ id: usuario.id }, segredo, {expiresIn: '1d'});
            const {senha: senhaUsuario, ...dadosUsuario} = usuario;
            return res.status(200).json({
                usuario: dadosUsuario,
                token
            });
        } catch (error) {
            return res.status(500).json(error.message);
        }
    } catch (error) {
        return res.status(400).json(error.message);
    }

}

module.exports = {efetuarLogin};