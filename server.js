const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const authMiddleware = require("./authMiddleware");

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// =========================
// HOME
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "Campus Marketplace API is running",
  });
});

// =========================
// GET ALL LISTINGS
// WITH SELLER INFORMATION
// =========================

app.get("/listings", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        listings.id,
        listings.user_id,
        listings.title,
        listings.description,
        listings.price,
        listings.category,
        listings.image_url,
        users.name AS seller_name,
        users.email AS seller_email
       FROM listings
       JOIN users
         ON listings.user_id = users.id
       ORDER BY listings.id DESC`
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// =========================
// GET SINGLE LISTING
// WITH SELLER INFORMATION
// =========================

app.get("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
        listings.id,
        listings.user_id,
        listings.title,
        listings.description,
        listings.price,
        listings.category,
        listings.image_url,
        users.name AS seller_name,
        users.email AS seller_email
       FROM listings
       JOIN users
         ON listings.user_id = users.id
       WHERE listings.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Listing not found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// =========================
// CREATE LISTING
// PROTECTED
// =========================

app.post("/listings", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      image_url,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO listings
        (user_id, title, description, price, category, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        req.user.id,
        title,
        description,
        price,
        category,
        image_url || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// =========================
// UPDATE LISTING
// PROTECTED + OWNER ONLY
// =========================

app.put("/listings/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      price,
      category,
      image_url,
    } = req.body;

    const existingListing = await pool.query(
      "SELECT * FROM listings WHERE id = $1",
      [id]
    );

    if (existingListing.rows.length === 0) {
      return res.status(404).json({
        error: "Listing not found",
      });
    }

    if (existingListing.rows[0].user_id !== req.user.id) {
      return res.status(403).json({
        error: "You are not authorized to update this listing",
      });
    }

    const result = await pool.query(
      `UPDATE listings
       SET
         title = $1,
         description = $2,
         price = $3,
         category = $4,
         image_url = $5
       WHERE id = $6
       RETURNING *`,
      [
        title,
        description,
        price,
        category,
        image_url || null,
        id,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// =========================
// DELETE LISTING
// PROTECTED + OWNER ONLY
// =========================

app.delete("/listings/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const existingListing = await pool.query(
      "SELECT * FROM listings WHERE id = $1",
      [id]
    );

    if (existingListing.rows.length === 0) {
      return res.status(404).json({
        error: "Listing not found",
      });
    }

    if (existingListing.rows[0].user_id !== req.user.id) {
      return res.status(403).json({
        error: "You are not authorized to delete this listing",
      });
    }

    const result = await pool.query(
      "DELETE FROM listings WHERE id = $1 RETURNING *",
      [id]
    );

    res.json({
      message: "Listing deleted successfully",
      listing: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// =========================
// SIGNUP
// =========================

app.post("/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: "Email already registered",
      });
    }

    const passwordHash = await bcrypt.hash(
      password,
      10
    );

    const result = await pool.query(
      `INSERT INTO users
        (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [
        name,
        email,
        passwordHash,
      ]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// =========================
// LOGIN
// JWT GENERATION
// =========================

app.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const result = await pool.query(
      `SELECT
        id,
        name,
        email,
        password
       FROM users
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// =========================
// PROFILE
// PROTECTED
// =========================

app.get("/profile", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json({
      user: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// =========================
// START SERVER
// =========================

app.listen(PORT, () => {
  console.log(
    `Campus Marketplace server running on http://localhost:${PORT}`
  );
});