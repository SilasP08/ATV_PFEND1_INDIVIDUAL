INSERT INTO produtos (nome, descricao, categoria, preco, imagem, estoque, etiqueta) VALUES
('Arduino Uno R3', 'Placa de desenvolvimento para projetos eletrônicos.', 'Placas e módulos', 59.90, '/imagens/arduino-uno.png', 20, 'MAIS VENDIDO'),
('ESP32 Wi-Fi Bluetooth', 'Placa de desenvolvimento com Wi-Fi e Bluetooth integrados.', 'Placas e módulos', 39.90, '/imagens/esp32.png', 30, 'DESTAQUE'),
('Sensor Ultrassônico HC-SR04', 'Sensor utilizado para medir distâncias em projetos eletrônicos.', 'Sensores', 18.90, '/imagens/sensor.png', 15, NULL),
('Kit de Resistores', 'Kit com resistores variados para montagem de circuitos.', 'Componentes', 19.90, '/imagens/kit-resistores.png', 40, NULL),
('Protoboard 830 pontos', 'Placa para montagem e testes de circuitos sem solda.', 'Componentes', 29.90, '/imagens/protoboard.png', 25, NULL),
('Multímetro Digital', 'Equipamento para medir tensão, corrente e resistência.', 'Ferramentas', 49.90, '/imagens/multimetro.png', 12, 'OFERTA'),
('Kit de Jumpers', 'Conjunto de fios para conexões em protoboards.', 'Componentes', 12.90, '/imagens/jumpers.png', 50, NULL),
('Sensor de Temperatura DHT11', 'Sensor digital para medir temperatura e umidade.', 'Sensores', 14.90, '/imagens/dht11.png', 18, NULL);

INSERT INTO usuarios (nome, email, senha, telefone, tipo) VALUES
('João Silva', 'joao@email.com', 'hash_senha_joao', '(11) 99999-1111', 'cliente'),
('Maria Santos', 'maria@email.com', 'hash_senha_maria', '(11) 98888-2222', 'cliente'),
('Pedro Oliveira', 'pedro@email.com', 'hash_senha_pedro', '(11) 97777-3333', 'cliente'),
('Administrador', 'admin@houseelectric.com', 'hash_senha_admin', '(11) 96666-4444', 'admin');