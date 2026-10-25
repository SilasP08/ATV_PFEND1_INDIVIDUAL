
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./cadastro.css";
import { requisicao } from "@/lib/api";
import { salvarSessao } from "@/lib/sessao";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mesmas regras do AuthService no back-end
function validarFormulario({ nome, email, senha, confirmarSenha, aceitouTermos }) {
    if (nome.trim().length < 3) return "O nome deve ter no mínimo 3 caracteres.";
    if (!REGEX_EMAIL.test(email.trim())) return "Informe um e-mail válido.";
    if (
        senha.length < 8 ||
        !/[a-z]/.test(senha) ||
        !/[A-Z]/.test(senha) ||
        !/\d/.test(senha) ||
        !/[^A-Za-z0-9]/.test(senha)
    ) {
        return "A senha deve ter no mínimo 8 caracteres, com letra maiúscula, minúscula, número e símbolo.";
    }
    if (senha !== confirmarSenha) return "As senhas não conferem.";
    if (!aceitouTermos) return "Você precisa aceitar os Termos de Uso.";
    return "";
}

export default function Cadastro() {
    const router = useRouter();
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

    const [formulario, setFormulario] = useState({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        aceitouTermos: false,
    });
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [enviando, setEnviando] = useState(false);

    function atualizarCampo(event) {
        const { id, value, type, checked } = event.target;
        setFormulario((atual) => ({
            ...atual,
            [id]: type === "checkbox" ? checked : value,
        }));
    }

    async function cadastrar(event) {
        event.preventDefault();
        setErro("");
        setSucesso("");

        const mensagemErro = validarFormulario(formulario);
        if (mensagemErro) {
            setErro(mensagemErro);
            return;
        }

        setEnviando(true);
        try {
            const dados = {
                nome: formulario.nome.trim(),
                email: formulario.email.trim(),
                senha: formulario.senha,
            };

            await requisicao("/api/auth/registrar", { metodo: "POST", corpo: dados });
            setSucesso("Conta criada com sucesso! Entrando...");

            // Faz o login automaticamente com os dados que acabaram de ser cadastrados
            const login = await requisicao("/api/auth/login", {
                metodo: "POST",
                corpo: { email: dados.email, senha: dados.senha },
            });
            salvarSessao(login.dados);
            router.push("/");
        } catch (error) {
            setSucesso("");
            setErro(error.message);
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

                    <form className="auth-form" onSubmit={cadastrar} noValidate>
                        {erro && (
                            <p className="mensagem-erro" role="alert">
                                {erro}
                            </p>
                        )}

                        {sucesso && (
                            <p className="mensagem-sucesso" role="status">
                                {sucesso}
                            </p>
                        )}

                        <div className="form-group-custom">
                            <label htmlFor="nome">Nome completo</label>
                            <input type="text" id="nome" className="form-control" placeholder="Digite seu nome completo" value={formulario.nome} onChange={atualizarCampo} autoComplete="name" required/>
                        </div>

                        <div className="form-group-custom">
                            <label htmlFor="email">E-mail</label>
                            <input type="email" id="email" className="form-control" placeholder="seuemail@exemplo.com" value={formulario.email} onChange={atualizarCampo} autoComplete="email" required/>
                        </div>

                        <div className="form-group-custom">
                            <label htmlFor="senha">Senha</label>

                            <div className="password-wrapper">
                                <input type={mostrarSenha ? "text" : "password"} id="senha" className="form-control" placeholder="Crie uma senha" value={formulario.senha} onChange={atualizarCampo} autoComplete="new-password" required />

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
                                <input type={ mostrarConfirmacao ? "text" : "password" } id="confirmarSenha" className="form-control" placeholder="Digite a senha novamente" value={formulario.confirmarSenha} onChange={atualizarCampo} autoComplete="new-password" required />

                                <button type="button" className="password-toggle" onClick={() => setMostrarConfirmacao(!mostrarConfirmacao)}>
                                    {mostrarConfirmacao ? "Ocultar" : "Mostrar"}
                                </button>
                            </div>
                        </div>

                        <label className="remember-option cadastro-termos">
                            <input type="checkbox" id="aceitouTermos" checked={formulario.aceitouTermos} onChange={atualizarCampo} required />
                            <span>
                                Li e aceito os
                                <a href="#termos"> Termos de Uso</a> e a
                                <a href="#privacidade"> Política de Privacidade</a>.
                            </span>
                        </label>

                        <small className="dica-senha">
                            Mínimo de 8 caracteres, com maiúscula, minúscula, número e símbolo.
                        </small>

                        <button type="submit" className="auth-submit" disabled={enviando}>
                            {enviando ? "Criando conta..." : "Criar minha conta"}
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
