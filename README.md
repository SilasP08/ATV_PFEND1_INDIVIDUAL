# ⚡ House Electric

Loja virtual de componentes eletrônicos: placas, sensores, componentes e ferramentas para projetos de eletrônica e Arduino.

Projeto individual da disciplina **Programação Front-End 01**, com front-end em **Next.js** integrado a uma API em **Node.js + Express** e banco de dados **MySQL**.

---

## 📌 Funcionalidades

- **Home** com os produtos em destaque, que são os que têm etiqueta (*MAIS VENDIDO*, *DESTAQUE*, *OFERTA*).
- **Catálogo de produtos** com pesquisa por nome, filtro por categoria e ordenação por preço ou nome. Os filtros são processados no back-end.
- **Página de cada produto** com descrição, preço, estoque disponível e seletor de quantidade.
- **Carrinho de compras** salvo no navegador, com alteração de quantidade, remoção de itens e cálculo de frete (grátis acima de R$ 250,00).
- **Cadastro e login** de usuários, com senha criptografada (bcrypt) e autenticação por token JWT.
- **Finalização da compra**: só usuários logados podem comprar. O endereço é preenchido automaticamente pelo CEP (ViaCEP), o back-end confere preços e estoque, dá baixa no estoque e registra o pedido.
- Interface responsiva, que funciona no computador e no celular.

---

## 🛠️ Tecnologias

| Camada | Tecnologias |
|---|---|
| Front-end | Next.js (App Router), React, Bootstrap, Bootstrap Icons |
| Back-end | Node.js, Express, mysql2, bcryptjs, jsonwebtoken, helmet, cors, multer |
| Banco de dados | MySQL / MariaDB (ex.: XAMPP) |

---

## 📁 Estrutura do projeto

```
ATV_PFEND1_INDIVIDUAL/
├── backend/
│   ├── config/          # leitura do .env e conexão com o banco
│   ├── controllers/     # recebem a requisição e devolvem a resposta
│   ├── middlewares/     # autenticação (JWT) e upload de imagens
│   ├── migrations/      # scripts SQL de criação e carga do banco
│   ├── models/          # consultas ao banco (SQL)
│   ├── routes/          # definição dos endpoints
│   ├── services/        # regras de negócio e validações
│   ├── app.js           # configuração do Express
│   └── server.js        # inicia o servidor
│
└── frontend/
    └── src/
        ├── app/         # páginas (home, produtos, produto, carrinho, login, cadastro, pagamento, sobre)
        ├── components/  # Header, Footer e CardProduto
        └── lib/         # funções compartilhadas: chamadas à API, sessão e carrinho
```

---

## 🚀 Como rodar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) 20 ou superior
- MySQL ou MariaDB rodando (por exemplo, pelo XAMPP)

### 1. Banco de dados

1. Crie o banco:
   ```sql
   CREATE DATABASE loja_eletric;
   ```
2. Execute os scripts da pasta `backend/migrations` **nesta ordem**:
   1. `20261023_1412_criação_das_tabelas.sql`
   2. `20261023_1418_inserts_das_tabelas_usuario_produtos.sql`
   3. `20261023_1446_upadete_das_imagens_da_tabela_produtos.sql`
   4. `20261025_1700_criacao_tabelas_pedidos.sql`

### 2. Back-end (API)

```bash
cd backend
npm install
```

Crie o arquivo `backend/.env` usando o `.env.example` como modelo:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=loja_eletric
JWT_SECRET=troque-por-uma-chave-secreta-longa
CORS_ORIGENS=http://localhost:3000
```

> A API precisa rodar na porta **3001**, porque é a porta que o front-end usa.

Inicie a API:

```bash
npm run dev
```

A API fica disponível em `http://localhost:3001`. Para testar, acesse `http://localhost:3001/api/check`.

### 3. Front-end

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Acesse **http://localhost:3000**.

> Para usar a loja, crie uma conta pela tela **Cadastrar**. Os usuários de exemplo do script de inserts foram criados com senhas fictícias e não conseguem fazer login.

---

## 🔌 Endpoints da API

### Produtos

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/produtos` | Lista produtos com filtros e paginação |
| GET | `/api/produtos/categorias` | Lista as categorias existentes |
| GET | `/api/produtos/:id` | Detalhes de um produto |

**Filtros aceitos em `GET /api/produtos`:**

| Parâmetro | Exemplo | O que faz |
|---|---|---|
| `pesquisa` | `?pesquisa=arduino` | Busca no nome e na descrição |
| `categoria` | `?categoria=Sensores` | Filtra por categoria |
| `ordenacao` | `?ordenacao=menor-preco` | `padrao`, `menor-preco`, `maior-preco` ou `nome` |
| `etiqueta` | `?etiqueta=true` | Só produtos com etiqueta (usado na home) |
| `pagina` / `limite` | `?pagina=1&limite=10` | Paginação (limite de 1 a 100) |

### Autenticação

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/registrar` | Cadastra um usuário (`nome`, `email`, `senha`) |
| POST | `/api/auth/login` | Faz login e devolve o token JWT |
| GET | `/api/auth/perfil` | Dados do usuário logado 🔒 |

A senha precisa ter **no mínimo 8 caracteres**, com letra maiúscula, letra minúscula, número e símbolo.

### Pedidos 🔒

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/pedidos` | Cria um pedido a partir do carrinho |
| GET | `/api/pedidos` | Lista os pedidos do usuário logado |
| GET | `/api/pedidos/:id` | Detalhes de um pedido do usuário |

🔒 = precisa enviar o cabeçalho `Authorization: Bearer <token>`.

**Exemplo de corpo para `POST /api/pedidos`:**

```json
{
  "itens": [
    { "id": 1, "quantidade": 2 },
    { "id": 3, "quantidade": 1 }
  ],
  "entrega": {
    "nome": "Fulano da Silva",
    "cep": "01001-000",
    "endereco": "Praça da Sé",
    "numero": "100",
    "complemento": "",
    "cidade": "São Paulo - SP"
  },
  "formaPagamento": "pix"
}
```

O preço de cada produto é sempre buscado no banco pelo back-end. Valores enviados pelo navegador não são usados no cálculo.

---

## 🔐 Segurança

- Senhas guardadas com **hash bcrypt**, nunca em texto puro.
- Autenticação com **token JWT** válido por 2 horas.
- Consultas SQL **parametrizadas**, o que protege contra SQL Injection.
- **Helmet** e **CORS** configurados na API.
- Os pedidos usam **transação**: se algum passo falhar, nada é gravado, e o estoque nunca fica negativo.

---

## 👤 Autor

**Seu nome aqui** · ADS · Programação Front-End 01
