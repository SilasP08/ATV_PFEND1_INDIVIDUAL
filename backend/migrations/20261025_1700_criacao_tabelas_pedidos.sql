use loja_eletric;

-- Pedidos feitos pelos usuários na página de compras (pagamento)
CREATE TABLE pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    frete DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    forma_pagamento ENUM('pix', 'cartao', 'boleto') NOT NULL,
    status ENUM('aguardando_pagamento', 'pago', 'enviado', 'cancelado') NOT NULL DEFAULT 'aguardando_pagamento',

    nome_destinatario VARCHAR(100) NOT NULL,
    cep VARCHAR(9) NOT NULL,
    endereco VARCHAR(150) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    complemento VARCHAR(100),
    cidade VARCHAR(100) NOT NULL,

    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pedido_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    CONSTRAINT chk_pedido_total CHECK (total >= 0)
);

-- Itens de cada pedido (guarda nome e preço do momento da compra)
CREATE TABLE itens_pedido (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_produto INT NULL,
    nome_produto VARCHAR(150) NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,

    CONSTRAINT fk_item_pedido FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    CONSTRAINT fk_item_produto FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE SET NULL,
    CONSTRAINT chk_item_quantidade CHECK (quantidade > 0)
);
