import { pool } from './ProdutoModels.js';

function hidratarPedido(linha) {
  if (!linha) return null;
  return {
    ...linha,
    id: linha.id_pedido,
    subtotal: Number(linha.subtotal),
    frete: Number(linha.frete),
    total: Number(linha.total)
  };
}

function hidratarItem(linha) {
  return {
    ...linha,
    quantidade: Number(linha.quantidade),
    preco_unitario: Number(linha.preco_unitario)
  };
}

// Executa várias operações em uma única transação:
// se qualquer passo falhar, nada é gravado (ROLLBACK).
export async function executarTransacao(callback) {
  const conexao = await pool.getConnection();
  try {
    await conexao.beginTransaction();
    const resultado = await callback(conexao);
    await conexao.commit();
    return resultado;
  } catch (erro) {
    await conexao.rollback();
    throw erro;
  } finally {
    conexao.release();
  }
}

// Busca os produtos do carrinho travando as linhas (FOR UPDATE)
// para que duas compras ao mesmo tempo não vendam o mesmo estoque.
export async function buscarProdutosParaCompra(conexao, ids) {
  const [linhas] = await conexao.query(
    'SELECT id_produto, nome, preco, estoque FROM produtos WHERE id_produto IN (?) FOR UPDATE',
    [ids]
  );
  return linhas.map((linha) => ({
    ...linha,
    preco: Number(linha.preco),
    estoque: Number(linha.estoque)
  }));
}

export async function baixarEstoque(conexao, idProduto, quantidade) {
  const [resultado] = await conexao.query(
    'UPDATE produtos SET estoque = estoque - ? WHERE id_produto = ? AND estoque >= ?',
    [quantidade, idProduto, quantidade]
  );
  return resultado.affectedRows > 0;
}

export async function inserirPedido(conexao, pedido) {
  const sql = `INSERT INTO pedidos
    (id_usuario, subtotal, frete, total, forma_pagamento, nome_destinatario, cep, endereco, numero, complemento, cidade)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const [resultado] = await conexao.query(sql, [
    pedido.idUsuario,
    pedido.subtotal,
    pedido.frete,
    pedido.total,
    pedido.formaPagamento,
    pedido.entrega.nome,
    pedido.entrega.cep,
    pedido.entrega.endereco,
    pedido.entrega.numero,
    pedido.entrega.complemento,
    pedido.entrega.cidade
  ]);
  return resultado.insertId;
}

export async function inserirItens(conexao, idPedido, itens) {
  const valores = itens.map((item) => [
    idPedido,
    item.id_produto,
    item.nome,
    item.quantidade,
    item.preco
  ]);
  await conexao.query(
    'INSERT INTO itens_pedido (id_pedido, id_produto, nome_produto, quantidade, preco_unitario) VALUES ?',
    [valores]
  );
}

export async function buscarPorId(idPedido) {
  const [linhas] = await pool.query('SELECT * FROM pedidos WHERE id_pedido = ?', [idPedido]);
  if (linhas.length === 0) return null;

  const [itens] = await pool.query(
    'SELECT id_item, id_produto, nome_produto, quantidade, preco_unitario FROM itens_pedido WHERE id_pedido = ?',
    [idPedido]
  );

  return { ...hidratarPedido(linhas[0]), itens: itens.map(hidratarItem) };
}

export async function listarPorUsuario(idUsuario) {
  const [linhas] = await pool.query(
    'SELECT * FROM pedidos WHERE id_usuario = ? ORDER BY criado_em DESC, id_pedido DESC',
    [idUsuario]
  );
  return linhas.map(hidratarPedido);
}
