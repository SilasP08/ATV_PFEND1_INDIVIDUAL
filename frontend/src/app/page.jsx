
import Link from "next/link";
import Image from "next/image";

const categorias = [
  {
    nome: "Placas e módulos",
    descricao: "Dê vida aos seus projetos.",
    imagem: "/imagens/arduino-uno.png",
    link: "/categorias/placas",
  },
  {
    nome: "Sensores",
    descricao: "Precisão para cada aplicação.",
    imagem: "/imagens/sensor.png",
    link: "/categorias/sensores",
  },
  {
    nome: "Componentes",
    descricao: "Tudo para seus circuitos.",
    imagem: "/imagens/componentes.png",
    link: "/categorias/componentes",
  },
  {
    nome: "Ferramentas",
    descricao: "Equipamentos para montar e reparar.",
    imagem: "/imagens/ferramentas.png",
    link: "/categorias/ferramentas",
  },
];

const produtos = [
  {
    nome: "Arduino Uno R3",
    descricao: "Placa de desenvolvimento",
    preco: "59,90",
    imagem: "/imagens/arduino-uno.png",
    etiqueta: "MAIS VENDIDO",
  },
  {
    nome: "Módulo ESP32",
    descricao: "Wi-Fi e Bluetooth integrados",
    preco: "39,90",
    imagem: "/imagens/esp32.png",
    etiqueta: "DESTAQUE",
  },
  {
    nome: "Kit de resistores",
    descricao: "Kit para projetos eletrônicos",
    preco: "19,90",
    imagem: "/imagens/kit-resistores.png",
    etiqueta: null,
  },
  {
    nome: "Multímetro digital",
    descricao: "Medição e diagnóstico",
    preco: "49,90",
    imagem: "/imagens/multimetro.png",
    etiqueta: null,
  },
];

export default function Home() {
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

              <Link href="/categorias" className="btn-house-secondary">
                Ver categorias
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

        {/* CATEGORIAS */}
        <section className="section-house">
          <div className="section-heading">
            <div>
              <span className="section-overline">EXPLORE A LOJA</span>
              <h2>Encontre sua <span>categoria.</span></h2>
              <p>Os componentes certos para cada ideia.</p>
            </div>

            <Link href="/categorias" className="section-link">
              Todas as categorias
              <i className="bi bi-arrow-right" />
            </Link>
          </div>

          <div className="categories-grid">
            {categorias.map((categoria, index) => (
              <Link
                href={categoria.link}
                className="category-card"
                key={categoria.nome}
                style={{ "--card-index": index }}
              >
                <div className="category-image">
                  <Image
                    src={categoria.imagem}
                    alt={categoria.nome}
                    width={300}
                    height={220}
                  />
                </div>

                <div className="category-info">
                  <div>
                    <h3>{categoria.nome}</h3>
                    <p>{categoria.descricao}</p>
                  </div>

                  <span className="category-arrow">
                    <i className="bi bi-arrow-up-right" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
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

            <div className="products-grid">
              {produtos.map((produto) => (
                <article className="product-card" key={produto.nome}>
                  <div className="product-image">
                    {produto.etiqueta && (
                      <span className="product-badge">
                        {produto.etiqueta}
                      </span>
                    )}

                    <Image
                      src={produto.imagem}
                      alt={produto.nome}
                      width={300}
                      height={260}
                    />

                    <Link
                      href="/produtos"
                      className="product-quick-link"
                      aria-label={`Ver ${produto.nome}`}
                    >
                      <i className="bi bi-arrow-up-right" />
                    </Link>
                  </div>

                  <div className="product-info">
                    <span className="product-category">
                      COMPONENTES ELETRÔNICOS
                    </span>

                    <h3>{produto.nome}</h3>
                    <p>{produto.descricao}</p>

                    <div className="product-bottom">
                      <div className="product-price">
                        <span>R$</span>
                        <strong>{produto.preco}</strong>
                      </div>

                      <Link
                        href="/produtos"
                        className="product-add"
                        aria-label={`Ver produto ${produto.nome}`}
                      >
                        <i className="bi bi-plus-lg" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
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
