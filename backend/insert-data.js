const db = require('./database');

const productos = [
    {
        folio: "3763203",
        cliente: "Motus León",
        numeroParte: "1500885", 
        nombre: "CAJA CON FONDO",
        proyecto: "U PACKAGING (U718)",
        largo: 60.5,
        ancho: 56.3,
        alto: 68,
        ect: "ECT-32",
        corrugado: "SENCILLO",
        codigo: "ESP-LMT-203",
        documento: "https://drive.google.com/open?id=1W-7dNdLfqWEOjW8vjZlMbfVoOFtkoLFo&usp=drive_fs"
    },
    {
        folio: "1719240",
        cliente: "DAIMAY",
        numeroParte: "PKG0561",
        nombre: "CHAROLA", 
        proyecto: "-",
        largo: 51.4,
        ancho: 16.5,
        alto: 3.5,
        ect: "ECT-32m",
        corrugado: "MICRO",
        codigo: "ESP-DAI-240",
        documento: "https://drive.google.com/open?id=11KyqDgNbHffUngeXEjmknjViiAJLsMg9&usp=drive_fs"
    },
    {
        folio: "1215115", 
        cliente: "ADIENT Technotrim",
        numeroParte: "ROUSH",
        nombre: "CAJA CON FONDO",
        proyecto: "ROUSH",
        largo: 60,
        ancho: 55,
        alto: 39.8,
        ect: "ECT-42", 
        corrugado: "DOBLE",
        codigo: "ESP-TT-115",
        documento: "https://drive.google.com/open?id=1w8D0cRMMlIU-RNZVKHOhV9qxsg_3jYyv&usp=drive_fs"
    },
    {
        folio: "1914085",
        cliente: "GHSP",
        numeroParte: "60X36X22.9",
        nombre: "REJILLAS",
        proyecto: "KIT C1UG", 
        largo: 60,
        ancho: 42,
        alto: 22.9,
        ect: "ECT-32",
        corrugado: "SENCILLO",
        codigo: "ESP-GH-085",
        documento: "https://drive.google.com/open?id=1heKwWY3qIrhiNoBPEyRYqTYDqJ606y6N&usp=drive_fs"
    }
];

async function insertData() {
    try {
        const insertSQL = `
            INSERT IGNORE INTO productos 
            (folio, cliente, numero_parte, nombre, proyecto, largo, ancho, alto, ect, corrugado, codigo, documento) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        for (const producto of productos) {
            await db.execute(insertSQL, [
                producto.folio,
                producto.cliente, 
                producto.numeroParte,
                producto.nombre,
                producto.proyecto,
                producto.largo,
                producto.ancho,
                producto.alto,
                producto.ect,
                producto.corrugado,
                producto.codigo,
                producto.documento
            ]);
            console.log(`✅ Insertado: ${producto.cliente} - ${producto.nombre}`);
        }

        console.log('🎉 Todos los datos insertados correctamente');
        
    } catch (error) {
        console.error('❌ Error insertando datos:', error.message);
    }
}

insertData();