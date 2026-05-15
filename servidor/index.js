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


// --- RUTA PARA REGISTRAR ALUMNO ---
app.post('/registrar-alumno', async (req, res) => {
    // Obtenemos los datos desde el formulario HTML
    const { 
        codigo, 
        nombre, 
        apellido1, 
        apellido2, 
        direccion, 
        telefono, 
        sexo, 
        fecha_nac, 
        correo, 
        carrera 
    } = req.body;

    try {
        // SQL empotrado para la inserción en la tabla Alumno
        const query = `
            INSERT INTO Alumno (
                codigo, nombre, apellido1, apellido2, direccion, 
                telefono, sexo, fecha_nac, correo, carrera
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;

        const valores = [
            codigo, 
            nombre, 
            apellido1, 
            apellido2, 
            direccion, 
            telefono, 
            sexo, 
            fecha_nac, 
            correo, 
            carrera
        ];

        // Ejecución de la consulta
        await pool.query(query, valores);

        // Si todo sale bien, enviamos éxito al frontend
        res.json({ 
            success: true, 
            mensaje: "El alumno ha sido guardado exitosamente." 
        });

    } catch (err) {
        console.error("Error al insertar en Alumno:", err);
        
        // Manejo de error por si el código ya existe
        if (err.code === '23505') {
            return res.status(400).json({ 
                success: false, 
                mensaje: "Ese código ya está registrado." 
            });
        }

        res.status(500).json({ 
            success: false, 
            mensaje: "Hubo un error al procesar el registro." 
        });
    }
});

// --- RUTA PARA CONSULTA GENERAL ---
app.get('/consultar-alumnos', async (req, res) => {
    try {
        // Consulta SQL para traer a todos los alumnos
        const resultado = await pool.query("SELECT * FROM Alumno ORDER BY nombre ASC");
        
        res.json({ 
            success: true, 
            datos: resultado.rows 
        });
    } catch (err) {
        console.error("Error en consulta general:", err);
        res.status(500).json({ 
            success: false, 
            mensaje: "No se pudieron obtener los datos de los alumnos." 
        });
    }
});

// --- RUTA PARA REGISTRAR PROFESORES ---
app.post('/registrar-profesor', async (req, res) => {
    // Obtenemos los datos desde el formulario HTML
    const { 
        codigo, 
        nombre, 
        apellido1, 
        apellido2, 
        direccion, 
        telefono, 
        sexo, 
        fecha_nac, 
        correo, 
        departamento 
    } = req.body;

    try {
        // SQL empotrado para la inserción en la tabla Profesor
        const query = `
            INSERT INTO Profesor (
                codigo, nombre, apellido1, apellido2, direccion, 
                telefono, sexo, fecha_nac, correo, departamento
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;

        const valores = [
            codigo, 
            nombre, 
            apellido1, 
            apellido2, 
            direccion, 
            telefono, 
            sexo, 
            fecha_nac, 
            correo, 
            departamento
        ];

        // Ejecución de la consulta
        await pool.query(query, valores);

        // Si todo sale bien.
        res.json({ 
            success: true, 
            mensaje: "El profesor ha sido guardado exitosamente." 
        });

    } catch (err) {
        console.error("Error al insertar en Profesor:", err);
        
        // Manejo de error por si el código ya existe
        if (err.code === '23505') {
            return res.status(400).json({ 
                success: false, 
                mensaje: "Ese código ya está registrado." 
            });
        }

        res.status(500).json({ 
            success: false, 
            mensaje: "Hubo un error al procesar el registro." 
        });
    }
});

// --- RUTA PARA CONSULTA GENERAL ---
app.get('/consultar-profesores', async (req, res) => {
    try {
        // Consulta SQL para traer a todos los profesores
        const resultado = await pool.query("SELECT * FROM Profesor ORDER BY nombre ASC");
        
        res.json({ 
            success: true, 
            datos: resultado.rows 
        });
    } catch (err) {
        console.error("Error en consulta general:", err);
        res.status(500).json({ 
            success: false, 
            mensaje: "No se pudieron obtener los datos de los profesores." 
        });
    }
});

app.listen(4000, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo: http://localhost:4000`);
});