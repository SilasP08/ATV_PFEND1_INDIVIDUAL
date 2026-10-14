import mysql from 'mysql2/promise';

export function  criarPool() {
    return mysql.createPool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME,
        waitForConnections: true, // permite fila, se estiver False, as 11° conexões retorna erro
        connectionLimit: 10, // limite maximos de conexões simultâneas
        queueLimit: 0 // Limite da fila do waitForConnections, 0 a fila infinita
    })
}