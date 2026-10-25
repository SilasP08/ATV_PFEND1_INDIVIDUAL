import multer from "multer";
import { randomUUID } from "crypto";
import { mkdirSync } from "fs";
import { extname, resolve } from "path";

const DIRETORIO_UPLOADS = resolve("uploads/produtos");
mkdirSync(DIRETORIO_UPLOADS, { recursive: true });

const MIME_TYPES_VALIDOS = ['image/jpeg', 'image/png', 'image/webp'];

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, DIRETORIO_UPLOADS);
    },
    filename: (_req, file, callback) => {
        const extensao = extname(file.originalname).toLowerCase();
        callback(null, `${randomUUID()}${extensao}`);
    }
});

const upload = multer({
    storage, 
    limits: { fileSize: 2 * 1024 * 1024 }, // Limite de 2MB
    fileFilter: (_req, file, callback) => {
        if(!MIME_TYPES_VALIDOS.includes(file.mimetype)) {
            const erro = new Error("Tipo de arquivo inválido. Apenas JPEG, PNG e WEBP são permitidos.");
            erro.status = 415; // HTTP 415 Unsupported Media Type
            return callback(erro);
        }
        return callback(null, true);
    }
});

export function uploadImagem(req, res, next) {
    upload.single('imagem')(req, res, (erro) => {
        if (erro instanceof multer.MulterError && erro.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ sucesso: false, mensagem: erro.message});
        }
        if(erro) {
            return next(erro);
        }
        if (!req.file) {
            return res.status(400).json({ sucesso: false, mensagem: "Nenhum arquivo enviado." });
        }
        return next();
    });
}