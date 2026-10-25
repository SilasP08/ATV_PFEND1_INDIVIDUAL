import * as PedidoService from '../services/PedidoService.js';

function responderErro(erro, res, next) {
  if (erro instanceof TypeError) {
    return res.status(422).json({ sucesso: false, erro: erro.message });
  }
  if ([401, 403, 404, 409].includes(erro.status)) {
    return res.status(erro.status).json({ sucesso: false, erro: erro.message });
  }
  return next(erro);
}

export async function criar(req, res, next) {
  try {
    const pedido = await PedidoService.criar(req.usuario.id, req.body);
    return res.status(201).json({ sucesso: true, dados: pedido });
  } catch (erro) {
    return responderErro(erro, res, next);
  }
}

export async function listarMeus(req, res, next) {
  try {
    const pedidos = await PedidoService.listarDoUsuario(req.usuario.id);
    return res.status(200).json({ sucesso: true, dados: pedidos });
  } catch (erro) {
    return responderErro(erro, res, next);
  }
}

export async function buscarPorId(req, res, next) {
  try {
    const pedido = await PedidoService.buscarPorId(req.params.id, req.usuario.id);
    return res.status(200).json({ sucesso: true, dados: pedido });
  } catch (erro) {
    return responderErro(erro, res, next);
  }
}
