-- Campus Marketplace schema
-- Each listing belongs to one user -> user_id is a FOREIGN KEY into users.id

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS listings (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(10, 2) NOT NULL DEFAULT 0,
  category    TEXT NOT NULL,
  image_url   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed data: 2 users, 4 listings
INSERT INTO users (name, email, password_hash) VALUES
  ('Ayesha Khan',  'ayesha@campus.edu', 'not-a-real-hash-1'),
  ('Bilal Ahmed',  'bilal@campus.edu',  'not-a-real-hash-2');

INSERT INTO listings (user_id, title, description, price, category, image_url) VALUES
  (1, 'Calculus Textbook (7th ed)', 'Used for a year, no markings. Great condition.', 25.00, 'Books', NULL),
  (2, 'Scientific Calculator Casio', 'Works perfectly, fresh batteries.', 15.00, 'Electronics', NULL),
  (1, 'Hostel Single Bed + Mattress', 'Solid wooden bed, moving out of hostel.', 80.00, 'Furniture', NULL),
  (2, 'iPhone 11 64GB', 'Good condition, some scratches on back.', 60000.00, 'Electronics', NULL);