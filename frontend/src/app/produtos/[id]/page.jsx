
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "./detalheProduto.css";

// Produtos de exemplo.
// Depois, podemos centralizar esses dados em um arquivo compartilhado.
const produtos = [
    {
        id: 1,
        nome: "Arduino Uno R3",
        descricao:
            "Placa de desenvolvimento ideal para projetos de eletrônica, automação e robótica. Permite conectar sensores, módulos e diversos componentes eletrônicos.",
        categoria: "Placas de desenvolvimento",
        preco: 59.90,
        imagem: "/imagens/arduino-uno.png",
        etiqueta: "Mais vendido",
        especificacoes: [
            { nome: "Modelo", valor: "Arduino Uno R3" },
            { nome: "Microcontrolador", valor: "ATmega328P" },
            { nome: "Conexão", valor: "USB" },
            { nome: "Aplicação", valor: "Eletrônica e automação" },
        ],
    },
    {
        id: 2,
        nome: "Módulo ESP32",
        descricao:
            "Módulo de desenvolvimento indicado para projetos de IoT, automação residencial e sistemas conectados. Possui recursos de comunicação sem fio.",
        categoria: "Módulos eletrônicos",
        preco: 39.90,
        imagem: "/imagens/esp32.png",
        etiqueta: "Destaque",
        especificacoes: [
            { nome: "Modelo", valor: "ESP32" },
            { nome: "Conectividade", valor: "Wi-Fi e Bluetooth" },
            { nome: "Aplicação", valor: "Internet das Coisas (IoT)" },
            { nome: "Programação", valor: "Compatível com ferramentas de desenvolvimento" },
        ],
    },
];

export default function DetalheProduto() {
    const params = useParams();
    const id = Number(params.id);

    const produto = produtos.find((item) => item.id === id);

    const [quantidade, setQuantidade] = useState(1);

    if (!produto) {
        return (
            <main className="detalhe-pagina">
                <div className="produto-nao-encontrado">
                    <i className="bi bi-exclamation-circle"></i>
                    <h1>Produto não encontrado</h1>
                    <p>Não encontramos esse produto em nosso catálogo.</p>

                    <Link href="/produtos" className="btn-voltar-produtos">
                        Voltar aos produtos
                    </Link>
                </div>
            </main>
        );
    }

    function adicionarAoCarrinho() {
        // Por enquanto, o carrinho ainda não está integrado.
        alert(
            `${quantidade} unidade(s) de "${produto.nome}" selecionada(s). ` +
            "A integração com o carrinho será feita na próxima etapa."
        );
    }

    return (
        <main className="detalhe-pagina">
            <div className="detalhe-container">

                {/* CAMINHO DA PÁGINA */}
                <nav className="detalhe-breadcrumb" aria-label="Navegação">
                    <Link href="/">Home</Link>
                    <i className="bi bi-chevron-right"></i>
                    <Link href="/produtos">Produtos</Link>
                    <i className="bi bi-chevron-right"></i>
                    <span>{produto.nome}</span>
                </nav>

                {/* INFORMAÇÕES PRINCIPAIS */}
                <section className="detalhe-principal">

                    <div className="detalhe-imagem">
                        {produto.etiqueta && (
                            <span className="detalhe-etiqueta">
                                {produto.etiqueta}
                            </span>
                        )}

                        <Image
                            src={produto.imagem}
                            alt={produto.nome}
                            width={600}
                            height={600}
                            className="imagem-produto"
                            priority
                        />
                    </div>

                    <div className="detalhe-informacoes">
                        <span className="detalhe-categoria">
                            {produto.categoria}
                        </span>

                        <h1>{produto.nome}</h1>

                        <div className="detalhe-disponibilidade">
                            <i className="bi bi-check-circle-fill"></i>
                            Produto disponível para demonstração
                        </div>

                        <p className="detalhe-descricao">
                            {produto.descricao}
                        </p>

                        <div className="detalhe-preco">
                            {produto.preco.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            })}
                        </div>

                        <p className="detalhe-observacao">
                            Preço ilustrativo. Disponibilidade e condições
                            serão confirmadas na integração da loja.
                        </p>

                        {/* QUANTIDADE */}
                        <div className="seletor-quantidade">
                            <span>Quantidade</span>

                            <div className="quantidade-controles">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantidade((q) => Math.max(1, q - 1))
                                    }
                                    disabled={quantidade <= 1}
                                    aria-label="Diminuir quantidade"
                                >
                                    <i className="bi bi-dash"></i>
                                </button>

                                <span>{quantidade}</span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantidade((q) => q + 1)
                                    }
                                    aria-label="Aumentar quantidade"
                                >
                                    <i className="bi bi-plus"></i>
                                </button>
                            </div>
                        </div>

                        {/* AÇÕES */}
                        <div className="detalhe-acoes">
                            <button
                                type="button"
                                className="btn-adicionar-carrinho"
                                onClick={adicionarAoCarrinho}
                            >
                                <i className="bi bi-cart-plus"></i>
                                Adicionar ao carrinho
                            </button>

                            <Link
                                href="/carrinho"
                                className="btn-ir-carrinho"
                                aria-label="Ver carrinho"
                            >
                                <i className="bi bi-cart3"></i>
                            </Link>
                        </div>

                        <div className="detalhe-beneficios">
                            <div>
                                <i className="bi bi-truck"></i>
                                <span>Informações de entrega no checkout</span>
                            </div>

                            <div>
                                <i className="bi bi-shield-check"></i>
                                <span>Compra segura após integração</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* DESCRIÇÃO E ESPECIFICAÇÕES */}
                <section className="detalhe-especificacoes">
                    <div className="especificacoes-titulo">
                        <span>CONHEÇA O PRODUTO</span>
                        <h2>Descrição e especificações</h2>
                    </div>

                    <div className="especificacoes-conteudo">
                        <div className="especificacoes-descricao">
                            <h3>Sobre o produto</h3>
                            <p>{produto.descricao}</p>
                            <p>
                                Consulte as características técnicas antes de
                                utilizar o componente em seu projeto.
                            </p>
                        </div>

                        <div className="especificacoes-tabela">
                            {produto.especificacoes.map((item) => (
                                <div
                                    className="especificacao-linha"
                                    key={item.nome}
                                >
                                    <span>{item.nome}</span>
                                    <strong>{item.valor}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="detalhe-voltar">
                    <Link href="/produtos">
                        <i className="bi bi-arrow-left"></i>
                        Voltar para todos os produtos
                    </Link>
                </div>

            </div>
        </main>
    );
}
