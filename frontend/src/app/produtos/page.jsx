
"use client";

import { useState } from "react";
import CardProduto from "@/components/cardProduto";
import "./produtos.css";

const produtos = [
    {
        id: 1,
        nome: "Arduino Uno R3",
        descricao: "Placa de desenvolvimento para projetos eletrônicos.",
        categoria: "Placas e módulos",
        preco: "59,90",
        precoValor: 59.90,
        imagem: "/imagens/arduino-uno.png",
        etiqueta: "MAIS VENDIDO",
    },
    {
        id: 2,
        nome: "ESP32 Wi-Fi Bluetooth",
        descricao: "Módulo ideal para projetos de automação e IoT.",
        categoria: "Placas e módulos",
        preco: "39,90",
        precoValor: 39.90,
        imagem: "/imagens/esp32.png",
        etiqueta: "DESTAQUE",
    },
    {
        id: 3,
        nome: "Sensor Ultrassônico",
        descricao: "Sensor para medir distâncias em projetos eletrônicos.",
        categoria: "Sensores",
        preco: "18,90",
        precoValor: 18.90,
        imagem: "/imagens/sensor.png",
    },
    {
        id: 4,
        nome: "Kit de Resistores",
        descricao: "Kit com resistores para diversos circuitos eletrônicos.",
        categoria: "Componentes",
        preco: "19,90",
        precoValor: 19.90,
        imagem: "/imagens/kit-resistores.png",
    },
    {
        id: 5,
        nome: "Multímetro Digital",
        descricao: "Ferramenta para medições elétricas no dia a dia.",
        categoria: "Ferramentas",
        preco: "49,90",
        precoValor: 49.90,
        imagem: "/imagens/multimetro.png",
    },
    {
        id: 6,
        nome: "Módulo Eletrônico",
        descricao: "Módulo para integrar novas funções aos seus projetos.",
        categoria: "Componentes",
        preco: "24,90",
        precoValor: 24.90,
        imagem: "/imagens/componentes.png",
    },
    {
        id: 7,
        nome: "Kit de Ferramentas",
        descricao: "Conjunto de ferramentas para montagem e manutenção.",
        categoria: "Ferramentas",
        preco: "79,90",
        precoValor: 79.90,
        imagem: "/imagens/ferramentas.png",
    },
    {
        id: 8,
        nome: "Placa de Prototipagem",
        descricao: "Monte e teste circuitos sem precisar soldar componentes.",
        categoria: "Placas e módulos",
        preco: "14,90",
        precoValor: 14.90,
        imagem: "/imagens/prototipagem.png",
    },
];

const categorias = [
    "Todas",
    "Placas e módulos",
    "Sensores",
    "Componentes",
    "Ferramentas",
];

export default function Produtos() {
    const [pesquisa, setPesquisa] = useState("");
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todas");
    const [ordenacao, setOrdenacao] = useState("padrao");

    const produtosFiltrados = produtos
        .filter((produto) => {
            const correspondePesquisa = produto.nome
                .toLowerCase()
                .includes(pesquisa.toLowerCase());

            const correspondeCategoria =
                categoriaSelecionada === "Todas" ||
                produto.categoria === categoriaSelecionada;

            return correspondePesquisa && correspondeCategoria;
        })
        .sort((a, b) => {
            if (ordenacao === "menor-preco") {
                return a.precoValor - b.precoValor;
            }

            if (ordenacao === "maior-preco") {
                return b.precoValor - a.precoValor;
            }

            if (ordenacao === "nome") {
                return a.nome.localeCompare(b.nome);
            }

            return a.id - b.id;
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
