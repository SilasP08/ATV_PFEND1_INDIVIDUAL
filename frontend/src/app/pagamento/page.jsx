
"use client";

import { useState } from "react";
import Link from "next/link";
import "./pagamento.css";

export default function Pagamento() {
    const [formaPagamento, setFormaPagamento] = useState("pix");
    const [frete] = useState(15.90);

    // Produtos ilustrativos
    const produtos = [
        {
            id: 1,
            nome: "Placa Arduino Uno R3",
            quantidade: 1,
            preco: 79.90,
        },
        {
            id: 2,
            nome: "Sensor Ultrassônico HC-SR04",
            quantidade: 2,
            preco: 19.90,
        },
    ];

    const subtotal = produtos.reduce(
        (total, produto) =>
            total + produto.preco * produto.quantidade,
        0
    );

    const valorFrete = subtotal >= 250 ? 0 : frete;
    const total = subtotal + valorFrete;

    function finalizarPedido(event) {
        event.preventDefault();

        alert(
            `Demonstração: pagamento por ${
                formaPagamento.toUpperCase()
            } selecionado. Nenhuma cobrança foi realizada.`
        );
    }

    return (
        <main className="pagina-pagamento">
            <div className="pagamento-container">

                {/* CABEÇALHO DA PÁGINA */}
                <div className="pagamento-titulo">
                    <Link href="/carrinho" className="voltar-carrinho">
                        <i className="bi bi-arrow-left"></i>
                        Voltar ao carrinho
                    </Link>

                    <h1>Finalizar <span>compra</span></h1>
                    <p>Confira seu pedido e escolha a forma de pagamento.</p>
                </div>

                <form onSubmit={finalizarPedido}>
                    <div className="pagamento-layout">

                        {/* DADOS DO PEDIDO */}
                        <section className="pagamento-dados">

                            <div className="pagamento-card">
                                <h2>
                                    <i className="bi bi-geo-alt"></i>
                                    Endereço de entrega
                                </h2>

                                <div className="pagamento-campos">
                                    <div className="campo-pagamento">
                                        <label htmlFor="nome">
                                            Nome completo
                                        </label>
                                        <input
                                            id="nome"
                                            type="text"
                                            placeholder="Digite seu nome"
                                            required
                                        />
                                    </div>

                                    <div className="campo-pagamento">
                                        <label htmlFor="cep">CEP</label>
                                        <input
                                            id="cep"
                                            type="text"
                                            placeholder="00000-000"
                                            required
                                        />
                                    </div>

                                    <div className="campo-pagamento">
                                        <label htmlFor="endereco">
                                            Endereço
                                        </label>
                                        <input
                                            id="endereco"
                                            type="text"
                                            placeholder="Rua, avenida..."
                                            required
                                        />
                                    </div>

                                    <div className="campos-duplos">
                                        <div className="campo-pagamento">
                                            <label htmlFor="numero">
                                                Número
                                            </label>
                                            <input
                                                id="numero"
                                                type="text"
                                                placeholder="Nº"
                                                required
                                            />
                                        </div>

                                        <div className="campo-pagamento">
                                            <label htmlFor="complemento">
                                                Complemento
                                            </label>
                                            <input
                                                id="complemento"
                                                type="text"
                                                placeholder="Opcional"
                                            />
                                        </div>
                                    </div>

                                    <div className="campo-pagamento">
                                        <label htmlFor="cidade">
                                            Cidade e estado
                                        </label>
                                        <input
                                            id="cidade"
                                            type="text"
                                            placeholder="Cidade - UF"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* FORMAS DE PAGAMENTO */}
                            <div className="pagamento-card">
                                <h2>
                                    <i className="bi bi-credit-card"></i>
                                    Forma de pagamento
                                </h2>

                                <div className="opcoes-pagamento">

                                    <label
                                        className={`opcao-pagamento ${
                                            formaPagamento === "pix"
                                                ? "selecionado"
                                                : ""
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="pagamento"
                                            value="pix"
                                            checked={formaPagamento === "pix"}
                                            onChange={(e) =>
                                                setFormaPagamento(e.target.value)
                                            }
                                        />

                                        <i className="bi bi-qr-code"></i>

                                        <span>
                                            <strong>PIX</strong>
                                            <small>
                                                Pagamento instantâneo
                                            </small>
                                        </span>

                                        <i className="bi bi-check-circle-fill icone-selecao"></i>
                                    </label>

                                    <label
                                        className={`opcao-pagamento ${
                                            formaPagamento === "cartao"
                                                ? "selecionado"
                                                : ""
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="pagamento"
                                            value="cartao"
                                            checked={formaPagamento === "cartao"}
                                            onChange={(e) =>
                                                setFormaPagamento(e.target.value)
                                            }
                                        />

                                        <i className="bi bi-credit-card-2-front"></i>

                                        <span>
                                            <strong>Cartão de crédito</strong>
                                            <small>
                                                Crédito ou parcelamento
                                            </small>
                                        </span>

                                        <i className="bi bi-check-circle-fill icone-selecao"></i>
                                    </label>

                                    <label
                                        className={`opcao-pagamento ${
                                            formaPagamento === "boleto"
                                                ? "selecionado"
                                                : ""
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="pagamento"
                                            value="boleto"
                                            checked={formaPagamento === "boleto"}
                                            onChange={(e) =>
                                                setFormaPagamento(e.target.value)
                                            }
                                        />

                                        <i className="bi bi-upc-scan"></i>

                                        <span>
                                            <strong>Boleto bancário</strong>
                                            <small>
                                                Pagamento por boleto
                                            </small>
                                        </span>

                                        <i className="bi bi-check-circle-fill icone-selecao"></i>
                                    </label>

                                </div>

                                {formaPagamento === "cartao" && (
                                    <div className="aviso-pagamento">
                                        <i className="bi bi-info-circle"></i>
                                        Os campos do cartão serão disponibilizados
                                        quando o pagamento real for integrado.
                                    </div>
                                )}

                                {formaPagamento === "pix" && (
                                    <div className="aviso-pagamento">
                                        <i className="bi bi-info-circle"></i>
                                        O QR Code será gerado após a integração
                                        com um provedor de pagamentos.
                                    </div>
                                )}

                                {formaPagamento === "boleto" && (
                                    <div className="aviso-pagamento">
                                        <i className="bi bi-info-circle"></i>
                                        O boleto será gerado após a integração
                                        com um provedor de pagamentos.
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* RESUMO DA COMPRA */}
                        <aside className="resumo-pagamento">
                            <h2>Resumo do pedido</h2>

                            <div className="resumo-produtos">
                                {produtos.map((produto) => (
                                    <div
                                        className="produto-resumo"
                                        key={produto.id}
                                    >
                                        <div className="produto-resumo-icone">
                                            <i className="bi bi-cpu"></i>
                                        </div>

                                        <div className="produto-resumo-info">
                                            <strong>{produto.nome}</strong>
                                            <span>
                                                Quantidade: {produto.quantidade}
                                            </span>
                                        </div>

                                        <span className="produto-resumo-preco">
                                            {(
                                                produto.preco *
                                                produto.quantidade
                                            ).toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            })}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="resumo-linha">
                                <span>Subtotal</span>
                                <span>
                                    {subtotal.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </span>
                            </div>

                            <div className="resumo-linha">
                                <span>Frete</span>
                                <span className={valorFrete === 0 ? "frete-gratis" : ""}>
                                    {valorFrete === 0
                                        ? "Grátis"
                                        : valorFrete.toLocaleString("pt-BR", {
                                              style: "currency",
                                              currency: "BRL",
                                          })}
                                </span>
                            </div>

                            <div className="resumo-total">
                                <span>Total</span>
                                <strong>
                                    {total.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </strong>
                            </div>

                            <button
                                type="submit"
                                className="btn-finalizar-pagamento"
                            >
                                Finalizar pedido
                                <i className="bi bi-arrow-right"></i>
                            </button>

                            <p className="pagamento-seguro">
                                <i className="bi bi-shield-lock"></i>
                                Ambiente demonstrativo. Nenhuma cobrança será feita.
                            </p>

                            <Link href="/produtos" className="continuar-comprando">
                                Continuar comprando
                            </Link>
                        </aside>

                    </div>
                </form>
            </div>
        </main>
    );
}
