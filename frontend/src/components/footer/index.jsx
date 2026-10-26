"use client";

import './footer.css';
import Link from "next/link";

export default function Footer() {
    return (
        <>
            <footer className="footer">
                <div className="footer-main">

                    <div className="footer-about">
                        <a href="index.php" className="logo-footer">
                            ELETRO<span>TECH</span>
                        </a>

                        <p className="slogan-footer">
                            Tecnologia, inovação e qualidade
                            <br />
                            para seus projetos.
                        </p>

                        <div className="footer-line"></div>

                        <p className="txt-footer">
                            Encontre componentes eletrônicos,
                            ferramentas e acessórios para transformar
                            suas ideias em realidade.
                        </p>
                    </div>

                    <div className="footer-column">
                        <h2>NAVEGAÇÃO</h2>
                        <div className="footer-title-line"></div>

                        <ul className="footer-links">
                            <li>
                                <Link href="/">
                                    <i className="bi bi-house-door"></i>
                                    Início
                                </Link>
                            </li>

                            <li>
                                <Link href="/produtos">
                                    <i className="bi bi-cpu"></i>
                                    Produtos
                                </Link>
                            </li>
                            <li>
                                <Link href="/sobre">
                                    <i className="bi bi-cpu"></i>
                                    Sobre Nós
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h2>ATENDIMENTO</h2>
                        <div className="footer-title-line"></div>

                        <div className="footer-info">
                            <div className="info-item">
                                <i className="bi bi-telephone-fill"></i>
                                <span>(11) 93056-9806</span>
                            </div>

                            <div className="info-item">
                                <i className="bi bi-envelope-fill"></i>
                                <span>contato@eletrotech.com.br</span>
                            </div>

                            <div className="info-item">
                                <i className="bi bi-geo-alt-fill"></i>
                                <span>São Paulo - SP, Brasil</span>
                            </div>

                            <div className="info-item">
                                <i className="bi bi-clock-fill"></i>
                                <span>
                                    Segunda a sexta
                                    <br />
                                    Das 8h às 18h
                                </span>
                            </div>
                        </div>

                        <a href="contato.php" className="footer-contact-btn">
                            <i className="bi bi-chat-dots"></i>
                            Entre em contato
                        </a>
                    </div>

                    <div className="footer-column">
                        <h2>SIGA-NOS</h2>
                        <div className="footer-title-line"></div>

                        <p className="social-description">
                            Acompanhe nossas novidades,
                            lançamentos e ofertas.
                        </p>

                        <div className="social-list">
                            <a href="#" aria-label="Instagram">
                                <i className="bi bi-instagram"></i>
                                <span>Instagram</span>
                            </a>

                            <a href="#" aria-label="Facebook">
                                <i className="bi bi-facebook"></i>
                                <span>Facebook</span>
                            </a>

                            <a href="#" aria-label="WhatsApp">
                                <i className="bi bi-whatsapp"></i>
                                <span>WhatsApp</span>
                            </a>
                        </div>
                    </div>

                </div>

                <div className="footer-bottom">
                    <div className="footer-bottom-line"></div>

                    <p>
                        &copy; 2026 EletroTech.
                        Todos os direitos reservados.
                    </p>

                    <div className="footer-bottom-icons">
                        <i className="bi bi-cpu"></i>
                        <span>TECNOLOGIA QUE CONECTA</span>
                        <i className="bi bi-lightning-charge-fill"></i>
                    </div>
                </div>
            </footer>
        </>
    )
}