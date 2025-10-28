const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '130299',
    database: 'fenix_db',  // ¡IMPORTANTE: conectar a fenix_db!
    port: 3306
});

async function createTable() {
    try {
        console.log('🔧 Creando tabla productos...');
        
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
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_cliente (cliente),
                INDEX idx_numero_parte (numero_parte),
                INDEX idx_nombre (nombre)
            )
        `;
        
        await connection.promise().execute(createTableSQL);
        console.log('✅ Tabla "productos" creada exitosamente');
        
        // Verificar que se creó
        const [tables] = await connection.promise().execute('SHOW TABLES');
        console.log('📊 Tablas en fenix_db:');
        tables.forEach(table => {
            console.log('   -', table.Tables_in_fenix_db);
        });
        
    } catch (error) {
        console.error('❌ Error creando tabla:', error.message);
    } finally {
        connection.end();
    }
}

createTable();