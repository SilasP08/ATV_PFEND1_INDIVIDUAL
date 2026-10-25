import * as dbModule from '../config/database.js';

const pool = typeof dbModule.criarPool === 'function' ? dbModule.criarPool() : dbModule.pool;

// A tabela "usuarios" usa as colunas id_usuario, senha e tipo.
// Os apelidos (AS) mantêm os nomes que o AuthService já usa: id, senha_hash e perfil.
export async function buscarPorEmail(email) {
  const [linhas] = await pool.query(
    'SELECT id_usuario AS id, nome, email, senha AS senha_hash, tipo AS perfil FROM usuarios WHERE email = ?',
    [email]
  );
  return linhas[0] || null;
}

export async function buscarPorId(id) {
  const [linhas] = await pool.query(
    'SELECT id_usuario AS id, nome, email, telefone, tipo AS perfil FROM usuarios WHERE id_usuario = ?',
    [id]
  );
  return linhas[0] || null;
}

export async function criar({ nome, email, senhaHash, telefone = null, perfil = 'cliente' }) {
  const sql = 'INSERT INTO usuarios (nome, email, senha, telefone, tipo) VALUES (?, ?, ?, ?, ?)';
  const [resultado] = await pool.query(sql, [nome, email, senhaHash, telefone, perfil]);
  return {
    id: resultado.insertId,
    nome,
    email,
    perfil
  };
}
