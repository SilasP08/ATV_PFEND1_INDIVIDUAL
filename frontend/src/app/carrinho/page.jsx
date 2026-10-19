
"use client";

import { useState } from "react";
import Link from "next/link";
import "./carrinho.css";

const produtosIniciais = [
    {
        id: 1,
        nome: "Arduino Uno R3",
        categoria: "Placas e microcontroladores",
        preco: 89.90,
        quantidade: 1,
        simbolo: "⌘",
    },
    {
        id: 2,
        nome: "Kit Resistor 1/4W",
        categoria: "Componentes eletrônicos",
        preco: 24.90,
        quantidade: 2,
        simbolo: "▤",
    },
    {
        id: 3,
        nome: "Protoboard 830 pontos",
        categoria: "Prototipagem",
        preco: 32.50,
        quantidade: 1,
        simbolo: "▦",
    },
];

export default function Carrinho() {
    const [produtos, setProdutos] = useState(produtosIniciais);

    const quantidadeTotal = produtos.reduce(
        (total, produto) => total + produto.quantidade,
        0
    );

    const subtotal = produtos.reduce(
        (total, produto) =>
            total + produto.preco * produto.quantidade,
        0
    );

    const frete = subtotal === 0 || subtotal >= 250 ? 0 : 15.90;
    const total = subtotal + frete;

    function alterarQuantidade(id, variacao) {
        setProdutos((listaAtual) =>
            listaAtual.map((produto) =>
                produto.id === id
                    ? {...produto, quantidade: Math.max(1, produto.quantidade + variacao)}
                    : produto
            )
        );
    }

    function removerProduto(id) {
        setProdutos((listaAtual) =>
            listaAtual.filter((produto) => produto.id !== id)
        );
    }

    function limparCarrinho() {
        setProdutos([]);
    }

    return (
        <main className="carrinho-page">
            <div className="container carrinho-container">

                {/* Cabeçalho */}
                <section className="carrinho-header">
                    <div>
                        <span className="carrinho-tag">
                            HOUSE ELECTRIC / COMPRAS
                        </span>

                        <h1>
                            Meu <span>carrinho.</span>
                        </h1>

                        <p>
                            Confira seus produtos antes de continuar.
                        </p>
                    </div>

                    <div className="carrinho-contador">
                        <span className="contador-icon">🛒</span>

                        <div>
                            <strong>{quantidadeTotal}</strong>
                            <span>
                                {quantidadeTotal === 1
                                    ? "item no carrinho"
                                    : "itens no carrinho"}
                            </span>
                        </div>
                    </div>
                </section>

                {produtos.length > 0 ? (
                    <div className="row g-4">

                        {/* Lista de produtos */}
                        <section className="col-lg-8">
                            <div className="carrinho-lista-header">
                                <h2>Seus produtos</h2>

                                <button
                                    type="button"
                                    className="limpar-carrinho"
                                    onClick={limparCarrinho}
                                >
                                    Limpar carrinho
                                </button>
                            </div>

                            <div className="carrinho-lista">
                                {produtos.map((produto) => (
                                    <article
                                        className="carrinho-item"
                                        key={produto.id}
                                    >
                                        <div className="produto-visual">
                                            <span>{produto.simbolo}</span>
                                        </div>

                                        <div className="produto-info">
                                            <span className="produto-categoria">
                                                {produto.categoria}
                                            </span>

                                            <h3>{produto.nome}</h3>

                                            <p>
                                                {formatarPreco(produto.preco)}
                                                <span> / unidade</span>
                                            </p>

                                            <button
                                                type="button"
                                                className="produto-remover mobile-remover"
                                                onClick={() =>
                                                    removerProduto(produto.id)
                                                }
                                            >
                                                Remover
                                            </button>
                                        </div>

                                        <div className="produto-controles">
                                            <span className="quantidade-label">
                                                Quantidade
                                            </span>

                                            <div className="quantidade-controle">
                                                <button
                                                    type="button"
                                                    aria-label={`Diminuir quantidade de ${produto.nome}`}
                                                    disabled={produto.quantidade <= 1}
                                                    onClick={() =>
                                                        alterarQuantidade(
                                                            produto.id,
                                                            -1
                                                        )
                                                    }
                                                >
                                                    −
                                                </button>

                                                <span>
                                                    {produto.quantidade}
                                                </span>

                                                <button
                                                    type="button"
                                                    aria-label={`Aumentar quantidade de ${produto.nome}`}
                                                    onClick={() =>
                                                        alterarQuantidade(
                                                            produto.id,
                                                            1
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className="produto-total">
                                            <strong>
                                                {formatarPreco(
                                                    produto.preco *
                                                    produto.quantidade
                                                )}
                                            </strong>

                                            <button
                                                type="button"
                                                className="produto-remover desktop-remover"
                                                onClick={() =>
                                                    removerProduto(produto.id)
                                                }
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <Link
                                href="/produtos"
                                className="continuar-comprando"
                            >
                                <span>←</span>
                                Continuar comprando
                            </Link>
                        </section>

                        {/* Resumo */}
                        <aside className="col-lg-4">
                            <div className="resumo-carrinho">
                                <span className="resumo-tag">
                                    RESUMO DO PEDIDO
                                </span>

                                <h2>Resumo da compra</h2>

                                <div className="resumo-linha">
                                    <span>
                                        Subtotal ({quantidadeTotal}{" "}
                                        {quantidadeTotal === 1
                                            ? "item"
                                            : "itens"})
                                    </span>

                                    <strong>
                                        {formatarPreco(subtotal)}
                                    </strong>
                                </div>

                                <div className="resumo-linha">
                                    <span>Frete estimado</span>

                                    <strong className={frete === 0 ? "frete-gratis" : ""}>
                                        {frete === 0
                                            ? "Grátis"
                                            : formatarPreco(frete)}
                                    </strong>
                                </div>

                                {subtotal > 0 && subtotal < 250 && (
                                    <p className="aviso-frete">
                                        Faltam {formatarPreco(250 - subtotal)}
                                        {" "}para obter frete grátis.
                                    </p>
                                )}

                                {subtotal >= 250 && (
                                    <p className="aviso-frete">
                                        Você ganhou frete grátis!
                                    </p>
                                )}

                                <div className="resumo-separador"></div>

                                <div className="resumo-total">
                                    <span>Total</span>
                                    <strong>{formatarPreco(total)}</strong>
                                </div>

                                <span className="resumo-observacao">
                                    Frete e condições sujeitos à confirmação.
                                </span>

                                <button
                                    type="button"
                                    className="finalizar-compra"
                                    onClick={() =>
                                        alert(
                                            "A finalização da compra será implementada na próxima etapa."
                                        )
                                    }
                                >
                                    Finalizar compra
                                    <span>→</span>
                                </button>

                                <div className="compra-segura">
                                    <span>✓</span>
                                    <p>
                                        Sua próxima etapa de compra começa aqui.
                                    </p>
                                </div>
                            </div>
                        </aside>
                    </div>
                ) : (
                    /* Carrinho vazio */
                    <section className="carrinho-vazio">
                        <div className="carrinho-vazio-icon">🛒</div>

                        <h2>Seu carrinho está vazio</h2>

                        <p>
                            Parece que você ainda não adicionou
                            nenhum produto.
                        </p>

                        <Link href="/produtos" className="sobre-btn">
                            Explorar produtos
                            <span>→</span>
                        </Link>
                    </section>
                )}

            </div>
        </main>
    );
}
