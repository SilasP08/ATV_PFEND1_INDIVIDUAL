// Carrinho de compras salvo no navegador (localStorage).
// Assim ele continua lá ao trocar de página ou recarregar.
const CHAVE_CARRINHO = "house-electric:carrinho";
export const EVENTO_CARRINHO = "house-electric:carrinho-alterado";

export const FRETE_PADRAO = 15.9;
export const FRETE_GRATIS_A_PARTIR_DE = 250;

function salvar(itens) {
    try {
        localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
    } catch {}
    window.dispatchEvent(new Event(EVENTO_CARRINHO));
    return itens;
}

export function obterCarrinho() {
    if (typeof window === "undefined") return [];
    try {
        const itens = JSON.parse(localStorage.getItem(CHAVE_CARRINHO));
        return Array.isArray(itens) ? itens : [];
    } catch {
        return [];
    }
}

// Adiciona um produto (ou soma a quantidade se ele já estiver no carrinho).
// Respeita o estoque do produto quando ele é informado.
export function adicionarAoCarrinho(produto, quantidade = 1) {
    const itens = obterCarrinho();
    const id = produto.id ?? produto.id_produto;
    const existente = itens.find((item) => item.id === id);
    const limite = Number.isFinite(produto.estoque) ? produto.estoque : 99;

    if (existente) {
        existente.quantidade = Math.min(limite, existente.quantidade + quantidade);
        existente.estoque = produto.estoque;
        existente.preco = produto.preco;
    } else {
        itens.push({
            id,
            nome: produto.nome,
            categoria: produto.categoria,
            preco: Number(produto.preco),
            imagem: produto.imagem,
            estoque: produto.estoque,
            quantidade: Math.min(limite, quantidade),
        });
    }
    return salvar(itens);
}

export function alterarQuantidade(id, novaQuantidade) {
    const itens = obterCarrinho().map((item) => {
        if (item.id !== id) return item;
        const limite = Number.isFinite(item.estoque) ? item.estoque : 99;
        return { ...item, quantidade: Math.max(1, Math.min(limite, novaQuantidade)) };
    });
    return salvar(itens);
}

export function removerDoCarrinho(id) {
    return salvar(obterCarrinho().filter((item) => item.id !== id));
}

export function limparCarrinho() {
    return salvar([]);
}

export function calcularResumo(itens) {
    const quantidadeTotal = itens.reduce((total, item) => total + item.quantidade, 0);
    const subtotal = itens.reduce((total, item) => total + item.preco * item.quantidade, 0);
    const frete = subtotal === 0 || subtotal >= FRETE_GRATIS_A_PARTIR_DE ? 0 : FRETE_PADRAO;
    return { quantidadeTotal, subtotal, frete, total: subtotal + frete };
}
