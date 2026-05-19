const express = require('express');
const pool = require('./db'); 
const cors = require('cors'); 
const path = require('path'); 
const app = express();

app.use(cors()); 
app.use(express.json());
// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../')));

// LOGIN CORREGIDO CON TUS VARIABLES
app.post('/login', async (req, res) => {
    // Recibe las variables que manda el frontend
    const { usuario, password } = req.body;

    try {
        // 1. Busca usando tu columna exacta: 'nombre_del_usuario'
        const result = await pool.query('SELECT * FROM Usuario WHERE nombre_del_usuario = $1', [usuario]);
        const userFound = result.rows[0];

        if (!userFound) {
            return res.json({ 
                success: false, 
                mensaje: "Usuario o contraseña incorrectos." 
            });
        }
        
        // 2. Compara usando tu columna exacta: 'pass'
        if (userFound.pass === password) { 
            
            let paginaDestino = "biblioteca.html"; // Página por defecto

            // Asignación de tus páginas para redireccionar según corresponda
            if (userFound.nombre_del_usuario === 'Administrador') {
                paginaDestino = "biblioteca.html";
            } else if (userFound.nombre_del_usuario === 'Ivonne') {
                paginaDestino = "empleados.html";
            } else if (userFound.nombre_del_usuario === 'Blas') {
                paginaDestino = "empleados.html";
            }

            return res.json({
                success: true,
                mensaje: `¡Bienvenido(a) ${userFound.nombre_del_usuario}!`,
                redireccion: paginaDestino
            });

        } else {
            return res.json({ 
                success: false, 
                mensaje: "Usuario o contraseña incorrectos." 
            });
        }

    } catch (error) {
        console.error("Error en el login:", error);
        return res.status(500).json({ 
            success: false, 
            mensaje: "Error interno del servidor." 
        });
    }
});

// REGISTRAR EMPLEADO
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

// CONSULTA GENERAL EMPLEADOS
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

// REGISTRAR ALUMNO
app.post('/registrar-alumno', async (req, res) => {
    const { codigo, nombre, apellido1, apellido2, direccion, telefono, sexo, fecha_nac, correo, carrera } = req.body;
    try {
        const query = `
            INSERT INTO Alumno (
                codigo, nombre, apellido1, apellido2, direccion, 
                telefono, sexo, fecha_nac, correo, carrera
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;
        const valores = [codigo, nombre, apellido1, apellido2, direccion, telefono, sexo, fecha_nac, correo, carrera];
        await pool.query(query, valores);
        res.json({ success: true, mensaje: "El alumno ha sido guardado exitosamente." });
    } catch (err) {
        if (err.code === '23505') return res.status(400).json({ success: false, mensaje: "Ese código ya está registrado." });
        res.status(500).json({ success: false, mensaje: "Hubo un error al procesar el registro." });
    }
});

// CONSULTAR ALUMNOS
app.get('/consultar-alumnos', async (req, res) => {
    try {
        const resultado = await pool.query("SELECT * FROM Alumno ORDER BY nombre ASC");
        res.json({ success: true, datos: resultado.rows });
    } catch (err) {
        res.status(500).json({ success: false, mensaje: "No se pudieron obtener los datos." });
    }
});

// REGISTRAR PROFESOR
app.post('/registrar-profesor', async (req, res) => {
    const { codigo, nombre, apellido1, apellido2, direccion, telefono, sexo, fecha_nac, correo, departamento } = req.body;
    try {
        const query = `
            INSERT INTO Profesor (
                codigo, nombre, apellido1, apellido2, direccion, 
                telefono, sexo, fecha_nac, correo, departamento
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;
        const valores = [codigo, nombre, apellido1, apellido2, direccion, telefono, sexo, fecha_nac, correo, departamento];
        await pool.query(query, valores);
        res.json({ success: true, mensaje: "Profesor guardado exitosamente." });
    } catch (err) {
        if (err.code === '23505') return res.status(400).json({ success: false, mensaje: "Ese código ya está registrado." });
        res.status(500).json({ success: false, mensaje: "Hubo un error al procesar el registro." });
    }
});

// CONSULTAR PROFESORES
app.get('/consultar-profesores', async (req, res) => {
    try {
        const resultado = await pool.query("SELECT * FROM Profesor ORDER BY nombre ASC");
        res.json({ success: true, datos: resultado.rows });
    } catch (err) {
        res.status(500).json({ success: false, mensaje: "No se pudieron obtener los datos." });
    }
});

// REGISTRAR LIBROS
app.post('/registrar-libro', async (req, res) => {
    const { isbn, titulo, autores, editorial, anio_public, num_ejemplares } = req.body;
    try {
        const query = `
            INSERT INTO Libro (isbn, titulo, autores, editorial, anio_public, num_ejemplar) 
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const valores = [isbn, titulo, autores, editorial, anio_public, num_ejemplares];
        await pool.query(query, valores);
        res.json({ success: true, mensaje: "El libro ha sido guardado exitosamente." });
    } catch (err) {
        if (err.code === '23505') return res.status(400).json({ success: false, mensaje: "Ese código ya está registrado." });
        res.status(500).json({ success: false, mensaje: "Hubo un error al procesar el registro." });
    }
});

// NUEVA RUTA PARA VER LA TABLA
app.get('/consultar-libro', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM Libro ORDER BY titulo ASC');
        res.json({ 
            success: true, 
            datos: resultado.rows 
        });
    } catch (err) {
        console.error("Error al consultar libros:", err);
        res.status(500).json({ 
            success: false, 
            mensaje: "Error al obtener los libros desde la base de datos." 
        });
    }
});

app.listen(4000, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo: http://localhost:4000`);
});