// Guarda o login (token JWT + dados do usuário) no navegador.
const CHAVE_SESSAO = "house-electric:sessao";
export const EVENTO_SESSAO = "house-electric:sessao-alterada";

function avisarMudanca() {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(EVENTO_SESSAO));
    }
}

export function obterSessao() {
    if (typeof window === "undefined") return null;
    try {
        const sessao = JSON.parse(localStorage.getItem(CHAVE_SESSAO));
        if (!sessao?.token) return null;

        // Se o token já venceu, descarta a sessão
        if (sessao.expiraEm && Date.now() > sessao.expiraEm) {
            localStorage.removeItem(CHAVE_SESSAO);
            return null;
        }
        return sessao;
    } catch {
        return null;
    }
}

export function obterToken() {
    return obterSessao()?.token || null;
}

export function obterUsuario() {
    return obterSessao()?.usuario || null;
}

export function estaLogado() {
    return obterSessao() !== null;
}

// "dados" é o objeto devolvido por POST /api/auth/login
export function salvarSessao(dados) {
    const sessao = {
        token: dados.token,
        usuario: dados.usuario,
        // O back-end gera tokens de 2 horas
        expiraEm: Date.now() + 2 * 60 * 60 * 1000,
    };
    try {
        localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
    } catch {
        // navegador sem localStorage (aba anônima com bloqueio, por exemplo)
    }
    avisarMudanca();
}

export function encerrarSessao() {
    try {
        localStorage.removeItem(CHAVE_SESSAO);
    } catch {}
    avisarMudanca();
}
