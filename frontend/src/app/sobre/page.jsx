
import Link from "next/link";
import "./sobreNos.css";

export default function Sobre() {
    return (
        <main className="sobre-page">

            {/* Banner principal */}
            <section className="sobre-hero">
                <div className="container">
                    <span className="sobre-tag">
                        CONHEÇA A HOUSE ELECTRIC
                    </span>

                    <h1>
                        Conectando ideias
                        <span> à tecnologia.</span>
                    </h1>

                    <p>
                        Somos uma loja dedicada a oferecer componentes
                        eletrônicos para quem deseja criar, desenvolver
                        e transformar projetos em realidade.
                    </p>

                    <Link href="/produtos" className="sobre-btn">
                        Conheça nossos produtos
                        <span>→</span>
                    </Link>
                </div>

                <div className="sobre-hero-decoration"></div>
            </section>

            {/* Nossa história */}
            <section className="sobre-historia">
                <div className="container">
                    <div className="row align-items-center g-5">

                        <div className="col-lg-6">
                            <div className="historia-visual">
                                <div className="historia-icon">⚡</div>

                                <span className="historia-legenda">
                                    TECNOLOGIA • INOVAÇÃO • CONEXÃO
                                </span>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <span className="sobre-subtitle">
                                QUEM SOMOS
                            </span>

                            <h2>
                                Mais do que componentes,
                                <span> possibilidades.</span>
                            </h2>

                            <p>
                                A House Electric nasceu com a proposta de
                                tornar a busca por componentes eletrônicos
                                mais prática e acessível.
                            </p>

                            <p>
                                Queremos ajudar estudantes, profissionais
                                e entusiastas da eletrônica a encontrar
                                produtos para seus projetos, estudos e
                                experimentos.
                            </p>

                            <p>
                                Acreditamos que toda grande ideia começa
                                com os componentes certos e a vontade de
                                fazer acontecer.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* Missão, visão e valores */}
            <section className="sobre-valores">
                <div className="container">

                    <div className="sobre-section-heading">
                        <span className="sobre-subtitle">
                            NOSSA ESSÊNCIA
                        </span>

                        <h2>
                            O que nos <span>move?</span>
                        </h2>

                        <p>
                            Os princípios que orientam nosso trabalho
                            e nosso relacionamento com os clientes.
                        </p>
                    </div>

                    <div className="row g-4">

                        <div className="col-md-4">
                            <article className="valor-card">
                                <div className="valor-icon">◎</div>

                                <h3>Missão</h3>

                                <p>
                                    Facilitar o acesso a componentes
                                    eletrônicos, oferecendo praticidade
                                    e uma experiência de compra confiável.
                                </p>
                            </article>
                        </div>

                        <div className="col-md-4">
                            <article className="valor-card">
                                <div className="valor-icon">↗</div>

                                <h3>Visão</h3>

                                <p>
                                    Ser reconhecida pela qualidade do
                                    atendimento e pela facilidade de
                                    encontrar produtos eletrônicos.
                                </p>
                            </article>
                        </div>

                        <div className="col-md-4">
                            <article className="valor-card">
                                <div className="valor-icon">◇</div>

                                <h3>Valores</h3>

                                <p>
                                    Compromisso, transparência, inovação
                                    e respeito a cada cliente e projeto.
                                </p>
                            </article>
                        </div>

                    </div>
                </div>
            </section>

            {/* Diferenciais */}
            <section className="sobre-diferenciais">
                <div className="container">

                    <div className="sobre-section-heading">
                        <span className="sobre-subtitle">
                            NOSSO DIFERENCIAL
                        </span>

                        <h2>
                            Por que escolher a
                            <span> House Electric?</span>
                        </h2>
                    </div>

                    <div className="row g-4">

                        <div className="col-sm-6 col-lg-3">
                            <article className="diferencial-card">
                                <span>01</span>
                                <h3>Variedade</h3>
                                <p>
                                    Diferentes componentes para
                                    diferentes necessidades.
                                </p>
                            </article>
                        </div>

                        <div className="col-sm-6 col-lg-3">
                            <article className="diferencial-card">
                                <span>02</span>
                                <h3>Praticidade</h3>
                                <p>
                                    Uma experiência de navegação
                                    simples e intuitiva.
                                </p>
                            </article>
                        </div>

                        <div className="col-sm-6 col-lg-3">
                            <article className="diferencial-card">
                                <span>03</span>
                                <h3>Compromisso</h3>
                                <p>
                                    Atenção às necessidades e à
                                    experiência dos nossos clientes.
                                </p>
                            </article>
                        </div>

                        <div className="col-sm-6 col-lg-3">
                            <article className="diferencial-card">
                                <span>04</span>
                                <h3>Inovação</h3>
                                <p>
                                    Incentivo à criatividade, ao
                                    aprendizado e a novas ideias.
                                </p>
                            </article>
                        </div>

                    </div>
                </div>
            </section>

            {/* Chamada final */}
            <section className="sobre-cta">
                <div className="container">
                    <span className="sobre-subtitle">
                        SEU PRÓXIMO PROJETO COMEÇA AQUI
                    </span>

                    <h2>
                        Transforme suas ideias
                        <span> em realidade.</span>
                    </h2>

                    <p>
                        Explore nosso catálogo e encontre os componentes
                        para tirar seus projetos do papel.
                    </p>

                    <Link href="/produtos" className="sobre-btn">
                        Explorar produtos
                        <span>→</span>
                    </Link>
                </div>
            </section>

        </main>
    );
}
