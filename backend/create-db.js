const mysql = require('mysql2/promise');
const XLSX = require('xlsx');
const fs = require('fs');


const config = {
    host: 'mysql-20c36a47-carloschl080-15b8.g.aivencloud.com', 
    user: 'avnadmin', 
    password: 'AVNS_kAS6-iWvIbXMCcyM69z', 
    port: 22386, 
    database: 'fenix_db', 
    ssl: {
        rejectUnauthorized: true,
        ca: `-----BEGIN CERTIFICATE-----
MIIEUDCCArigAwIBAgIUYrRDxkjdc4iVaOVGkiRg8G8ljsQwDQYJKoZIhvcNAQEM
BQAwQDE+MDwGA1UEAww1Njc0MjAzNjItZGFmMi00ZmQxLWJiNTEtYWYwOWMxYmVh
Nzk3IEdFTiAxIFByb2plY3QgQ0EwHhcNMjUxMTI2MjAyNzMxWhcNMzUxMTI0MjAy
NzMxWjBAMT4wPAYDVQQDDDU2NzQyMDM2Mi1kYWYyLTRmZDEtYmI1MS1hZjA5YzFi
ZWE3OTcgR0VOIDEgUHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCC
AYoCggGBAKGnFcnUD0ZWUm/wwV8Zzeqmcmyd5Mm0ZCcDRY92/pCg+7xfjTJURzkT
xRfdE8qvRL9ZTNAOiY2vRMLwVwYAFe2TajwopZtrfghOzVU2ISdkAuTpwhuDTsOG
nscav6bvncAjCQcJmqKx8wON6gIJ7npLkePIRtMw0Ruev1w8FVzohDA70pF2RimP
llHcQBYvIAq5o8o3scBUZjYB6uwn6tU8WitUn1DzH2VCOCHwHVGMl+OySMoOV5xo
GNWXqrgHDIgIQpaI/ZH8O0/mfk8usqnkxI00wBKXTktLmdgSatRjwmuTmFMEmoCR
bNTLX+dxwpNz3agsle2a5Mt6qsLWX1Mx2vh+4HMW7fojUJOSSUuRU37e/w8LqWs+
6J4QEVfZcrUL6RofxqBZcPfj4EJk7MheR7KKhDBzKMRim8U3FpdWJPsjwOmwfOUW
LXWZrHhLcxisnfhvdCszNNkaohzQUfSYnVhFqfJfimlrHx9Yh5kuF4FdxE0kgADP
YtmdeA67TQIDAQABo0IwQDAdBgNVHQ4EFgQULPLeTUvvgzes1a+9Jqc9ZoLXSOww
EgYDVR0TAQH/BAgwBgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQAD
ggGBAG5FBnCB3947+q8fBG7gEtAoXD7cxtoUVgrLAgtH0l1E7z9HRb4BxoTY6+da
44+0NI37JE1tRySyzWqFrE0PlidXyc+ClOHjq5/W7ziV+49bv+LZ61BdloBwVjed
kag2fUsNmxNSnpMXAsIZeTHbW94u6T0kj0wCnFwIo7juAAW4LM2P3OrcRvgRdcbm
gs6HBSdYkbwLwvpuKRvU+hBfbIsA2iGXZBr6k0CLVxmdrNm7esk7o1UdCoN0ECws
nYJVwuIK8RsCQUa09mDSo/8w+2P4Jn1FmTEUWYn0WSskfLr0A3bcsxT4w4YIDyLb
L6h/OA+PJx69BpGiBqCQjK6UvPluLlq31zbY0CvF7PVvRhnmOGO3P1VXZdxKbvVH
/IJm9E6aG2oCR85SRBeXFvODj2XtaNlQM5t4mKAYcQnK04RVnMiRrdTZ9VE/1Rwy
riA6qzfjVQci7EAbgJ8zQjQdExK9vhNF7YGY2gUxudOGBkQl7fm+wI/nju6VA0Fq
CVRNeA==
-----END CERTIFICATE-----
`
    }
};

