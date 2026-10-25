import { obterToken, encerrarSessao } from "./sessao";

// Endereço da API Express. Pode ser trocado criando NEXT_PUBLIC_API_URL no .env.local do front.
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Faz uma requisição para a API e devolve o JSON.
// Se a API responder com erro, lança um Error com a mensagem enviada pelo back-end.
export async function requisicao(caminho, { metodo = "GET", corpo, autenticado = false, signal } = {}) {
    const headers = {};

    if (corpo !== undefined) {
        headers["Content-Type"] = "application/json";
    }

    if (autenticado) {
        const token = obterToken();
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    let resposta;
    try {
        resposta = await fetch(`${API_URL}${caminho}`, {
            method: metodo,
            headers,
            body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
            signal,
        });
    } catch (erro) {
        if (erro.name === "AbortError") throw erro;
        throw new Error("Não foi possível conectar ao servidor. Verifique se a API está rodando.");
    }

    const dados = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
        // Token vencido: limpa a sessão para o usuário entrar de novo
        if (resposta.status === 401 && autenticado) {
            encerrarSessao();
        }
        const erro = new Error(dados.erro || dados.mensagem || "Ocorreu um erro inesperado.");
        erro.status = resposta.status;
        throw erro;
    }

    return dados;
}

export function formatarPreco(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}
