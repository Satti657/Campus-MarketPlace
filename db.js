const { Pool } = require('pg');
require('dotenv').config();

// A Pool keeps a set of reusable connections to PostgreSQL.
// It reads the DB location + credentials from the .env file.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;