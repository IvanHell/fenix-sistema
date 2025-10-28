const mysql = require('mysql2');

// La forma MÁS SIMPLE y directa
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fenix_db',
    port: 3306
}).promise(); // ← ¡Convertir a promesas inmediatamente!

// Conectar
db.connect()
    .then(() => {
        console.log('✅ Conectado a MySQL94 - fenix_db');
    })
    .catch(err => {
        console.error('❌ Error conectando:', err.message);
    });

module.exports = db;