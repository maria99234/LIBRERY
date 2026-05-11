const express = require('express');
const pool = require('./db');
const cors = require('cors'); 
const app = express();

app.use(cors()); 
app.use(express.json());

// --- RUTA DE LOGIN ---
app.post('/login', async (req, res) => {
    const { usuario, password } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM Usuario WHERE nombre_del_usuario = $1 AND pass = $2',
            [usuario, password]
        );

        if (result.rows.length > 0) {
            res.json({ success: true, mensaje: "¡Inicio de sesión correcto!" });
        } else {
            res.json({ success: false, mensaje: "Usuario o clave incorrecta" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, mensaje: "Error conectando a la base de datos" });
    }
});

// --- RUTA PASO 8 y 9: REGISTRAR EMPLEADO ---
app.post('/registrar-empleado', async (req, res) => {
    const { codigo, nombre, apellido1, apellido2, direccion, telefono, sexo, fecha_nac, turno } = req.body;
    try {
        const querySQL = `
            INSERT INTO Empleado (codigo, nombre, apellido1, apellido2, direccion, telefono, sexo, fecha_nac, turno)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;
        await pool.query(querySQL, [codigo, nombre, apellido1, apellido2, direccion, telefono, sexo, fecha_nac, turno]);
        
        // CAMBIO AQUÍ: Usamos la variable 'nombre' para que el mensaje sea dinámico
        res.json({ success: true, mensaje: `¡${nombre} ${apellido1} se registró con éxito!` });
        
    } catch (err) {
        console.error("Error al insertar:", err.message);
        res.status(500).json({ success: false, mensaje: "Error al registrar: " + err.message });
    }
});

// --- PASO 10: CONSULTA GENERAL (SQL EMPOTRADO SELECT) ---
app.get('/consultar-empleados', async (req, res) => {
    try {
        const querySQL = 'SELECT * FROM Empleado ORDER BY codigo ASC';
        const result = await pool.query(querySQL);
        
        // Enviamos las filas encontradas al frontend
        res.json({ success: true, datos: result.rows });
    } catch (err) {
        console.error("Error en consulta:", err.message);
        res.status(500).json({ success: false, mensaje: "Error al obtener empleados" });
    }
});

app.listen(3000, () => {
    console.log("✅ Servidor encendido en http://localhost:3000");
});