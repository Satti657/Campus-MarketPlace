require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
  res.json({ message: 'Hello World! Campus Marketplace API is running.' });
});


app.get('/listings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM listings ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


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


app.post('/listings', authMiddleware, async (req, res) => {
  try {
    const { title, description, price, category, image_url } = req.body;
const user_id = req.user.id;
   
   if (!title || !category) {
  return res.status(400).json({
    error: 'Title and category are required'
  });
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


app.put('/listings/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, image_url } = req.body;

    // Find the listing
    const existing = await pool.query(
      'SELECT * FROM listings WHERE id = $1',
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        error: 'Listing not found'
      });
    }

    // Check ownership
    if (existing.rows[0].user_id !== req.user.id) {
      return res.status(403).json({
        error: 'You are not authorized to update this listing'
      });
    }

    // Update listing
    const result = await pool.query(
      `UPDATE listings
       SET title = $1,
           description = $2,
           price = $3,
           category = $4,
           image_url = $5
       WHERE id = $6
       RETURNING *`,
      [
        title ?? existing.rows[0].title,
        description ?? existing.rows[0].description,
        price ?? existing.rows[0].price,
        category ?? existing.rows[0].category,
        image_url ?? existing.rows[0].image_url,
        id
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error('Update listing error:', err);

    res.status(500).json({
      error: err.message
    });
  }
});


app.delete('/listings/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Find the listing
    const existing = await pool.query(
      'SELECT * FROM listings WHERE id = $1',
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        error: 'Listing not found'
      });
    }

    // Check ownership
    if (existing.rows[0].user_id !== req.user.id) {
      return res.status(403).json({
        error: 'You are not authorized to delete this listing'
      });
    }

    // Delete listing
    const result = await pool.query(
      'DELETE FROM listings WHERE id = $1 RETURNING *',
      [id]
    );

    res.json({
      message: 'Listing deleted successfully',
      deleted: result.rows[0]
    });

  } catch (err) {
    console.error('Delete listing error:', err);

    res.status(500).json({
      error: err.message
    });
  }
});


app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                error: 'Name, email and password are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters'
            });
        }

        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                error: 'Email already registered'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

       const result = await pool.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email`,
    [name, email, passwordHash]
);

        res.status(201).json({
            message: 'User registered successfully',
            user: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Server error'
        });
    }
});



app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        // Find user
        const result = await pool.query(
            'SELECT id, name, email, password FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        const user = result.rows[0];

        // Compare password with bcrypt hash
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

             const token = jwt.sign(
    {
        id: user.id,
        email: user.email
    },
    process.env.JWT_SECRET,
    {
        expiresIn: '10m'
    }
);

        // Successful login
       res.json({
    message: 'Login successful',
    token,
    user: {
        id: user.id,
        name: user.name,
        email: user.email
    }
});

   

    } catch (err) {
        console.error('Login error:', err);

        res.status(500).json({
            error: err.message
        });
    }
});

app.get('/profile', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email FROM users WHERE id = $1',
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        res.json({
            message: 'Protected profile accessed successfully',
            user: result.rows[0]
        });

    } catch (err) {
        console.error('Profile error:', err);

        res.status(500).json({
            error: 'Server error'
        });
    }
});



app.listen(PORT, () => {
  console.log(`Campus Marketplace server running on http://localhost:${PORT}`);
});
