// Servidor de la felicitación de Nico & Yoel.
// Sirve la web (carpeta public) y guarda las tres firmas en Postgres (Neon).
const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;
const MUROS = ['yo', 'nico', 'yoel'];
const MAX_BYTES = 3 * 1024 * 1024; // 3 MB por firma, de sobra

// Si no hay DATABASE_URL (pruebas en tu PC) se guarda en memoria.
let pool = null;
const memoria = new Map();
if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
}

async function prepararBD() {
  if (!pool) return;
  await pool.query(`CREATE TABLE IF NOT EXISTS firmas (
    muro TEXT PRIMARY KEY,
    imagen TEXT NOT NULL,
    actualizada TIMESTAMPTZ NOT NULL DEFAULT now()
  )`);
}

app.use(express.json({ limit: '4mb' }));
// La página siempre se pide de nuevo (así los cambios se ven al momento);
// las fotos y los coches se guardan una hora en el móvil para que cargue rápido.
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1h',
  setHeaders: (res, file) => { if (file.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache'); }
}));

// Todas las firmas guardadas: { yo: "data:image/png;base64,...", ... }
app.get('/api/firmas', async (req, res) => {
  try {
    const out = {};
    if (pool) {
      const r = await pool.query('SELECT muro, imagen FROM firmas');
      r.rows.forEach(f => { out[f.muro] = f.imagen; });
    } else {
      memoria.forEach((v, k) => { out[k] = v; });
    }
    res.set('Cache-Control', 'no-store').json(out);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'No se pudieron leer las firmas' });
  }
});

// Guardar (o reemplazar) la firma de un muro
app.put('/api/firmas/:muro', async (req, res) => {
  const muro = req.params.muro;
  const imagen = req.body && req.body.imagen;
  if (!MUROS.includes(muro)) return res.status(404).json({ error: 'Ese muro no existe' });
  if (typeof imagen !== 'string' || !/^data:image\/(png|webp);base64,[A-Za-z0-9+/=]+$/.test(imagen))
    return res.status(400).json({ error: 'La firma no tiene un formato válido' });
  if (imagen.length > MAX_BYTES) return res.status(413).json({ error: 'La firma es demasiado grande' });
  try {
    if (pool) {
      await pool.query(
        `INSERT INTO firmas (muro, imagen) VALUES ($1, $2)
         ON CONFLICT (muro) DO UPDATE SET imagen = EXCLUDED.imagen, actualizada = now()`,
        [muro, imagen]);
    } else {
      memoria.set(muro, imagen);
    }
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'No se pudo guardar la firma' });
  }
});

prepararBD()
  .then(() => app.listen(PORT, () => console.log(`Felicitación lista en el puerto ${PORT}`)))
  .catch(e => { console.error('Error al preparar la base de datos:', e); process.exit(1); });
