const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "biblioteca",
  password:"12345",
  port: 5432,
  
});

// Prueba de conexión
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ ERROR DE CONEXIÓN:', err.message);
  } else {
    console.log('✅ CONEXIÓN EXITOSA A LA BASE DE DATOS');
    release();
  }
});

module.exports = pool;