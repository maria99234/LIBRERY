const express = require('express');
const pool = require('./db'); 
const cors = require('cors'); 
const path = require('path'); 
const app = express();

app.use(cors()); 
app.use(express.json());
// Servir archivos estáticos (asegúrate de que la ruta sea correcta según tu estructura)
app.use(express.static(path.join(__dirname, '../')));

// LOGIN
app.post('/login', async (req, res) => {
    const { usuario, password } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM Usuario WHERE nombre_del_usuario = $1 AND pass = $2',
            [usuario, password]
        );
        res.json({ success: result.rows.length > 0 });
    } catch (err) { 
        res.status(500).json({ success: false }); 
    }
});

// REGISTRAR EMPLEADO (Paso de inserción con SQL empotrado)
app.post('/registrar-empleado', async (req, res) => {
    const { codigo, nombre, apellido1, apellido2, direccion, telefono, sexo, fecha_nac, turno } = req.body;
    try {
        await pool.query(
            'INSERT INTO Empleado (codigo, nombre, apellido1, apellido2, direccion, telefono, sexo, fecha_nac, turno) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)', 
            [codigo, nombre, apellido1, apellido2, direccion, telefono, sexo, fecha_nac, turno]
        );
        res.json({ success: true, mensaje: "✅ Empleado guardado exitosamente" });
    } catch (e) { 
        res.status(500).json({ success: false, mensaje: "Error al registrar: " + e.message }); 
    }
});

// CONSULTA GENERAL (Paso 10: SQL empotrado para mostrar en tabla)
app.get('/consultar-empleados', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Empleado ORDER BY codigo ASC');
        res.json({ 
            success: true, 
            datos: result.rows 
        });
    } catch (e) { 
        res.status(500).json({ success: false, mensaje: e.message }); 
    }
});

app.listen(4000, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo: http://localhost:4000`);
});