
"use client";

import { useState, useEffect } from "react";
import CardProduto from "@/components/cardProduto";
import "./produtos.css";


const categorias = [
    "Todas",
    "Placas e módulos",
    "Sensores",
    "Componentes",
    "Ferramentas",
];

export default function Produtos() {


    const [produtos, setProdutos] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todas");
    const [ordenacao, setOrdenacao] = useState("padrao");

    useEffect(() => {
        fetch('http://localhost:3001/api/produtos?limit=10')
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setProdutos(data.dados);
            })

    }, [])
    
    const produtosFiltrados = produtos
        .filter((produto) => {
            const nome = (produto.nome ?? "").toLowerCase();

            const correspondePesquisa = nome.includes(
                pesquisa.toLowerCase()
            );

            const correspondeCategoria =
                categoriaSelecionada === "Todas" ||
                produto.categoria === categoriaSelecionada;

            return correspondePesquisa && correspondeCategoria;
        })
        .sort((a, b) => {
            const precoA = Number(a.preco);
            const precoB = Number(b.preco);

            if (ordenacao === "menor-preco") {
                return precoA - precoB;
            }

            if (ordenacao === "maior-preco") {
                return precoB - precoA;
            }

            if (ordenacao === "nome") {
                return (a.nome ?? "").localeCompare(b.nome ?? "");
            }

            return Number(a.id) - Number(b.id);
        });

    return (
        <main className="pagina-produtos">
            <section className="produtos-banner">
                <div className="produtos-banner-conteudo">
                    <span className="produtos-tag">
                        HOUSE ELECTRIC / CATÁLOGO
                    </span>

                    <h1>
                        Encontre os componentes
                        <span> certos para seu projeto.</span>
                    </h1>

                    <p>
                        Explore nossa seleção de componentes, placas,
                        sensores e ferramentas para tirar suas ideias do papel.
                    </p>
                </div>

                <div className="produtos-banner-detalhe">
                    <i className="bi bi-cpu" />
                </div>
            </section>

            <section className="produtos-catalogo">
                <div className="produtos-catalogo-topo">
                    <div>
                        <span className="produtos-tag">NOSSO CATÁLOGO</span>
                        <h2>Todos os produtos</h2>
                        <p>
                            Encontre o que você precisa para montar seu próximo projeto.
                        </p>
                    </div>

                    <span className="produtos-quantidade">
                        {produtosFiltrados.length}{" "}
                        {produtosFiltrados.length === 1
                            ? "produto encontrado"
                            : "produtos encontrados"}
                    </span>
                </div>

                <div className="produtos-filtros">
                    <div className="produtos-pesquisa">
                        <i className="bi bi-search" />

                        <input
                            type="search"
                            placeholder="Buscar produto..."
                            value={pesquisa}
                            onChange={(e) => setPesquisa(e.target.value)}
                            aria-label="Buscar produtos pelo nome"
                        />
                    </div>

                    <div className="produtos-categorias">
                        {categorias.map((categoria) => (
                            <button
                                key={categoria}
                                type="button"
                                className={
                                    categoriaSelecionada === categoria
                                        ? "categoria-filtro ativo"
                                        : "categoria-filtro"
                                }
                                onClick={() =>
                                    setCategoriaSelecionada(categoria)
                                }
                            >
                                {categoria}
                            </button>
                        ))}
                    </div>

                    <div className="produtos-ordenacao">
                        <label htmlFor="ordenacao">Ordenar por:</label>

                        <select
                            id="ordenacao"
                            value={ordenacao}
                            onChange={(e) => setOrdenacao(e.target.value)}
                        >
                            <option value="padrao">Padrão</option>
                            <option value="menor-preco">Menor preço</option>
                            <option value="maior-preco">Maior preço</option>
                            <option value="nome">Nome A–Z</option>
                        </select>
                    </div>
                </div>

                {produtosFiltrados.length > 0 ? (
                    <div className="produtos-grade">
                        {produtosFiltrados.map((produto) => (
                            <CardProduto
                                key={produto.id}
                                produto={produto}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="produtos-vazio">
                        <i className="bi bi-search" />
                        <h3>Nenhum produto encontrado</h3>
                        <p>
                            Tente mudar a pesquisa ou selecionar outra categoria.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setPesquisa("");
                                setCategoriaSelecionada("Todas");
                                setOrdenacao("padrao");
                            }}
                        >
                            Limpar filtros
                        </button>
                    </div>
                )}
            </section>
        </main>
    );
}
