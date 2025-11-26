const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001; //cambio de 3000 a 3001

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Ruta principal - sirve tu HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../FENIX2.0.html'));
});

// Ruta para búsqueda con MySQL
app.post('/api/buscar', async (req, res) => {
    console.log('🔍 Búsqueda recibida en /api/buscar');
    console.log('📦 body recibido:', req.body);
    const { cliente, numeroParte, nombre, proyecto, ect, largo, ancho, alto } = req.body;
    
    try {
        let query = `
        SELECT 
        folio,
        cliente,
        numero_parte as numeroParte,
        nombre,
        proyecto,
        largo,
        ancho,
        alto,
        ect,
        corrugado,
        codigo,
        documento
        FROM productos WHERE 1=1
        `;
        const params = [];
        
        if (cliente && cliente.trim() !== '') {
            query += ' AND cliente LIKE ?';
            params.push(`%${cliente}%`);
        }
        if (numeroParte && numeroParte.trim() !== '') {
            query += ' AND numero_parte LIKE ?';
            params.push(`%${numeroParte}%`);
        }
        if (nombre && nombre.trim() !== '') {
            query += ' AND nombre LIKE ?';
            params.push(`%${nombre}%`);
        }
        if (proyecto && proyecto.trim() !== '') {
            query += ' AND proyecto LIKE ?';
            params.push(`%${proyecto}%`);
        }
        if (ect && ect.trim() !== '') {
            query += ' AND ect LIKE ?';
            params.push(`%${ect}%`);
        }
        if (largo && largo !== '') {
            query += ' AND largo BETWEEN ? AND ?';
            const largoNum = parseFloat(largo);
            params.push(largoNum - 0.5);
            params.push(largoNum + 0.5);
        }
        if (ancho && ancho !== '') {
            query += ' AND ancho BETWEEN ? AND ?';
            const anchoNum = parseFloat(ancho);
            params.push(anchoNum - 0.5);
            params.push(anchoNum + 0.5);
        }       
        if (alto && alto !== '') {
            query += ' AND alto BETWEEN ? AND ?';
            const altoNum = parseFloat(alto);
            params.push(altoNum - 0.5);
            params.push(altoNum + 0.5);
        }
        
        query += ' ORDER BY cliente, numero_parte';
        
        console.log('Query:', query);
        console.log('Params:', params);
        
        const [resultados] = await db.execute(query, params);
        
        console.log(`Encontrados: ${resultados.length} productos`);
        res.json(resultados);
        
    } catch (error) {
        console.error('❌ Error en búsqueda MySQL:', error);
        console.error('🔍 Detalles del error:', error.message);
        res.status(500).json({ 
            error: 'Error en la base de datos',
            message: error.message
        });
    }
});

// Ruta para obtener todos los productos (para testing)
app.get('/api/productos', async (req, res) => {
    try {
        const [productos] = await db.execute('SELECT * FROM productos');
        res.json(productos);
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({ error: 'Error en la base de datos' });
    }
});

// Ruta de salud del servidor y BD
app.get('/api/health', async (req, res) => {
    try {
        const [result] = await db.execute('SELECT 1 as healthy');
        
        res.json({ 
            status: 'OK', 
            message: '🐦‍🔥 FENIX backend y BD funcionando',
            database: 'Connected ✅',
            timestamp: new Date().toISOString(),
            details: {
                backend: 'Node.js + Express',
                database: 'MySQL',
                products_count: '4 registros'
            }
        });
    } catch (error) {
        res.json({ 
            status: 'WARNING', 
            message: '🐦‍🔥 FENIX backend funcionando',
            database: 'Disconnected ❌',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// ==============================================
// RUTAS DE ADMINISTRACIÓN
// ==============================================

// Obtener todos los productos (con paginación)
app.get('/api/admin/productos', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const offset = (page - 1) * limit;

        const [productos] = await db.execute(
            'SELECT * FROM productos ORDER BY id DESC LIMIT ? OFFSET ?',
            [limit.toString(), offset.toString()]
        );
        
        const [total] = await db.execute('SELECT COUNT(*) as total FROM productos');
        
        res.json({
            productos,
            pagination: {
                page,
                limit,
                total: total[0].total,
                totalPages: Math.ceil(total[0].total / limit)
            }
        });
    } catch (error) {
        console.error('❌ Error obteniendo productos:', error);
        res.status(500).json({ error: error.message });
    }
});

// Obtener un producto específico por ID
app.get('/api/admin/productos/:id', async (req, res) => {
    try {
        const [productos] = await db.execute(
            'SELECT * FROM productos WHERE id = ?',
            [req.params.id]
        );
        
        if (productos.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json(productos[0]);
    } catch (error) {
        console.error('❌ Error obteniendo producto:', error);
        res.status(500).json({ error: error.message });
    }
});

// Actualizar un producto
app.put('/api/admin/productos/:id', async (req, res) => {
    try {
        const { cliente, numero_parte, nombre, proyecto, largo, ancho, alto, ect, corrugado, codigo, documento } = req.body;
        
        await db.execute(
            `UPDATE productos 
             SET cliente = ?, numero_parte = ?, nombre = ?, proyecto = ?, 
                 largo = ?, ancho = ?, alto = ?, ect = ?, corrugado = ?, 
                 codigo = ?, documento = ? 
             WHERE id = ?`,
            [cliente, numero_parte, nombre, proyecto, largo, ancho, alto, ect, corrugado, codigo, documento, req.params.id]
        );
        
        res.json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
        console.error('❌ Error actualizando producto:', error);
        res.status(500).json({ error: error.message });
    }
});

// Eliminar un producto
app.delete('/api/admin/productos/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM productos WHERE id = ?', [req.params.id]);
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('❌ Error eliminando producto:', error);
        res.status(500).json({ error: error.message });
    }
});

// Agregar nuevo producto
app.post('/api/admin/productos', async (req, res) => {
    try {
        const { folio, cliente, numero_parte, nombre, proyecto, largo, ancho, alto, ect, corrugado, codigo, documento } = req.body;
        
        await db.execute(
            `INSERT INTO productos 
             (folio, cliente, numero_parte, nombre, proyecto, largo, ancho, alto, ect, corrugado, codigo, documento) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [folio, cliente, numero_parte, nombre, proyecto, largo, ancho, alto, ect, corrugado, codigo, documento]
        );
        
        res.json({ message: 'Producto agregado correctamente' });
    } catch (error) {
        console.error('❌ Error agregando producto:', error);
        res.status(500).json({ error: error.message });
    }
});

// Ruta para el panel de administración
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-panel.html'));
});

// INICIO DEL SERVIDOR (SOLO UNA VEZ)
app.listen(PORT, () => {
    console.log(`🚀 Servidor FENIX corriendo en puerto ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🔍 Ruta de salud: http://localhost:${PORT}/api/health`);
    console.log(`👨‍💼 Panel admin: http://localhost:${PORT}/admin`);
});
