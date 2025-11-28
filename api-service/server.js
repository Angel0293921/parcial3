const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Render PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Rutas CRUD
app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM users WHERE id=$1', [id]);
  res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
  // POST /api/users - Crear nuevo usuario
app.post('/api/users', async (req, res) => {
    try {
        const { nombre, correo } = req.body;
        const result = await pool.query('INSERT INTO users (nombre, correo) VALUES ($1, $2) RETURNING *', [nombre, correo]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, correo } = req.body;
        const result = await pool.query('UPDATE users SET nombre=$1, correo=$2 WHERE id=$3 RETURNING *', [nombre, correo, id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Iniciar server en puerto 3000
app.listen(PORT, () => console.log("LA API ESTA CORRIENDO EN EL PUERTO 3000"));