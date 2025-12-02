
const XLSX = require('xlsx');

async function analizarExcel() {
    try {
        const archivo = 'productos.xlsx'; // Cambia si tu archivo tiene otro nombre
        console.log(`🔍 Analizando: ${archivo}`);
        
        const workbook = XLSX.readFile(archivo);
        console.log(`\n📋 Hojas disponibles: ${workbook.SheetNames.join(', ')}`);
        
        // Analizar cada hoja
        workbook.SheetNames.forEach((sheetName, index) => {
            console.log(`\n📊 HOJA ${index + 1}: "${sheetName}"`);
            console.log('='.repeat(50));
            
            const worksheet = workbook.Sheets[sheetName];
            const datos = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Array de arrays
            
            if (datos.length === 0) {
                console.log('❌ La hoja está vacía');
                return;
            }
            
            // Mostrar encabezados (primera fila)
            console.log('📝 ENCABEZADOS (primera fila):');
            const encabezados = datos[0];
            encabezados.forEach((encabezado, i) => {
                console.log(`   Columna ${i + 1}: "${encabezado}"`);
            });
            
            // Mostrar algunas filas de datos
            console.log('\n📝 MUESTRA DE DATOS (primeras 5 filas después de encabezados):');
            for (let i = 1; i < Math.min(6, datos.length); i++) {
                const fila = datos[i];
                console.log(`\n   Fila ${i + 1}:`);
                fila.forEach((valor, j) => {
                    console.log(`     ${encabezados[j] || `Col${j+1}`}: ${valor}`);
                });
            }
            
            // Estadísticas
            console.log('\n📊 ESTADÍSTICAS:');
            console.log(`   Total filas: ${datos.length}`);
            console.log(`   Total columnas: ${encabezados.length}`);
            console.log(`   Filas con datos (sin encabezado): ${datos.length - 1}`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n💡 ¿Está el archivo en la misma carpeta?');
        console.log('💡 ¿Tienes permisos para leerlo?');
    }
}

analizarExcel();
