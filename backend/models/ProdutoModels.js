import * as dbModule from '../config/database.js';


// Suporta tanto o pool exportado diretamente quanto a fábrica criarPool()
const pool = typeof dbModule.criarPool === 'function' ? dbModule.criarPool() : dbModule.pool;


// Exporta o pool para ser reaproveitado (ex.: transações de pedidos)
export { pool };


// Converte a linha do banco para o formato usado no front-end.
// "id" é um apelido de "id_produto" para facilitar o uso nos componentes.
function hidratarProduto(linha) {
  if (!linha) return null;
  return {
    ...linha,
    id: linha.id_produto,
    preco: Number(linha.preco),
    estoque: Number(linha.estoque)
  };
}


// Ordenações permitidas (lista branca: o valor vindo da URL nunca entra direto no SQL)
const ORDENACOES = {
  'padrao': 'id_produto ASC',
  'menor-preco': 'preco ASC',
  'maior-preco': 'preco DESC',
  'nome': 'nome ASC'
};


// Monta o WHERE dinamicamente, sempre com parâmetros (?) para evitar SQL Injection
function montarFiltros({ pesquisa, categoria, etiqueta }) {
  const condicoes = [];
  const valores = [];

  if (pesquisa) {
    condicoes.push('(nome LIKE ? OR descricao LIKE ?)');
    valores.push(`%${pesquisa}%`, `%${pesquisa}%`);
  }

  if (categoria) {
    condicoes.push('categoria = ?');
    valores.push(categoria);
  }

  if (etiqueta === true) {
    // Apenas produtos que possuem alguma etiqueta (usado na Home)
    condicoes.push("etiqueta IS NOT NULL AND etiqueta <> ''");
  } else if (typeof etiqueta === 'string') {
    condicoes.push('etiqueta = ?');
    valores.push(etiqueta);
  }

  const where = condicoes.length > 0 ? `WHERE ${condicoes.join(' AND ')}` : '';
  return { where, valores };
}


// 1. Listagem com filtros, ordenação e paginação parametrizada
export async function listar({ limite, offset, pesquisa, categoria, etiqueta, ordenacao = 'padrao' }) {
  const limiteNum = Number.parseInt(limite, 10);
  const offsetNum = Number.parseInt(offset, 10);
  const orderBy = ORDENACOES[ordenacao] || ORDENACOES.padrao;
  const { where, valores } = montarFiltros({ pesquisa, categoria, etiqueta });


  const [linhas] = await pool.query(
    `SELECT * FROM produtos ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
    [...valores, limiteNum, offsetNum]
  );


  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM produtos ${where}`,
    valores
  );


  return {
    produtos: linhas.map(hidratarProduto),
    total: Number(total)
  };
}


// Lista as categorias existentes (útil para montar os botões de filtro)
export async function listarCategorias() {
  const [linhas] = await pool.query('SELECT DISTINCT categoria FROM produtos ORDER BY categoria');
  return linhas.map((linha) => linha.categoria);
}


// 2. Busca por ID
export async function buscarPorId(id) {
  const [linhas] = await pool.query('SELECT * FROM produtos WHERE id_produto = ?', [id]);
  if (linhas.length === 0) return null;
  return hidratarProduto(linhas[0]);
}


// 3. Inserção
export async function criar(produto) {
  const sql = 'INSERT INTO produtos (nome, preco, estoque, categoria) VALUES (?, ?, ?, ?)';
  const valores = [produto.nome, produto.preco, produto.estoque, produto.categoria];
  const [resultado] = await pool.query(sql, valores);
  return { ...produto, id: resultado.insertId, imagem_url: null };
}


// 4. Atualização completa (PUT)
export async function atualizar(id, produto) {
  const sql = 'UPDATE produtos SET nome = ?, preco = ?, estoque = ?, categoria = ? WHERE id_produto = ?';
  const valores = [produto.nome, produto.preco, produto.estoque, produto.categoria, id];
  const [resultado] = await pool.query(sql, valores);
  return resultado.affectedRows > 0;
}


// 5. Atualizar URL da imagem (PATCH)
export async function atualizarImagem(id, imagemUrl) {
  const sql = 'UPDATE produtos SET imagem = ? WHERE id_produto = ?';
  const [resultado] = await pool.query(sql, [imagemUrl, id]);
  return resultado.affectedRows > 0;
}


// 6. Remoção (DELETE)
export async function excluir(id) {
  const [resultado] = await pool.query('DELETE FROM produtos WHERE id_produto = ?', [id]);
  return resultado.affectedRows > 0;
}
