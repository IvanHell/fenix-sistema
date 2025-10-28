const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '130299',
    port: 3306
});

async function createDatabase() {
    try {
        // Crear base de datos
        await connection.promise().execute('CREATE DATABASE IF NOT EXISTS fenix_db');
        console.log('✅ Base de datos "fenix_db" creada');
        
        // Usar la base de datos
        await connection.promise().execute('USE fenix_db');
        console.log('✅ Usando base de datos fenix_db');
        
        // Crear tabla productos
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS productos (
                id INT PRIMARY KEY AUTO_INCREMENT,
                folio VARCHAR(50) UNIQUE NOT NULL,
                cliente VARCHAR(100) NOT NULL,
                numero_parte VARCHAR(100) NOT NULL,
                nombre VARCHAR(200) NOT NULL,
                proyecto VARCHAR(100),
                largo DECIMAL(10,2),
                ancho DECIMAL(10,2),
                alto DECIMAL(10,2),
                ect VARCHAR(20),
                corrugado VARCHAR(50),
                codigo VARCHAR(100),
                documento TEXT,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        await connection.promise().execute(createTableSQL);
        console.log('✅ Tabla "productos" creada');
        
        console.log('🎉 Base de datos FENIX configurada correctamente');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        connection.end();
    }
}

createDatabase();