const knex = require('../../conexao');

const cadastrarProduto = async (req, res) => {
    const {nome, estoque, preco, categoria, descricao, imagem} = req.body;
    const usuario = req.usuario;
    if(!nome){
        return res.status(400).json('O campo nome do produto é obrigatório');
    }
    if(!estoque){
        return res.status(400).json('O campo estoque do produto é obrigatório');
    }
    if(!descricao){
        return res.status(400).json('O campo descricao do produto é obrigatório');
    }
    if(!preco){
        return res.status(400).json('O campo preço do produto é obrigatório');
    }
    try {
        const produto = {
            nome,
            usuario_id: usuario.id,
            preco,
            estoque,
            categoria,
            descricao,
            imagem
        }
        const cadastroDoProduto = await knex('produtos').insert(produto);
        return res.status(200).json(produto);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterProdutos = async (req, res) => {
    const usuario = req.usuario;

    try {
        const ListaDeProdutos = await knex('produtos').where('usuario_id', usuario.id).orderBy('categoria');
        return res.status(200).json(ListaDeProdutos);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterUmProduto = async (req, res) => {
    const produtoId = req.params.id;
    const usuario = req.usuario;
    try {
        const produto = {
            id: produtoId,
            usuario_id: usuario.id
        }
        const consultarProduto = await knex('produtos').where(produto);
        return res.status(200).json(consultarProduto);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const editarProduto = async (req, res) => {
    const { nome, preco, estoque, 
        categoria, descricao, imagem} = req.body;
    const {usuario} = req; 
    const produtoId = req.params.id;

    if(!nome && !preco && !estoque && !categoria && !descricao && !imagem) {
        return res.status(400).json('Pelo menos um campo deve ser informado para editar');
    }
    try {
        
        const produto = {
            id: produtoId,
            usuario_id: usuario.id
        }
        const consultarProduto = await knex('produtos').where(produto).first();
        if(!consultarProduto) {
            return res.status(404).json('Produto não encontrado');
        }
        const novoProduto = consultarProduto;
        if(nome && nome.trim()) {
            novoProduto.nome = nome;
        } 
        if(estoque) {
            novoProduto.estoque = estoque;
        }
        if(descricao && descricao.trim()) {
            novoProduto.descricao = descricao;
        }
        if(preco) {
            novoProduto.preco = preco;
        }
        if(imagem && imagem.trim()) {
            novoProduto.imagem = imagem;
        }
        if(categoria && categoria.trim()) {
            novoProduto.categoria = categoria;
        }
        try {
            const produtoEditado = await knex('produtos').where(produto).update(novoProduto);
            return res.status(200).json('Produto editado com sucesso');
        } catch (error) {
            return res.status(400).json(error.message);
        }

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirProduto = async (req, res) => {
    const {usuario} = req;
    const produtoId = req.params.id;
    const produto = {
        id: produtoId,
        usuario_id: usuario.id
    }
    try {
        const produtoRemovido = await knex('produtos').where(produto).first();
        if(!produtoRemovido) {
            return res.status(404).json('Produto não encontrado')
        }
        try {
            removido = await knex('produtos').where(produto).delete();
            if(!removido) {
                return res.status(404).json('erro ao remover produto');
            }
            return res.status(200).json('Produto removido com sucesso!');
        } catch (error) {
            return res.status(400).json(error.message);
        }
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    cadastrarProduto,
    obterProdutos,
    obterUmProduto,
    editarProduto,
    excluirProduto
};