const db = require('./database');

async function inicializarBaseDeDatos() {
    try {
        console.log('🗄️ Inicializando base de datos en Aiven...');
        
        // 1. Verificar conexión
        const [connectionTest] = await db.execute('SELECT 1 as test');
        console.log('✅ Conexión a Aiven MySQL verificada');
        
        // 2. Crear tabla productos en defaultdb
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
        
        await db.execute(createTableSQL);
        console.log('✅ Tabla productos creada/verificada');
        
        // 3. Insertar datos de ejemplo
        const insertDataSQL = `
            INSERT IGNORE INTO productos 
            (folio, cliente, numero_parte, nombre, proyecto, largo, ancho, alto, ect, corrugado, codigo, documento) 
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const productos = [
            [
                "3763203", "Motus León", "1500885", "CAJA CON FONDO", 
                "U PACKAGING (U718)", 60.5, 56.3, 68, "ECT-32", 
                "SENCILLO", "ESP-LMT-203", 
                "https://drive.google.com/open?id=1W-7dNdLfqWEOjW8vjZlMbfVoOFtkoLFo&usp=drive_fs"
            ],
            [
                "1719240", "DAIMAY", "PKG0561", "CHAROLA", "-", 
                51.4, 16.5, 3.5, "ECT-32m", "MICRO", 
                "ESP-DAI-240", 
                "https://drive.google.com/open?id=11KyqDgNbHffUngeXEjmknjViiAJLsMg9&usp=drive_fs"
            ],
            [
                "1215115", "ADIENT Technotrim", "ROUSH", "CAJA CON FONDO", 
                "ROUSH", 60, 55, 39.8, "ECT-42", "DOBLE", 
                "ESP-TT-115", 
                "https://drive.google.com/open?id=1w8D0cRMMlIU-RNZVKHOhV9qxsg_3jYyv&usp=drive_fs"
            ],
            [
                "1914085", "GHSP", "60X36X22.9", "REJILLAS", 
                "KIT C1UG", 60, 42, 22.9, "ECT-32", "SENCILLO", 
                "ESP-GH-085", 
                "https://drive.google.com/file/d/1heKwWY3qIrhiNoBPEyRYqTYDqJ606y6N/view?usp=sharing"
            ]
        ];
        
        const promises = productos.map(producto => 
            db.execute(insertDataSQL, producto)
        );
        
        await Promise.all(promises);
        console.log('✅ Datos de ejemplo insertados');
        
        // 4. Verificar
        const [countResult] = await db.execute('SELECT COUNT(*) as total FROM productos');
        console.log(`📊 Total de productos en BD: ${countResult[0].total}`);
        
        console.log('🎉 Base de datos inicializada correctamente');
        
    } catch (err) {
        console.error('❌ Error inicializando base de datos:', err.message);
        throw err;
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    inicializarBaseDeDatos()
        .then(() => {
            console.log('🚀 Inicialización completada exitosamente');
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Error en inicialización:', error);
            process.exit(1);
        });
}

module.exports = inicializarBaseDeDatos;