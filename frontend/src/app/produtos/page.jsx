
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
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        const controlador = new AbortController();

        const temporizador = setTimeout(async () => {
            try {
                setCarregando(true);
                setErro("");

                const parametros = new URLSearchParams();

                // A API aceita: limite, pesquisa, categoria e ordenacao
                parametros.set("limite", "50");

                if (pesquisa.trim() !== "") {
                    parametros.set("pesquisa", pesquisa.trim());
                }

                if (categoriaSelecionada !== "Todas") {
                    parametros.set("categoria", categoriaSelecionada);
                }

                if (ordenacao !== "padrao") {
                    parametros.set("ordenacao", ordenacao);
                }

                const resposta = await fetch(
                    `http://localhost:3001/api/produtos?${parametros.toString()}`,
                    { signal: controlador.signal }
                );

                if (!resposta.ok) {
                    throw new Error("Não foi possível buscar os produtos.");
                }

                const data = await resposta.json();

                setProdutos(Array.isArray(data.dados) ? data.dados : []);
            } catch (erro) {
                if (erro.name !== "AbortError") {
                    console.error("Erro ao buscar produtos:", erro);
                    setErro("Não foi possível carregar os produtos.");
                    setProdutos([]);
                }
            } finally {
                if (!controlador.signal.aborted) {
                    setCarregando(false);
                }
            }
        }, 300);

        return () => {
            clearTimeout(temporizador);
            controlador.abort();
        };
    }, [pesquisa, categoriaSelecionada, ordenacao]);

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
                        <span className="produtos-quantidade">
                            {produtos.length}{" "}
                            {produtos.length === 1
                                ? "produto encontrado"
                                : "produtos encontrados"}
                        </span>
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

                {carregando ? (
                    <p>Carregando produtos...</p>
                ) : erro ? (
                    <p>{erro}</p>
                ) : produtos.length > 0 ? (
                    <div className="produtos-grade">
                        {produtos.map((produto) => (
                            <CardProduto
                                key={produto.id_produto ?? produto.id}
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
