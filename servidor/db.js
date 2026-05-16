const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  
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