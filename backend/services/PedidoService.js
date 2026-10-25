import * as PedidoModel from '../models/PedidoModel.js';

// Mesmas regras de frete exibidas no carrinho do front-end
export const FRETE_PADRAO = 15.9;
export const FRETE_GRATIS_A_PARTIR_DE = 250;

const FORMAS_PAGAMENTO = ['pix', 'cartao', 'boleto'];
const REGEX_CEP = /^\d{5}-?\d{3}$/;

function criarErro(mensagem, status) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

function arredondar(valor) {
  return Math.round(valor * 100) / 100;
}

export function calcularFrete(subtotal) {
  return subtotal === 0 || subtotal >= FRETE_GRATIS_A_PARTIR_DE ? 0 : FRETE_PADRAO;
}

function textoObrigatorio(valor, campo, maximo) {
  const limpo = typeof valor === 'string' ? valor.trim() : '';
  if (limpo === '') {
    throw new TypeError(`O campo "${campo}" é obrigatório.`);
  }
  if (limpo.length > maximo) {
    throw new TypeError(`O campo "${campo}" deve ter no máximo ${maximo} caracteres.`);
  }
  return limpo;
}

function validarEntrega(entrega = {}) {
  const cep = textoObrigatorio(entrega.cep, 'CEP', 9);
  if (!REGEX_CEP.test(cep)) {
    throw new TypeError('Informe um CEP válido (ex.: 01001-000).');
  }

  const complemento = typeof entrega.complemento === 'string' ? entrega.complemento.trim() : '';
  if (complemento.length > 100) {
    throw new TypeError('O complemento deve ter no máximo 100 caracteres.');
  }

  return {
    nome: textoObrigatorio(entrega.nome, 'Nome completo', 100),
    cep: cep.replace(/^(\d{5})-?(\d{3})$/, '$1-$2'),
    endereco: textoObrigatorio(entrega.endereco, 'Endereço', 150),
    numero: textoObrigatorio(entrega.numero, 'Número', 10),
    complemento: complemento || null,
    cidade: textoObrigatorio(entrega.cidade, 'Cidade e estado', 100)
  };
}

// Junta itens repetidos e valida id/quantidade de cada um
function validarItens(itens) {
  if (!Array.isArray(itens) || itens.length === 0) {
    throw new TypeError('O carrinho está vazio.');
  }

  const quantidades = new Map();
  for (const item of itens) {
    const id = Number(item?.id);
    const quantidade = Number(item?.quantidade);

    if (!Number.isInteger(id) || id <= 0) {
      throw new TypeError('Há um produto inválido no carrinho.');
    }
    if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 99) {
      throw new TypeError('A quantidade de cada produto deve ser entre 1 e 99.');
    }

    quantidades.set(id, (quantidades.get(id) || 0) + quantidade);
  }
  return quantidades;
}

// Cria o pedido. O preço vem SEMPRE do banco (nunca confiamos no preço enviado pelo navegador).
export async function criar(idUsuario, { itens, entrega, formaPagamento } = {}) {
  const quantidades = validarItens(itens);
  const dadosEntrega = validarEntrega(entrega);

  if (!FORMAS_PAGAMENTO.includes(formaPagamento)) {
    throw new TypeError('Escolha uma forma de pagamento válida: PIX, cartão ou boleto.');
  }

  const idPedido = await PedidoModel.executarTransacao(async (conexao) => {
    const ids = [...quantidades.keys()];
    const produtos = await PedidoModel.buscarProdutosParaCompra(conexao, ids);

    if (produtos.length !== ids.length) {
      throw criarErro('Um ou mais produtos do carrinho não existem mais.', 404);
    }

    const itensDoPedido = produtos.map((produto) => {
      const quantidade = quantidades.get(produto.id_produto);
      if (quantidade > produto.estoque) {
        throw criarErro(
          `Estoque insuficiente para "${produto.nome}". Disponível: ${produto.estoque}.`,
          409
        );
      }
      return { ...produto, quantidade };
    });

    for (const item of itensDoPedido) {
      const baixou = await PedidoModel.baixarEstoque(conexao, item.id_produto, item.quantidade);
      if (!baixou) {
        throw criarErro(`Estoque insuficiente para "${item.nome}".`, 409);
      }
    }

    const subtotal = arredondar(
      itensDoPedido.reduce((soma, item) => soma + item.preco * item.quantidade, 0)
    );
    const frete = calcularFrete(subtotal);
    const total = arredondar(subtotal + frete);

    const novoId = await PedidoModel.inserirPedido(conexao, {
      idUsuario,
      subtotal,
      frete,
      total,
      formaPagamento,
      entrega: dadosEntrega
    });

    await PedidoModel.inserirItens(conexao, novoId, itensDoPedido);
    return novoId;
  });

  return await PedidoModel.buscarPorId(idPedido);
}

export async function listarDoUsuario(idUsuario) {
  return await PedidoModel.listarPorUsuario(idUsuario);
}

export async function buscarPorId(idRecebido, idUsuario) {
  const id = Number(idRecebido);
  if (!Number.isInteger(id) || id <= 0) {
    throw new TypeError('ID do pedido deve ser um número inteiro positivo.');
  }

  const pedido = await PedidoModel.buscarPorId(id);
  // Cada usuário só pode ver os próprios pedidos
  if (!pedido || pedido.id_usuario !== idUsuario) {
    throw criarErro(`Pedido ${id} não encontrado.`, 404);
  }
  return pedido;
}
