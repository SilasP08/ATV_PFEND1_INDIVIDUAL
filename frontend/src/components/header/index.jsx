"use client";

import './header.css';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Header() {
    const pathname = usePathname();
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

            </div>
        </header>
    );
}
