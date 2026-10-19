"use client";

import './header.css';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";

export default function Header() {
    const pathname = usePathname();

    const [logado, setLogado] = useState(false);
    const [menuAberto, setMenuAberto] = useState(false);
    const [erroFoto, setErroFoto] = useState(false);

    function sairDaConta() {
        setLogado(false);
        setMenuAberto(false);
        setErroFoto(false);
    }
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
                            <Link className="nav-link" href="/sobre">
                                Sobre
                            </Link>
                        </li>

                    </ul>
                </nav>

                {/* BOTÕES DE AUTENTICAÇÃO */}
                {!logado ? (
                    <div className="header-auth">
                        <li className="nav-item">
                            <Link href="/carrinho" className="nav-link header-carrinho">
                                <i className="bi bi-cart3" aria-hidden="true"></i>
                            </Link>
                        </li>
                        <Link href="/login" className="btn-login">
                            Entrar
                        </Link>

                        <Link href="/cadastro" className="btn-cadastro">
                            Cadastrar
                        </Link>
                    </div>
                ) : (<div className="perfil-container">

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
