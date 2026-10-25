use loja_eletric;

CREATE TABLE produtos (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(100) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    imagem VARCHAR(255),
    estoque INT NOT NULL DEFAULT 0,
    etiqueta VARCHAR(50),

    CONSTRAINT chk_produto_preco CHECK (preco >= 0),

    CONSTRAINT chk_produto_estoque CHECK (estoque >= 0)
);

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    tipo ENUM('cliente', 'admin') NOT NULL DEFAULT 'cliente'
);