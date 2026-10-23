
// import Image from "next/image";
import Link from "next/link";
import "./cardProduto.css";


export default function CardProduto({ produto }) {
    return (
        <article className="produto-card">
            <div className="produto-card-imagem">
                {produto.etiqueta && (
                    <span className="produto-card-etiqueta">
                        {produto.etiqueta}
                    </span>
                )}

                <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="produto-card-foto"
                />
            </div>

            <div className="produto-card-conteudo">
                <span className="produto-card-categoria">
                    {produto.categoria}
                </span>

                <h3>{produto.nome}</h3>

                <p className="produto-card-descricao">
                    {produto.descricao}
                </p>

                <div className="produto-card-rodape">
                    <div className="produto-card-preco">
                        <span>R$</span>
                        <strong>{produto.preco}</strong>
                    </div>

                    <Link
                        href={`/produtos/${produto.id}`}
                        className="produto-card-comprar"
                        aria-label={`Ver produto ${produto.nome}`}
                    >
                        Comprar
                    </Link>
                </div>
            </div>
        </article>
    );
}
