
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./carrinho.css";
import { formatarPreco } from "@/lib/api";
import { estaLogado } from "@/lib/sessao";
import {
    obterCarrinho,
    alterarQuantidade as alterarQuantidadeCarrinho,
    removerDoCarrinho,
    limparCarrinho as limparCarrinhoSalvo,
    calcularResumo,
    FRETE_GRATIS_A_PARTIR_DE,
    EVENTO_CARRINHO,
} from "@/lib/carrinho";

export default function Carrinho() {
    const router = useRouter();
    const [produtos, setProdutos] = useState([]);
    const [carregado, setCarregado] = useState(false);

    // Lê o carrinho salvo no navegador e acompanha mudanças (ex.: outra aba)
    useEffect(() => {
        function atualizar() {
            setProdutos(obterCarrinho());
        }
        atualizar();
        setCarregado(true);

        window.addEventListener(EVENTO_CARRINHO, atualizar);
        window.addEventListener("storage", atualizar);
        return () => {
            window.removeEventListener(EVENTO_CARRINHO, atualizar);
            window.removeEventListener("storage", atualizar);
        };
    }, []);

    const { quantidadeTotal, subtotal, frete, total } = calcularResumo(produtos);

    function alterarQuantidade(id, variacao) {
        const item = produtos.find((produto) => produto.id === id);
        if (!item) return;
        setProdutos(alterarQuantidadeCarrinho(id, item.quantidade + variacao));
    }

    function removerProduto(id) {
        setProdutos(removerDoCarrinho(id));
    }

    function limparCarrinho() {
        setProdutos(limparCarrinhoSalvo());
    }

    function finalizarCompra() {
        // Para comprar é preciso estar logado; depois do login volta para o pagamento
        if (!estaLogado()) {
            router.push("/login?redirect=/pagamento");
            return;
        }
        router.push("/pagamento");
    }

    if (!carregado) {
        return <main className="carrinho-page" />;
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
                                            {produto.imagem ? (
                                                <img src={produto.imagem} alt={produto.nome} />
                                            ) : (
                                                <span>⌘</span>
                                            )}
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
                                                    disabled={Number.isFinite(produto.estoque) && produto.quantidade >= produto.estoque}
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

                                {subtotal > 0 && subtotal < FRETE_GRATIS_A_PARTIR_DE && (
                                    <p className="aviso-frete">
                                        Faltam {formatarPreco(FRETE_GRATIS_A_PARTIR_DE - subtotal)}
                                        {" "}para obter frete grátis.
                                    </p>
                                )}

                                {subtotal >= FRETE_GRATIS_A_PARTIR_DE && (
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
                                    onClick={finalizarCompra}
                                >
                                    Finalizar compra
                                    <span>→</span>
                                </button>

                                <div className="compra-segura">
                                    <span>✓</span>
                                    <p>
                                        Você precisa estar logado para finalizar a compra.
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
