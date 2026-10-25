"use client";

import './header.css';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";
import { obterUsuario, encerrarSessao, EVENTO_SESSAO } from "@/lib/sessao";
import { obterCarrinho, EVENTO_CARRINHO } from "@/lib/carrinho";

export default function Header() {
    const pathname = usePathname();

    const [logado, setLogado] = useState(false);
    const [usuario, setUsuario] = useState(null);
    const [itensCarrinho, setItensCarrinho] = useState(0);
    const [menuAberto, setMenuAberto] = useState(false);
    const [erroFoto, setErroFoto] = useState(false);

    // Lê a sessão e o carrinho salvos no navegador e acompanha as mudanças
    useEffect(() => {
        function atualizarSessao() {
            const usuarioAtual = obterUsuario();
            setUsuario(usuarioAtual);
            setLogado(Boolean(usuarioAtual));
        }
        function atualizarCarrinho() {
            const total = obterCarrinho().reduce((soma, item) => soma + item.quantidade, 0);
            setItensCarrinho(total);
        }

        atualizarSessao();
        atualizarCarrinho();

        window.addEventListener(EVENTO_SESSAO, atualizarSessao);
        window.addEventListener(EVENTO_CARRINHO, atualizarCarrinho);
        window.addEventListener("storage", atualizarSessao);
        window.addEventListener("storage", atualizarCarrinho);
        return () => {
            window.removeEventListener(EVENTO_SESSAO, atualizarSessao);
            window.removeEventListener(EVENTO_CARRINHO, atualizarCarrinho);
            window.removeEventListener("storage", atualizarSessao);
            window.removeEventListener("storage", atualizarCarrinho);
        };
    }, [pathname]);

    function sairDaConta() {
        encerrarSessao();
        setLogado(false);
        setMenuAberto(false);
        setErroFoto(false);
    }

    const iconeCarrinho = (
        <li className="nav-item">
            <Link href="/carrinho" className="nav-link header-carrinho" aria-label={`Carrinho com ${itensCarrinho} itens`}>
                <i className="bi bi-cart3" aria-hidden="true"></i>
                {itensCarrinho > 0 && (
                    <span className="carrinho-badge">{itensCarrinho}</span>
                )}
            </Link>
        </li>
    );
    return (
        <header className="header-house">
            <div className="header-container">

                <Link href="/" className="logo-house">
                    <Image src="/image/logohouse.png" alt="House Electric" width={220} height={100} priority />
                </Link>

                <nav className="nav-overflow">
                    <ul className="nav nav-underline">
                        <li className="nav-item">
                            <Link className={`nav-link ${pathname === "/" ? "active" : ""}`} aria-current="page" href="/">
                                Home
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className={`nav-link ${pathname === "/produtos" ? "active" : ""}`} href="/produtos">
                                Produtos
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className={`nav-link ${pathname === "/sobre" ? "active" : ""}`} href="/sobre">
                                Sobre
                            </Link>
                        </li>

                    </ul>
                </nav>

                {/* BOTÕES DE AUTENTICAÇÃO */}
                {!logado ? (
                    <div className="header-auth">
                        {iconeCarrinho}
                        <Link href="/login" className="btn-login">
                            Entrar
                        </Link>

                        <Link href="/cadastro" className="btn-cadastro">
                            Cadastrar
                        </Link>
                    </div>
                ) : (<div className="perfil-container">
                    {iconeCarrinho}

                    {/* FOTO DE PERFIL */}
                    <button type="button" className="perfil-botao" onClick={() => setMenuAberto(!menuAberto)} aria-label="Abrir menu do perfil" aria-expanded={menuAberto}>
                        {!erroFoto ? (
                            <Image src="/image/perfil.jpg" alt="Foto de perfil" width={44} height={44} className="perfil-foto" onError={() => setErroFoto(true)}/>
                        ) : (
                            <i
                                className="bi bi-person-fill perfil-icone"
                                aria-hidden="true"
                            ></i>
                        )}
                    </button>

                    {/* MENU DO PERFIL */}
                    {menuAberto && (
                        <div className="perfil-menu">
                            {usuario?.nome && (
                                <p className="perfil-nome">
                                    Olá, <strong>{usuario.nome.split(" ")[0]}</strong>
                                </p>
                            )}
                            <button
                                type="button"
                                className="perfil-logout"
                                onClick={sairDaConta}
                            >
                                <i
                                    className="bi bi-box-arrow-right"
                                    aria-hidden="true"
                                ></i>
                                Sair da conta
                            </button>
                        </div>
                    )}

                </div>
                )}
            </div>
        </header>
    );
}
