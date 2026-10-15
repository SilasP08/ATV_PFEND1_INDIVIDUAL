"use client";

import './header.css';

import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <header className="header-house">
            <div className="header-container">

                <Link href="/" className="logo-house">
                    <Image src="/image/logohouse.png" alt="House Electric" width={220} height={100} priority />
                </Link>

                <nav className="nav-overflow">
                    <ul className="nav nav-underline">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" href="/">
                                Home
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" href="/produtos">
                                Produtos
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" href="/categorias">
                                Categorias
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" href="/ofertas">
                                Ofertas
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" href="/contato">
                                Contato
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* BOTÕES DE AUTENTICAÇÃO */}
                <div className="header-auth">
                    <Link href="/login" className="btn-login">
                        Entrar
                    </Link>

                    <Link href="/cadastro" className="btn-cadastro">
                        Cadastrar
                    </Link>
                </div>

            </div>
        </header>
    );
}
