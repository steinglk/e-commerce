const knex = require('../../conexao');
const bcrypt = require('bcrypt');
const segredo = require('../../segredo');
const nodemailer = require('../../nodemailer');

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
        if(consultaEmail.length > 0) {
            return res.status(400).json('Email já cadastrado');
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        const usuario = {
            nome,
            email,
            nome_loja,
            senha: senhaCriptografada
        }
        const usuarioCadastrado = await knex('usuarios').insert(usuario);
        console.log(usuarioCadastrado);
        if(usuarioCadastrado.rowCount === 0) {
            return res.status(400).json("Não foi possivel cadastrar usuario");
        }
        const dadosEmail = {
            from: 'Ecommerce <nao-respondeer@cubosacademy.com>',
            to: email,
            subject: 'Bem vindo ao Market Cubos',
            text: `Olá ${nome}. Você realizou um cadastro em nossa plataforma. Faça o login com o email: ${email}.`
        }
        nodemailer.sendMail(dadosEmail);

        return res.status(200).json('Usuario cadastrado com sucesso!');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterPerfil = async (req, res) => {
    return res.status(200).json(req.usuario);
}

const editarPerfil = async (req, res) => {
    const {nome, email, senha, nome_loja } = req.body;
    const usuarioAtual = req.usuario;
    const novosDados = {
        nome: '',
        email: '',
        senha: '',
        nome_loja: ''
    };

    if(!nome && !email && !senha && !nome_loja){
        return res.status(400).json('Pelo menos um campo deve ser informado para editar')
    }
    if(email && email.trim() != usuarioAtual.email){
    try {
        const consultaEmail = await knex('usuarios').where('email', email);
        if(consultaEmail.length > 0) {
            return res.status(400).json('Email já cadastrado');
        }
        novosDados.email = email;
    } catch(error){
        return res.status(500).json(error.message);
        }
    } else {
        novosDados.email = usuarioAtual.email;
    }
    if(nome && nome.trim()) {
        novosDados.nome = nome;
    } else {
        novosDados.nome = usuarioAtual.nome;
    }
    if(senha && senha.trim()) {
        try {
            const senhaAtual = await knex('usuarios').where('id', usuarioAtual.id).select('senha').first();
            console.log(senhaAtual);
            const verificarSenha = await bcrypt.compare(senha, senhaAtual.senha);
        if(!verificarSenha) {
            const senhaCriptografada = await bcrypt.hash(senha, 10);
            novosDados.senha = senhaCriptografada;
        }
        } catch (error) {
            return res.status(400).json(error.message)
        }
    } else {
        const senhaAtual = await knex('usuarios').where('id', usuarioAtual.id).select('senha').first();
        console.log(senhaAtual);
        novosDados.senha = senhaAtual.senha;
    }
    if(nome_loja && nome_loja.trim()) {
        novosDados.nome_loja = nome_loja;
    } else {
        novosDados.nome_loja = usuarioAtual.nome_loja;
    }
    try {
        const atualizaUsuario = await knex('usuarios').where('id', usuarioAtual.id).update(novosDados);
        return res.status(200).json('Dados atualizados com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}


module.exports = {
    cadastrarUsuario,
    obterPerfil,
    editarPerfil
}