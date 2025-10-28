const mysql = require('mysql2');

// Configuración para desarrollo y producción
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root', 
    password: process.env.DB_PASSWORD || '130299',
    database: process.env.DB_NAME || 'fenix_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    reconnect: true
};

// Crear pool de conexiones (mejor para producción)
const pool = mysql.createPool(dbConfig);

// Probar la conexión
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err.message);
        console.log('🔧 Configuración usada:', {
            host: dbConfig.host,
            user: dbConfig.user,
            database: dbConfig.database,
            port: dbConfig.port
        });
    } else {
        console.log('✅ Conectado a MySQL - Base:', dbConfig.database);
        connection.release();
    }
});

// Exportar el pool con promesas
module.exports = pool.promise();