const knex = require('../../conexao');
const bcrypt = require('bcrypt');
const segredo = require('../../segredo');

const cadastrarUsuario = async (req, res) => {
    const {nome, email, senha, nome_loja } = req.body;

    if(!nome) {
        return res.status(400).json('O campo nome é obrigatório');
    }
    if(!senha) {
        return res.status(400).json('O campo senha é obrigatório');
    }
    if(!nome_loja) {
        return res.status(400).json('O campo nome_loja é obrigatório');
    }
    if(!email) {
        return res.status(400).json('O campo email é obrigatório');
    }
    try {
        const consultaEmail = await knex('usuarios').where('email', email);
        console.log(consultaEmail);
        if(consultaEmail.length > 0) {
            return res.status(400).json('Email já cadastrado');
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        const usuario = {
            nome,
            email,
            senha: senhaCriptografada,
            nome_loja
        }
        try {
            const usuarioCadastrado = await knex('usuarios').insert(usuario);
            return res.status(200).json('Usuario cadastrado com sucesso!');
        } catch (error) {
            return res.status(500).json(error.message);
        }
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = {
    cadastrarUsuario
}