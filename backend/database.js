const mysql = require('mysql2');

console.log('🔧 Iniciando conexión a Aiven MySQL...');

// Certificate SSL que te dio Aiven
const caCertificate = `-----BEGIN CERTIFICATE-----
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
-----END CERTIFICATE-----`;

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        ca: caCertificate,
        rejectUnauthorized: true
    },
    connectTimeout: 60000
};

console.log('📋 Configuración Aiven con SSL:');
console.log('- Host:', dbConfig.host);
console.log('- Database:', dbConfig.database);
console.log('- SSL:', '✅ ACTIVADO con certificado');

const pool = mysql.createPool(dbConfig);

pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ ERROR Aiven MySQL:', err.message);
        console.error('🔍 Código:', err.code);
    } else {
        console.log('✅ CONEXIÓN EXITOSA a Aiven MySQL con SSL');
        connection.release();
    }
});

module.exports = pool.promise();
