import express from 'express';
import * as ProdutoController from '../controllers/ProdutoController.js';
import { uploadImagem } from '../middlewares/uploadMiddleware.js';


// Middlewares de autenticação (serão ativados na Sessão 2)
// Inicialmente passam direto para não travar a Sessão 1
let autenticar = (_req, _res, next) => next();
let autorizarAdmin = (_req, _res, next) => next();


export const produtoRouter = express.Router();


produtoRouter.get('/', ProdutoController.listar);
produtoRouter.get('/categorias', ProdutoController.listarCategorias); // precisa vir antes de "/:id"
produtoRouter.get('/:id', ProdutoController.buscarPorId);
produtoRouter.post('/', (req, res, next) => autenticar(req, res, next), ProdutoController.criar);
produtoRouter.put('/:id', (req, res, next) => autenticar(req, res, next), ProdutoController.atualizar);
produtoRouter.patch('/:id/imagem', (req, res, next) => autenticar(req, res, next), uploadImagem, ProdutoController.enviarImagem);
produtoRouter.delete('/:id', (req, res, next) => autenticar(req, res, next), (req, res, next) => autorizarAdmin(req, res, next), ProdutoController.excluir);

// Função para injetar a segurança na Sessão 2 sem reescrever as rotas
export function configurarSegurancaProdutos(middlewareAuth, middlewareAdmin) {
    // Substitui os middlewares provisórios da Sessão 1 pelos middlewares reais.
    if (middlewareAuth) autenticar = middlewareAuth;
    if (middlewareAdmin) autorizarAdmin = middlewareAdmin;
    }
    