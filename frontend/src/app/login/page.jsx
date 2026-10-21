"use client";

import { useState } from "react";
import Link from "next/link";
import "./login.css";

export default function Login() {
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    function autenticar(event) {
        event.preventDefault()

        fetch('http://localhost:3001/api/auth/login', {
            method: 'post',
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify({ email, senha })
        }).then(res => {
            //ir para a home
            if(!res.ok) throw new Error("Não autorizado")
            
            console.log("PASSOU")
        }).catch(error => {
            //exibe uma mensagem de erro
        })
    }
    

    return (
        <main className="auth-page">
            <section className="auth-brand">
                <Link href="/" className="auth-logo">
                    <span>HOUSE</span>
                    <strong>ELECTRIC</strong>
                    <span className="logo-bolt">⚡</span>
                </Link>

                <div className="brand-content">
                    <span className="brand-tag">TECNOLOGIA AO SEU ALCANCE</span>

                    <h1>
                        Energia para suas
                        <span> melhores ideias.</span>
                    </h1>

                    <p>
                        Encontre os componentes eletrônicos ideais
                        para transformar seus projetos em realidade.nhjkbhibhbnjiobniobhibiobioi
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

            <section className="auth-form-area">
                <div className="auth-form-container">
                    <div className="auth-mobile-logo">
                        <Link href="/" className="auth-logo">
                            <span>HOUSE</span>
                            <strong>ELECTRIC</strong>
                            <span className="logo-bolt">⚡</span>
                        </Link>
                    </div>

                    <div className="auth-heading">
                        <span className="form-eyebrow">BEM-VINDO DE VOLTA</span>
                        <h2>Acesse sua conta</h2>
                        <p>
                            Entre com seus dados para continuar.
                        </p>
                    </div>

                    <form className="auth-form" onSubmit={autenticar}>
                        <div className="form-group-custom">
                            <label htmlFor="email">E-mail</label>
                            <input type="email" id="email" className="form-control" placeholder="seuemail@exemplo.com" 
                            value={email} onChange={(event) => setEmail(event.target.value)} required/>
                        </div>

                        <div className="form-group-custom">
                            <label htmlFor="senha">Senha</label>

                            <div className="password-wrapper">
                                <input type={mostrarSenha ? "text" : "password"} id="senha" className="form-control" placeholder="Digite sua senha" 
                                 value={senha} onChange={(event) => setSenha(event.target.value)}
                                required/>

                                <button type="button" className="password-toggle" onClick={() => setMostrarSenha(!mostrarSenha)} aria-label={ mostrarSenha ? "Ocultar senha" : "Mostrar senha"}>
                                    {mostrarSenha ? "Ocultar" : "Mostrar"}
                                </button>
                            </div>
                        </div>

                        <div className="auth-options">
                            <label className="remember-option">
                                <input type="checkbox" />
                                <span>Lembrar de mim</span>
                            </label>

                            <a href="#recuperar-senha">
                                Esqueceu a senha?
                            </a>
                        </div>

                        <button type="submit" className="auth-submit">
                            Entrar na minha conta
                            <span>→</span>
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>OU</span>
                    </div>

                    <p className="auth-switch">
                        Ainda não tem uma conta?
                        <Link href="/cadastro"> Criar conta</Link>
                    </p>

                    <p className="auth-legal">
                        Ao continuar, você concorda com nossos
                        <a href="#termos"> Termos de Uso</a> e
                        <a href="#privacidade"> Política de Privacidade</a>.
                    </p>
                </div>
            </section>
        </main>
    );
}
