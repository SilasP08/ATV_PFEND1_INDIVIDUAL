
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import "./detalheProduto.css";
import { requisicao, formatarPreco } from "@/lib/api";
import { adicionarAoCarrinho, obterCarrinho } from "@/lib/carrinho";


export default function DetalheProduto() {
    const params = useParams();
    const id = params?.id;

    const [produto, setProduto] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [quantidade, setQuantidade] = useState(1);
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        if (!id) return;
        const controlador = new AbortController();

        setCarregando(true);
        setErro("");

        requisicao(`/api/produtos/${id}`, { signal: controlador.signal })
            .then((data) => setProduto(data.dados))
            .catch((erro) => {
                if (erro.name === "AbortError") return;
                setProduto(null);
                // 404/400 = produto não existe; outros = falha de conexão
                setErro(erro.status === 404 || erro.status === 400 ? "" : erro.message);
            })
            .finally(() => {
                if (!controlador.signal.aborted) setCarregando(false);
            });

        return () => controlador.abort();
    }, [id]);

    if (carregando) {
        return (
            <main className="detalhe-pagina">
                <div className="produto-nao-encontrado">
                    <i className="bi bi-hourglass-split"></i>
                    <h1>Carregando produto...</h1>
                </div>
            </main>
        );
    }

    if (!produto) {
        return (
            <main className="detalhe-pagina">
                <div className="produto-nao-encontrado">
                    <i className="bi bi-exclamation-circle"></i>
                    <h1>{erro ? "Erro ao carregar" : "Produto não encontrado"}</h1>
                    <p>{erro || "Não encontramos esse produto em nosso catálogo."}</p>

                    <Link href="/produtos" className="btn-voltar-produtos">
                        Voltar aos produtos
                    </Link>
                </div>
            </main>
        );
    }

    const estoque = Number(produto.estoque) || 0;
    const disponivel = estoque > 0;

    // Quanto deste produto já está no carrinho (para não passar do estoque)
    const noCarrinho = obterCarrinho().find((item) => item.id === produto.id)?.quantidade || 0;
    const maximoPermitido = Math.max(0, estoque - noCarrinho);

    const especificacoes = [
        { nome: "Código", valor: `#${String(produto.id).padStart(4, "0")}` },
        { nome: "Categoria", valor: produto.categoria },
        { nome: "Disponibilidade", valor: disponivel ? `${estoque} em estoque` : "Esgotado" },
        { nome: "Preço unitário", valor: formatarPreco(produto.preco) },
    ];
    if (produto.etiqueta) {
        especificacoes.push({ nome: "Selo", valor: produto.etiqueta });
    }

    function handleAdicionarAoCarrinho() {
        if (quantidade > maximoPermitido) {
            setMensagem(
                maximoPermitido === 0
                    ? "Você já adicionou todo o estoque disponível deste produto."
                    : `Você pode adicionar no máximo mais ${maximoPermitido} unidade(s).`
            );
            return;
        }

        adicionarAoCarrinho(produto, quantidade);
        setMensagem(`${quantidade} unidade(s) de "${produto.nome}" adicionada(s) ao carrinho.`);
        setQuantidade(1);
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

                        {/* <img> comum porque as imagens vêm de sites externos */}
                        <img
                            src={produto.imagem}
                            alt={produto.nome}
                            width={600}
                            height={600}
                            className="imagem-produto"
                        />
                    </div>

                    <div className="detalhe-informacoes">
                        <span className="detalhe-categoria">
                            {produto.categoria}
                        </span>

                        <h1>{produto.nome}</h1>

                        <div className="detalhe-disponibilidade">
                            {disponivel ? (
                                <>
                                    <i className="bi bi-check-circle-fill"></i>
                                    {estoque <= 5
                                        ? `Últimas ${estoque} unidades!`
                                        : `Em estoque (${estoque} unidades)`}
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-x-circle-fill"></i>
                                    Produto esgotado
                                </>
                            )}
                        </div>

                        <p className="detalhe-descricao">
                            {produto.descricao}
                        </p>

                        <div className="detalhe-preco">
                            {formatarPreco(produto.preco)}
                        </div>

                        <p className="detalhe-observacao">
                            Frete grátis em compras acima de R$ 250,00.
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
                                        setQuantidade((q) => Math.min(Math.max(1, maximoPermitido), q + 1))
                                    }
                                    disabled={quantidade >= maximoPermitido}
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
                                onClick={handleAdicionarAoCarrinho}
                                disabled={!disponivel}
                            >
                                <i className="bi bi-cart-plus"></i>
                                {disponivel ? "Adicionar ao carrinho" : "Indisponível"}
                            </button>

                            <Link
                                href="/carrinho"
                                className="btn-ir-carrinho"
                                aria-label="Ver carrinho"
                            >
                                <i className="bi bi-cart3"></i>
                            </Link>
                        </div>

                        {mensagem && (
                            <p className="mensagem-sucesso" role="status">
                                {mensagem}{" "}
                                <Link href="/carrinho">Ver carrinho</Link>
                            </p>
                        )}

                        <div className="detalhe-beneficios">
                            <div>
                                <i className="bi bi-truck"></i>
                                <span>Informações de entrega no checkout</span>
                            </div>

                            <div>
                                <i className="bi bi-shield-check"></i>
                                <span>Compra segura com login</span>
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
                            {especificacoes.map((item) => (
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