async function main() {
    let connection;
    
    try {
        console.log('🚀 IMPORTADOR FINAL PARA FÉNIX PACKAGING');
        console.log('=========================================\n');
        
        // 1. BUSCAR ARCHIVO
        const archivos = fs.readdirSync('.').filter(file => 
            /\.(xlsx|xls|xlsm)$/i.test(file)
        );
        
        if (archivos.length === 0) {
            console.log('❌ No se encontraron archivos Excel');
            return;
        }
        
        const archivo = archivos[0];
        console.log(`📁 Archivo: ${archivo}\n`);
        
        // 2. LEER Y PROCESAR EXCEL
        console.log('📖 Leyendo estructura del Excel...');
        const workbook = XLSX.readFile(archivo);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const datosArray = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Los datos reales empiezan en fila 3 (índice 2)
        const datosReales = datosArray.slice(2);
        console.log(`📊 Registros para importar: ${datosReales.length.toLocaleString()}\n`);
        
        if (datosReales.length === 0) {
            console.log('❌ No hay datos para importar');
            return;
        }
        
        // Mostrar muestra de datos
        console.log('👀 MUESTRA DE DATOS (primeros 3 registros):');
        for (let i = 0; i < Math.min(3, datosReales.length); i++) {
            const fila = datosReales[i];
            console.log(`\n   Registro ${i + 1}:`);
            console.log(`     Folio: ${fila[0]}`);
            console.log(`     Cliente: ${fila[1]}`);
            console.log(`     Producto: ${fila[3]} (${fila[2]})`);
        }
        console.log('');
        
        // 3. CONFIRMAR IMPORTACIÓN
        console.log('⚠️  ¿Continuar con la importación?');
        console.log(`   Se importarán ${datosReales.length.toLocaleString()} registros`);
        console.log('   Presiona Ctrl+C para cancelar o espera 5 segundos para continuar...\n');
        
        // Esperar 5 segundos para dar chance de cancelar
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // 4. CONECTAR A BASE DE DATOS
        console.log('🔌 Conectando a la base de datos...');
        connection = await mysql.createConnection(config);
        
        // Crear/verificar base de datos y tabla
        await connection.query('CREATE DATABASE IF NOT EXISTS fenix_db');
        await connection.query('USE fenix_db');
        
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
                fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_folio (folio),
                INDEX idx_cliente (cliente),
                INDEX idx_codigo (codigo)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `;
        await connection.query(createTableSQL);
        console.log('✅ Base de datos y tabla lista\n');
        
        // 5. MAPEO CORREGIDO (basado en tu estructura real)
        console.log('🗺️  Configurando mapeo de columnas...');
        
        // Según tu estructura mostrada:
        // 0: Folio, 1: Cliente, 2: # De Parte, 3: Nombre, 4: PROYECTO
        // 5: LARGO, 6: ANCHO, 7: ALTO, 8: ECT, 9: CORRUGADO
        // 10: MEDIDA (ignorar), 11: CODIGO, 12: DIRECCIÓN
        
        const mapeoColumnas = {
            folio: 0,        // Columna A: Folio
            cliente: 1,      // Columna B: Cliente (tiene espacio al final: "Cliente ")
            numero_parte: 2, // Columna C: # De Parte
            nombre: 3,       // Columna D: Nombre (tiene espacio al final: "Nombre ")
            proyecto: 4,     // Columna E: PROYECTO
            largo: 5,        // Columna F: LARGO
            ancho: 6,        // Columna G: ANCHO
            alto: 7,         // Columna H: ALTO
            ect: 8,          // Columna I: ECT
            corrugado: 9,    // Columna J: CORRUGADO
            codigo: 11,      // Columna L: CODIGO (saltamos columna 10: MEDIDA)
            documento: 12    // Columna M: DIRECCIÓN
        };
        
        console.log('✅ Mapeo configurado correctamente\n');
        
        // 6. IMPORTAR DATOS
        console.log('⏳ Iniciando importación... Esto puede tomar unos minutos...\n');
        
        const insertSQL = `
            INSERT INTO productos 
            (folio, cliente, numero_parte, nombre, proyecto, largo, ancho, alto, ect, corrugado, codigo, documento)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                cliente = VALUES(cliente),
                numero_parte = VALUES(numero_parte),
                nombre = VALUES(nombre),
                proyecto = VALUES(proyecto),
                largo = VALUES(largo),
                ancho = VALUES(ancho),
                alto = VALUES(alto),
                ect = VALUES(ect),
                corrugado = VALUES(corrugado),
                codigo = VALUES(codigo),
                documento = VALUES(documento)
        `;
        
        let exitosos = 0;
        let duplicados = 0;
        let errores = 0;
        const startTime = Date.now();
        
        // Procesar en lotes para mejor performance
        const batchSize = 100;
        
        for (let i = 0; i < datosReales.length; i += batchSize) {
            const batch = datosReales.slice(i, i + batchSize);
            
            for (let j = 0; j < batch.length; j++) {
                const fila = batch[j];
                const filaNum = i + j + 3; // +3 porque: fila1 basura, fila2 encabezados, fila3 primer dato
                
                try {
                    // Extraer y limpiar valores
                    const folio = String(fila[mapeoColumnas.folio] || '').trim();
                    const cliente = String(fila[mapeoColumnas.cliente] || '').trim();
                    const numero_parte = String(fila[mapeoColumnas.numero_parte] || '').trim();
                    const nombre = String(fila[mapeoColumnas.nombre] || '').trim();
                    
                    // Validar campos requeridos
                    if (!folio || !cliente || !numero_parte || !nombre) {
                        errores++;
                        continue;
                    }
                    
                    // Preparar todos los valores
                    const valores = [
                        folio,
                        cliente,
                        numero_parte,
                        nombre,
                        fila[mapeoColumnas.proyecto] ? String(fila[mapeoColumnas.proyecto]).trim() : null,
                        fila[mapeoColumnas.largo] ? parseFloat(fila[mapeoColumnas.largo]) : null,
                        fila[mapeoColumnas.ancho] ? parseFloat(fila[mapeoColumnas.ancho]) : null,
                        fila[mapeoColumnas.alto] ? parseFloat(fila[mapeoColumnas.alto]) : null,
                        fila[mapeoColumnas.ect] ? String(fila[mapeoColumnas.ect]).trim().replace('ECT - ', 'ECT-') : null,
                        fila[mapeoColumnas.corrugado] ? String(fila[mapeoColumnas.corrugado]).trim() : null,
                        fila[mapeoColumnas.codigo] ? String(fila[mapeoColumnas.codigo]).trim() : null,
                        fila[mapeoColumnas.documento] ? String(fila[mapeoColumnas.documento]).trim() : null
                    ];
                    
                    // Insertar
                    await connection.execute(insertSQL, valores);
                    exitosos++;
                    
                } catch (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        duplicados++;
                    } else {
                        errores++;
                    }
                }
            }
            
            // Mostrar progreso
            const procesados = Math.min(i + batchSize, datosReales.length);
            const porcentaje = ((procesados / datosReales.length) * 100).toFixed(1);
            const elapsed = (Date.now() - startTime) / 1000;
            const speed = (procesados / elapsed).toFixed(1);
            
            console.log(`   📊 ${porcentaje}% - ${procesados.toLocaleString()}/${datosReales.length.toLocaleString()} (${speed} reg/seg)`);
        }
        
        // 7. CALCULAR TIEMPO Y ESTADÍSTICAS
        const totalTime = (Date.now() - startTime) / 1000;
        
        console.log('\n' + '='.repeat(60));
        console.log('✅ IMPORTACIÓN COMPLETADA EXITOSAMENTE');
        console.log('='.repeat(60));
        console.log(`⏱️  Tiempo total: ${totalTime.toFixed(1)} segundos`);
        console.log(`📥 Registros nuevos insertados: ${exitosos.toLocaleString()}`);
        console.log(`🔄 Registros duplicados (actualizados): ${duplicados.toLocaleString()}`);
        console.log(`❌ Registros con errores: ${errores.toLocaleString()}`);
        console.log(`📊 Total procesado: ${(exitosos + duplicados + errores).toLocaleString()}`);
        console.log(`🚀 Velocidad: ${(datosReales.length / totalTime).toFixed(1)} registros/segundo`);
        
        // 8. MOSTRAR ESTADÍSTICAS DETALLADAS
        console.log('\n📈 ESTADÍSTICAS DETALLADAS:');
        
        const [total] = await connection.query('SELECT COUNT(*) as total FROM productos');
        console.log(`   📋 Total en base de datos: ${total[0].total.toLocaleString()}`);
        
        const [clientes] = await connection.query('SELECT COUNT(DISTINCT cliente) as clientes FROM productos');
        console.log(`   👥 Clientes únicos: ${clientes[0].clientes}`);
        
        const [proyectos] = await connection.query('SELECT COUNT(DISTINCT proyecto) as proyectos FROM productos');
        console.log(`   📂 Proyectos únicos: ${proyectos[0].proyectos || 0}`);
        
        const [codigos] = await connection.query('SELECT COUNT(DISTINCT codigo) as codigos FROM productos');
        console.log(`   🏷️  Códigos únicos: ${codigos[0].codigos || 0}`);
        
        // Mostrar algunos registros de ejemplo
        console.log('\n📝 MUESTRA DE REGISTROS IMPORTADOS:');
        const [ejemplos] = await connection.query(`
            SELECT folio, cliente, nombre, codigo 
            FROM productos 
            ORDER BY id DESC 
            LIMIT 5
        `);
        
        ejemplos.forEach((reg, idx) => {
            console.log(`   ${idx + 1}. ${reg.folio} - ${reg.cliente}: ${reg.nombre.substring(0, 30)}...`);
        });
        
        console.log('\n✨ ¡IMPORTACIÓN COMPLETADA CON ÉXITO!');
        console.log('   Los datos están listos para usar en tu aplicación Fénix.');
        
    } catch (error) {
        console.error('\n💥 ERROR CRÍTICO:', error.message);
        if (error.code) console.error(`   Código: ${error.code}`);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔒 Conexión a MySQL cerrada correctamente');
        }
    }
}

// Ejecutar
main().catch(error => {
    console.error('💥 Error inesperado:', error);
    process.exit(1);
});