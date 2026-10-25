"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./login.css";
import { requisicao } from "@/lib/api";
import { salvarSessao, estaLogado } from "@/lib/sessao";

// Só aceita redirecionar para páginas do próprio site (ex.: /pagamento)
function destinoAposLogin() {
    const redirect = new URLSearchParams(window.location.search).get("redirect");
    return redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/";
}

export default function Login() {
    const router = useRouter();
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);

    // Quem já está logado não precisa ver a tela de login
    useEffect(() => {
        if (estaLogado()) router.replace(destinoAposLogin());
    }, [router]);

    async function autenticar(event) {
        event.preventDefault();
        setErro("");

        if (!email.trim() || !senha) {
            setErro("Preencha o e-mail e a senha.");
            return;
        }

        setEnviando(true);
        try {
            const resposta = await requisicao("/api/auth/login", {
                metodo: "POST",
                corpo: { email: email.trim(), senha },
            });

            salvarSessao(resposta.dados);
            router.push(destinoAposLogin());
        } catch (error) {
            setErro(
                error.status === 401
                    ? "E-mail ou senha incorretos."
                    : error.message
            );
        } finally {
            setEnviando(false);
        }
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
                        para transformar seus projetos em realidade.
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

                    <form className="auth-form" onSubmit={autenticar} noValidate>
                        {erro && (
                            <p className="mensagem-erro" role="alert">
                                {erro}
                            </p>
                        )}

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

                        <button type="submit" className="auth-submit" disabled={enviando}>
                            {enviando ? "Entrando..." : "Entrar na minha conta"}
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
