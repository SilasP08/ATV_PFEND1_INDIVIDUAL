
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./pagamento.css";
import { requisicao, formatarPreco } from "@/lib/api";
import { estaLogado, obterUsuario } from "@/lib/sessao";
import { obterCarrinho, limparCarrinho, calcularResumo } from "@/lib/carrinho";

const NOMES_PAGAMENTO = {
    pix: "PIX",
    cartao: "Cartão de crédito",
    boleto: "Boleto bancário",
};

function formatarCep(valor) {
    const numeros = valor.replace(/\D/g, "").slice(0, 8);
    return numeros.length > 5 ? `${numeros.slice(0, 5)}-${numeros.slice(5)}` : numeros;
}

export default function Pagamento() {
    const router = useRouter();
    const [formaPagamento, setFormaPagamento] = useState("pix");
    const [produtos, setProdutos] = useState([]);
    const [carregado, setCarregado] = useState(false);

    const [entrega, setEntrega] = useState({
        nome: "",
        cep: "",
        endereco: "",
        numero: "",
        complemento: "",
        cidade: "",
    });
    const [statusCep, setStatusCep] = useState("");
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [pedido, setPedido] = useState(null);

    // Só quem está logado pode finalizar a compra
    useEffect(() => {
        if (!estaLogado()) {
            router.replace("/login?redirect=/pagamento");
            return;
        }
        setProdutos(obterCarrinho());
        setEntrega((atual) => ({ ...atual, nome: obterUsuario()?.nome || "" }));
        setCarregado(true);
    }, [router]);

    const { subtotal, frete: valorFrete, total } = calcularResumo(produtos);

    function atualizarCampo(event) {
        const { id, value } = event.target;
        setEntrega((atual) => ({
            ...atual,
            [id]: id === "cep" ? formatarCep(value) : value,
        }));

        if (id === "cep") {
            buscarCep(value);
        }
    }

    // Preenche endereço e cidade automaticamente usando a API pública ViaCEP
    async function buscarCep(valor) {
        const cep = valor.replace(/\D/g, "");
        if (cep.length !== 8) {
            setStatusCep("");
            return;
        }

        setStatusCep("Buscando endereço...");
        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const dados = await resposta.json();

            if (dados.erro) {
                setStatusCep("CEP não encontrado. Preencha o endereço manualmente.");
                return;
            }

            setEntrega((atual) => ({
                ...atual,
                endereco: [dados.logradouro, dados.bairro].filter(Boolean).join(", ") || atual.endereco,
                cidade: dados.localidade ? `${dados.localidade} - ${dados.uf}` : atual.cidade,
            }));
            setStatusCep("Endereço encontrado!");
        } catch {
            setStatusCep("Não foi possível buscar o CEP. Preencha manualmente.");
        }
    }

    function validar() {
        if (produtos.length === 0) return "Seu carrinho está vazio.";
        if (entrega.nome.trim().length < 3) return "Informe o nome completo.";
        if (!/^\d{5}-\d{3}$/.test(entrega.cep)) return "Informe um CEP válido (00000-000).";
        if (!entrega.endereco.trim()) return "Informe o endereço.";
        if (!entrega.numero.trim()) return "Informe o número.";
        if (!entrega.cidade.trim()) return "Informe a cidade e o estado.";
        return "";
    }

    async function finalizarPedido(event) {
        event.preventDefault();
        setErro("");

        const mensagemErro = validar();
        if (mensagemErro) {
            setErro(mensagemErro);
            return;
        }

        setEnviando(true);
        try {
            const resposta = await requisicao("/api/pedidos", {
                metodo: "POST",
                autenticado: true,
                corpo: {
                    // Mandamos só id e quantidade: o preço é conferido no banco pelo back-end
                    itens: produtos.map((produto) => ({
                        id: produto.id,
                        quantidade: produto.quantidade,
                    })),
                    entrega,
                    formaPagamento,
                },
            });

            limparCarrinho();
            setProdutos([]);
            setPedido(resposta.dados);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            if (error.status === 401) {
                router.push("/login?redirect=/pagamento");
                return;
            }
            setErro(error.message);
        } finally {
            setEnviando(false);
        }
    }

    if (!carregado) {
        return <main className="pagina-pagamento" />;
    }

    // TELA DE PEDIDO CONFIRMADO
    if (pedido) {
        return (
            <main className="pagina-pagamento">
                <div className="pagamento-container">
                    <section className="pagamento-card pedido-confirmado">
                        <i className="bi bi-check-circle-fill"></i>
                        <h1>Pedido <span>confirmado!</span></h1>
                        <p>
                            Seu pedido <strong>#{pedido.id}</strong> foi registrado.
                            Forma de pagamento: <strong>{NOMES_PAGAMENTO[pedido.forma_pagamento]}</strong>.
                        </p>

                        <div className="resumo-produtos">
                            {pedido.itens.map((item) => (
                                <div className="produto-resumo" key={item.id_item}>
                                    <div className="produto-resumo-icone">
                                        <i className="bi bi-cpu"></i>
                                    </div>
                                    <div className="produto-resumo-info">
                                        <strong>{item.nome_produto}</strong>
                                        <span>Quantidade: {item.quantidade}</span>
                                    </div>
                                    <span className="produto-resumo-preco">
                                        {formatarPreco(item.preco_unitario * item.quantidade)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="resumo-linha">
                            <span>Subtotal</span>
                            <span>{formatarPreco(pedido.subtotal)}</span>
                        </div>
                        <div className="resumo-linha">
                            <span>Frete</span>
                            <span className={pedido.frete === 0 ? "frete-gratis" : ""}>
                                {pedido.frete === 0 ? "Grátis" : formatarPreco(pedido.frete)}
                            </span>
                        </div>
                        <div className="resumo-total">
                            <span>Total</span>
                            <strong>{formatarPreco(pedido.total)}</strong>
                        </div>

                        <p className="pagamento-seguro">
                            <i className="bi bi-truck"></i>
                            Entrega para {pedido.endereco}, {pedido.numero} – {pedido.cidade} ({pedido.cep})
                        </p>

                        <div className="pedido-confirmado-acoes">
                            <Link href="/produtos" className="btn-finalizar-pagamento">
                                Continuar comprando
                                <i className="bi bi-arrow-right"></i>
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        );
    }

    // CARRINHO VAZIO
    if (produtos.length === 0) {
        return (
            <main className="pagina-pagamento">
                <div className="pagamento-container">
                    <section className="pagamento-card pedido-confirmado">
                        <i className="bi bi-cart-x"></i>
                        <h1>Seu carrinho está <span>vazio</span></h1>
                        <p>Adicione produtos ao carrinho para finalizar uma compra.</p>
                        <div className="pedido-confirmado-acoes">
                            <Link href="/produtos" className="btn-finalizar-pagamento">
                                Explorar produtos
                                <i className="bi bi-arrow-right"></i>
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
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

                <form onSubmit={finalizarPedido} noValidate>
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
                                            value={entrega.nome}
                                            onChange={atualizarCampo}
                                            type="text"
                                            placeholder="Digite seu nome"
                                            required
                                        />
                                    </div>

                                    <div className="campo-pagamento">
                                        <label htmlFor="cep">CEP</label>
                                        <input
                                            id="cep"
                                            value={entrega.cep}
                                            onChange={atualizarCampo}
                                            type="text"
                                            placeholder="00000-000"
                                            inputMode="numeric"
                                            required
                                        />
                                        {statusCep && (
                                            <small className="cep-status">{statusCep}</small>
                                        )}
                                    </div>

                                    <div className="campo-pagamento">
                                        <label htmlFor="endereco">
                                            Endereço
                                        </label>
                                        <input
                                            id="endereco"
                                            value={entrega.endereco}
                                            onChange={atualizarCampo}
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
                                            value={entrega.numero}
                                            onChange={atualizarCampo}
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
                                            value={entrega.complemento}
                                            onChange={atualizarCampo}
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
                                            value={entrega.cidade}
                                            onChange={atualizarCampo}
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
                                        Ambiente de demonstração: o pedido é registrado
                                        e o pagamento fica como "aguardando pagamento".
                                    </div>
                                )}

                                {formaPagamento === "pix" && (
                                    <div className="aviso-pagamento">
                                        <i className="bi bi-info-circle"></i>
                                        Após confirmar, seu pedido fica registrado como
                                        "aguardando pagamento" (QR Code demonstrativo).
                                    </div>
                                )}

                                {formaPagamento === "boleto" && (
                                    <div className="aviso-pagamento">
                                        <i className="bi bi-info-circle"></i>
                                        Após confirmar, seu pedido fica registrado como
                                        "aguardando pagamento" (boleto demonstrativo).
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
                                            {formatarPreco(produto.preco * produto.quantidade)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="resumo-linha">
                                <span>Subtotal</span>
                                <span>
                                    {formatarPreco(subtotal)}
                                </span>
                            </div>

                            <div className="resumo-linha">
                                <span>Frete</span>
                                <span className={valorFrete === 0 ? "frete-gratis" : ""}>
                                    {valorFrete === 0
                                        ? "Grátis"
                                        : formatarPreco(valorFrete)}
                                </span>
                            </div>

                            <div className="resumo-total">
                                <span>Total</span>
                                <strong>
                                    {formatarPreco(total)}
                                </strong>
                            </div>

                            {erro && (
                                <p className="mensagem-erro" role="alert">
                                    {erro}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="btn-finalizar-pagamento"
                                disabled={enviando}
                            >
                                {enviando ? "Enviando pedido..." : "Finalizar pedido"}
                                <i className="bi bi-arrow-right"></i>
                            </button>

                            <p className="pagamento-seguro">
                                <i className="bi bi-shield-lock"></i>
                                Ambiente demonstrativo. Nenhuma cobrança real será feita.
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
