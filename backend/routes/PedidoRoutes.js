import express from 'express';
import * as PedidoController from '../controllers/PedidoController.js';
import { autenticar } from '../middlewares/AuthMiddleware.js';

export const pedidoRouter = express.Router();

// Todas as rotas de pedido exigem login
pedidoRouter.use(autenticar);

pedidoRouter.post('/', PedidoController.criar);
pedidoRouter.get('/', PedidoController.listarMeus);
pedidoRouter.get('/:id', PedidoController.buscarPorId);
