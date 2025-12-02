const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '130299',
    port: 3306
});

async function setupDatabase() {
    try {
        console.log('🚀 Configurando base de datos FENIX...');
        
        // 1. Crear base de datos si no existe
        await connection.promise().execute('CREATE DATABASE IF NOT EXISTS fenix_db');
        console.log('✅ 1. Base de datos fenix_db verificada');
        
        // 2. Usar la base de datos
        await connection.promise().execute('USE fenix_db');
        console.log('✅ 2. Usando fenix_db');
        
        // 3. Crear tabla productos
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
        console.log('✅ 3. Tabla productos creada/verificada');
        
        console.log('🎉 Base de datos configurada correctamente!');
        
    } catch (error) {
        console.error('❌ Error en setup:', error.message);
    } finally {
        connection.end();
    }
}

setupDatabase();