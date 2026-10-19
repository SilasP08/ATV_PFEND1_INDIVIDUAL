
"use client";

import { useState } from "react";
import Link from "next/link";
import "./cadastro.css";

export default function Cadastro() {
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

    return (
        <main className="auth-page">
            <section className="auth-brand">
                <Link href="/" className="auth-logo">
                    <span>HOUSE</span>
                    <strong>ELECTRIC</strong>
                    <span className="logo-bolt">⚡</span>
                </Link>

                <div className="brand-content">
                    <span className="brand-tag">FAÇA PARTE DA HOUSE ELECTRIC</span>

                    <h1>
                        Seu próximo projeto
                        <span> começa aqui.</span>
                    </h1>

                    <p>
                        Crie sua conta e descubra os componentes
                        que vão dar vida às suas ideias.
                    </p>

                    <div className="brand-decoration">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                <p className="brand-footer">
                    HOUSE ELECTRIC © 2026
                </p>
            </section>

            <section className="auth-form-area cadastro-area">
                <div className="auth-form-container cadastro-container">
                    <div className="auth-mobile-logo">
                        <Link href="/" className="auth-logo">
                            <span>HOUSE</span>
                            <strong>ELECTRIC</strong>
                            <span className="logo-bolt">⚡</span>
                        </Link>
                    </div>

                    <div className="auth-heading">
                        <span className="form-eyebrow">É RÁPIDO E SIMPLES</span>
                        <h2>Crie sua conta</h2>
                        <p>Preencha os campos para começar.</p>
                    </div>

                    <form className="auth-form">
                        <div className="form-group-custom">
                            <label htmlFor="nome">Nome completo</label>
                            <input type="text" id="nome" className="form-control" placeholder="Digite seu nome completo" required/>
                        </div>

                        <div className="form-group-custom">
                            <label htmlFor="email">E-mail</label>
                            <input type="email" id="email" className="form-control" placeholder="seuemail@exemplo.com" required/>
                        </div>

                        <div className="form-group-custom">
                            <label htmlFor="senha">Senha</label>

                            <div className="password-wrapper">
                                <input type={mostrarSenha ? "text" : "password"} id="senha" className="form-control" placeholder="Crie uma senha" required />

                                <button type="button" className="password-toggle" onClick={() => setMostrarSenha(!mostrarSenha)}>
                                    {mostrarSenha ? "Ocultar" : "Mostrar"}
                                </button>
                            </div>
                        </div>

                        <div className="form-group-custom">
                            <label htmlFor="confirmarSenha">
                                Confirmar senha
                            </label>

                            <div className="password-wrapper">
                                <input type={ mostrarConfirmacao ? "text" : "password" } id="confirmarSenha" className="form-control" placeholder="Digite a senha novamente" required />

                                <button type="button" className="password-toggle" onClick={() => setMostrarConfirmacao(!mostrarConfirmacao)}>
                                    {mostrarConfirmacao ? "Ocultar" : "Mostrar"}
                                </button>
                            </div>
                        </div>

                        <label className="remember-option cadastro-termos">
                            <input type="checkbox" required />
                            <span>
                                Li e aceito os
                                <a href="#termos"> Termos de Uso</a> e a
                                <a href="#privacidade"> Política de Privacidade</a>.
                            </span>
                        </label>

                        <button type="submit" className="auth-submit">
                            Criar minha conta
                            <span>→</span>
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>OU</span>
                    </div>

                    <p className="auth-switch">
                        Já possui uma conta?
                        <Link href="/login"> Fazer login</Link>
                    </p>
                </div>
            </section>
        </main>
    );
}
