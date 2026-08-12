require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: turn incoming JSON bodies into JS objects (req.body)
app.use(express.json());
app.use(cors());

// Home route - sanity check that the server is alive
app.get('/', (req, res) => {
  res.json({ message: 'Hello World! Campus Marketplace API is running.' });
});

// ---- READ ALL ----
// GET /listings -> every listing in the database
app.get('/listings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM listings ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- READ ONE ----
// GET /listings/:id -> a single listing by its id
app.get('/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM listings WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- CREATE ----
// POST /listings -> add a new listing (this is "posting an ad" on OLX)
app.post('/listings', async (req, res) => {
  try {
    const { user_id, title, description, price, category, image_url } = req.body;

    // Basic validation - every ad needs a title and a seller
    if (!user_id || !title || !category) {
      return res.status(400).json({ error: 'user_id, title and category are required' });
    }

    const result = await pool.query(
      `INSERT INTO listings (user_id, title, description, price, category, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [user_id, title, description || null, price ?? 0, category, image_url || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- UPDATE ----
// PUT /listings/:id -> replace a listing (this is "editing an ad")
app.put('/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, image_url } = req.body;

    const existing = await pool.query('SELECT * FROM listings WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const result = await pool.query(
      `UPDATE listings
       SET title = $1, description = $2, price = $3, category = $4, image_url = $5
       WHERE id = $6
       RETURNING *`,
      [
        title ?? existing.rows[0].title,
        description ?? existing.rows[0].description,
        price ?? existing.rows[0].price,
        category ?? existing.rows[0].category,
        image_url ?? existing.rows[0].image_url,
        id,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- DELETE ----
// DELETE /listings/:id -> remove a listing (this is "removing a sold item")
app.delete('/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM listings WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json({ message: 'Listing deleted', deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Campus Marketplace server running on http://localhost:${PORT}`);
});
