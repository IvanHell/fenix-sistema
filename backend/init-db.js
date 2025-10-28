const db = require('./database');

// Crear base de datos si no existe
db.execute(`CREATE DATABASE IF NOT EXISTS fenix_db`)
    .then(() => {
        console.log('✅ Base de datos fenix_db creada/verificada');
        
        // Usar la base de datos
        return db.execute(`USE fenix_db`);
    })
    .then(() => {
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
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_cliente (cliente),
                INDEX idx_numero_parte (numero_parte),
                INDEX idx_nombre (nombre)
            )
        `;
        
        return db.execute(createTableSQL);
    })
    .then(() => {
        console.log('✅ Tabla productos creada/verificada');
        
        // Insertar datos de ejemplo
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
                "https://drive.google.com/open?id=1heKwWY3qIrhiNoBPEyRYqTYDqJ606y6N&usp=drive_fs"
            ]
        ];
        
        const promises = productos.map(producto => 
            db.execute(insertDataSQL, producto)
        );
        
        return Promise.all(promises);
    })
    .then(() => {
        console.log('✅ Datos de ejemplo insertados');
        console.log('🎉 Base de datos inicializada correctamente');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error inicializando base de datos:', err);
        process.exit(1);
    });