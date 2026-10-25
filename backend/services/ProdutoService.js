import Produto from '../models/Produto.js';
import * as ProdutoModel from '../models/ProdutoModels.js';


function validarId(idRecebido) {
  const id = Number(idRecebido);
  if (!Number.isInteger(id) || id <= 0) {
    throw new TypeError('ID deve ser um número inteiro positivo.');
  }
  return id;
}


const ORDENACOES_VALIDAS = ['padrao', 'menor-preco', 'maior-preco', 'nome'];

// Limpa um texto vindo da query string (ou devolve undefined se estiver vazio)
function textoOpcional(valor) {
  if (typeof valor !== 'string') return undefined;
  const limpo = valor.trim();
  return limpo === '' ? undefined : limpo;
}


// Filtros aceitos na URL:
//   ?pagina=1&limite=10 (ou limit=10)
//   &pesquisa=arduino          -> busca no nome/descrição
//   &categoria=Sensores        -> categoria exata
//   &ordenacao=menor-preco     -> padrao | menor-preco | maior-preco | nome
//   &etiqueta=true             -> só produtos com etiqueta (ou etiqueta=OFERTA para uma específica)
export async function listar({ pagina = 1, limite, limit, pesquisa, categoria, ordenacao, etiqueta } = {}) {
  const paginaNum = Number(pagina);
  const limiteNum = Number(limite ?? limit ?? 10);


  if (!Number.isInteger(paginaNum) || paginaNum <= 0) {
    throw new TypeError('Página deve ser um número inteiro positivo.');
  }
  if (!Number.isInteger(limiteNum) || limiteNum < 1 || limiteNum > 100) {
    throw new TypeError('Limite deve ser um inteiro entre 1 e 100.');
  }

  const ordenacaoLimpa = textoOpcional(ordenacao) || 'padrao';
  if (!ORDENACOES_VALIDAS.includes(ordenacaoLimpa)) {
    throw new TypeError(`Ordenação inválida. Use: ${ORDENACOES_VALIDAS.join(', ')}.`);
  }

  const pesquisaLimpa = textoOpcional(pesquisa);
  if (pesquisaLimpa && pesquisaLimpa.length > 100) {
    throw new TypeError('A pesquisa deve ter no máximo 100 caracteres.');
  }

  const categoriaLimpa = textoOpcional(categoria);
  const categoriaFinal = categoriaLimpa && categoriaLimpa.toLowerCase() !== 'todas' ? categoriaLimpa : undefined;

  let etiquetaFinal;
  const etiquetaLimpa = textoOpcional(etiqueta);
  if (etiquetaLimpa === 'true' || etiquetaLimpa === '1') {
    etiquetaFinal = true;
  } else if (etiquetaLimpa && etiquetaLimpa !== 'false' && etiquetaLimpa !== '0') {
    etiquetaFinal = etiquetaLimpa.toUpperCase();
  }


  const offset = (paginaNum - 1) * limiteNum;
  const { produtos, total } = await ProdutoModel.listar({
    limite: limiteNum,
    offset,
    pesquisa: pesquisaLimpa,
    categoria: categoriaFinal,
    etiqueta: etiquetaFinal,
    ordenacao: ordenacaoLimpa
  });


  return {
    produtos,
    paginacao: {
      pagina: paginaNum,
      limite: limiteNum,
      total,
      totalPaginas: Math.ceil(total / limiteNum)
    }
  };
}


export async function listarCategorias() {
  return await ProdutoModel.listarCategorias();
}


export async function buscarPorId(idRecebido) {
  const id = validarId(idRecebido);
  const produto = await ProdutoModel.buscarPorId(id);
  if (!produto) {
    throw new Error(`Produto ${id} não encontrado.`);
  }
  return produto;
}


export async function criar(dados) {
  const produtoDominio = new Produto({ id: 1, ...dados });
  return await ProdutoModel.criar(produtoDominio);
}


export async function atualizar(idRecebido, dados) {
  const id = validarId(idRecebido);
  const produtoDominio = new Produto({ id, ...dados });
  const atualizou = await ProdutoModel.atualizar(id, produtoDominio);
  if (!atualizou) {
    throw new Error(`Produto ${id} não encontrado.`);
  }
  return await ProdutoModel.buscarPorId(id);
}


export async function salvarImagem(idRecebido, imagemUrl) {
  const id = validarId(idRecebido);
  const atualizou = await ProdutoModel.atualizarImagem(id, imagemUrl);
  if (!atualizou) {
    throw new Error(`Produto ${id} não encontrado.`);
  }
  return await ProdutoModel.buscarPorId(id);
}


export async function excluir(idRecebido) {
  const id = validarId(idRecebido);
  const removeu = await ProdutoModel.excluir(id);
  if (!removeu) {
    throw new Error(`Produto ${id} não encontrado.`);
  }
}
