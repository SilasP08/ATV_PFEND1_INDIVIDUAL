'use client';
import Link from "next/link";
import Image from "next/image";
import CardProduto from "@/components/cardProduto";
import { useState, useEffect } from "react";
import { requisicao } from "@/lib/api";


export default function Home() {
  const [listarProdutos, setListarProdutos] = useState([])
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const controlador = new AbortController();

    // etiqueta=true -> a API devolve apenas produtos com etiqueta (MAIS VENDIDO, DESTAQUE, OFERTA...)
    requisicao('/api/produtos?etiqueta=true&limite=8', { signal: controlador.signal })
      .then(data => {
        setListarProdutos(Array.isArray(data.dados) ? data.dados : []);
      })
      .catch(erro => {
        if (erro.name !== "AbortError") setErro(erro.message);
      })
      .finally(() => {
        if (!controlador.signal.aborted) setCarregando(false);
      });

    return () => controlador.abort();
  }, [])
  return (
    <>


      <main className="home-house">
        {/* BANNER PRINCIPAL */}
        <section className="hero-house">
          <div className="hero-background" />

          <div className="hero-content">
            <span className="hero-tag">
              <span className="status-dot" />
              SEU PROJETO COMEÇA AQUI
            </span>

            <h1>
              Suas ideias.
              <br />
              Nossa <span>tecnologia.</span>
            </h1>

            <p>
              Componentes eletrônicos, placas e ferramentas
              para transformar seus projetos em realidade.
            </p>

            <div className="hero-buttons">
              <Link href="/produtos" className="btn-house-primary">
                Explorar produtos
                <i className="bi bi-arrow-up-right" />
              </Link>
            </div>

            <div className="hero-stats">
              <div>
                <strong>Qualidade</strong>
                <span>Produtos selecionados</span>
              </div>

              <div>
                <strong>Variedade</strong>
                <span>Soluções para seus projetos</span>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <div className="hero-image-glow" />

            <Image
              src="/imagens/hero-eletronica.png"
              alt="Componentes eletrônicos e placas de desenvolvimento"
              width={650}
              height={550}
              priority
              className="hero-product-image"
            />

            <div className="hero-floating-card">
              <i className="bi bi-cpu" />
              <div>
                <strong>Crie sem limites</strong>
                <span>Seu próximo projeto começa aqui</span>
              </div>
            </div>
          </div>

          <div className="hero-decoration">HE.</div>
        </section>

        {/* BENEFÍCIOS */}
        <section className="benefits-house">
          <article className="benefit-item">
            <i className="bi bi-box-seam" />
            <div>
              <h3>Produtos selecionados</h3>
              <p>Mais opções para seus projetos.</p>
            </div>
          </article>

          <article className="benefit-item">
            <i className="bi bi-shield-check" />
            <div>
              <h3>Compra segura</h3>
              <p>Uma experiência simples e confiável.</p>
            </div>
          </article>

          <article className="benefit-item">
            <i className="bi bi-headset" />
            <div>
              <h3>Suporte ao cliente</h3>
              <p>Conte com nossa equipe.</p>
            </div>
          </article>
        </section>


        {/* PRODUTOS EM DESTAQUE */}
        <section className="featured-house">
          <div className="section-house">
            <div className="section-heading">
              <div>
                <span className="section-overline">
                  ESCOLHAS DA HOUSE
                </span>
                <h2>Produtos em <span>destaque.</span></h2>
                <p>Confira alguns itens para o seu próximo projeto.</p>
              </div>

              <Link href="/produtos" className="section-link">
                Ver todos os produtos
                <i className="bi bi-arrow-right" />
              </Link>
            </div>
            {carregando && <p className="mensagem-info">Carregando destaques...</p>}

            {!carregando && erro && <p className="mensagem-erro">{erro}</p>}

            {!carregando && !erro && listarProdutos.length === 0 && (
              <p className="mensagem-info">Nenhum produto em destaque no momento.</p>
            )}

            {listarProdutos.length > 0 &&
              <div className="products-grid">
                {listarProdutos.map((produto) => (
                  <CardProduto
                    key={produto.id}
                    produto={produto}
                  />
                ))}
              </div>
            }

          </div>
        </section>

        <section className="project-banner">
          <div className="project-banner-content">
            <span className="section-overline">DO PLANEJAMENTO À PRÁTICA</span>

            <h2>
              Seu próximo projeto
              <br />
              merece <span>o melhor.</span>
            </h2>

            <p>
              Explore nossa seleção de componentes e encontre
              novas possibilidades para criar, testar e inovar.
            </p>

            <Link href="/produtos" className="btn-house-primary">
              Começar a explorar
              <i className="bi bi-arrow-up-right" />
            </Link>
          </div>

          <div className="project-banner-decoration">
            <i className="bi bi-cpu" />
            <span>IDEIAS EM MOVIMENTO</span>
          </div>
        </section>
      </main>
    </>
  );
}
