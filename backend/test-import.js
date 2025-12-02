
const XLSX = require('xlsx');

console.log('🧪 PROBANDO LECTURA DE EXCEL');
console.log('=============================\n');

const workbook = XLSX.readFile('productos.xlsx');
const worksheet = workbook.Sheets['Dibujos'];

// Leer como matriz
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log(`📊 Filas totales: ${data.length}`);
console.log(`📊 Columnas en fila 1: ${data[0]?.length || 0}`);
console.log(`📊 Columnas en fila 2 (encabezados): ${data[1]?.length || 0}\n`);

// Mostrar encabezados reales (fila 2)
console.log('📋 ENCABEZADOS REALES (fila 2):');
const headers = data[1];
headers.forEach((header, idx) => {
    if (header && header.toString().trim() !== '') {
        console.log(`   Col ${idx}: "${header}"`);
    }
});

// Mostrar primeros 3 registros reales (filas 3-5)
console.log('\n📝 PRIMEROS 3 REGISTROS REALES:');
for (let i = 2; i < Math.min(5, data.length); i++) {
    console.log(`\n📌 Fila ${i + 1} (Registro ${i - 1}):`);
    console.log(`   Folio: ${data[i][0]}`);
    console.log(`   Cliente: ${data[i][1]}`);
    console.log(`   # Parte: ${data[i][2]}`);
    console.log(`   Nombre: ${data[i][3]}`);
    console.log(`   Proyecto: ${data[i][4]}`);
    console.log(`   Largo: ${data[i][5]}`);
    console.log(`   Ancho: ${data[i][6]}`);
    console.log(`   Alto: ${data[i][7]}`);
    console.log(`   ECT: ${data[i][8]}`);
    console.log(`   Corrugado: ${data[i][9]}`);
    console.log(`   Código: ${data[i][11]}`);
    console.log(`   Documento: ${data[i][12]}`);
}

console.log('\n✅ Estructura analizada correctamente');
