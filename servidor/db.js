const { Pool } = require('pg');

const pool = new Pool({
  user: 'administrador',      // <--- CAMBIA ESTO. Es el usuario que sale en tu imagen.
  host: 'localhost',          // Esto está bien
  database: 'libreria',       // Esto está bien
  password: '12345',          // Tu contraseña de pgAdmin
  port: 5432,                 // El puerto que se ve en tu imagen
});

module.exports = pool;