const mysql = require('mysql2');

console.log('🔧 Iniciando conexión a BD...');// mensaje para conexion

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

    ssl: { rejectUnauthorized: false } //cada foro dice que es importante
};

console.log('📋 Configuración DB cargada:');
console.log('- Host:', dbConfig.host ? '✅' : '❌', dbConfig.host);
console.log('- User:', dbConfig.user ? '✅' : '❌', dbConfig.user);
console.log('- Database:', dbConfig.database ? '✅' : '❌', dbConfig.database);
console.log('- Port:', dbConfig.port ? '✅' : '❌', dbConfig.port);
console.log('- Password:', dbConfig.password ? '✅' : '❌', '••••••');

// Crear pool de conexiones (mejor para producción)
const pool = mysql.createPool(dbConfig);

// Probar la conexión
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ ERROR conectando a MySQL:');
        console.error('🔍 Código:', err.code);
        console.error('🔍 Mensaje:', err.message);
        console.error('🔍 Número error:', err.errno);
        console.error('🔍 SQL State:', err.sqlState);
        console.log('🔧 Configuración usada:', {
            host: dbConfig.host,
            user: dbConfig.user,
            database: dbConfig.database,
            port: dbConfig.port
        });
    } else {
        console.log('✅ CONEXIÓN EXITOSA a MySQL');
        console.log('📊 Base de datos:', dbConfig.database);
        console.log('🏷️ Thread ID:', connection.threadId);
        connection.release();
    }
});

// Exportar el pool con promesas
module.exports = pool.promise();
