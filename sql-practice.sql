-- SQL PRACTICE (Day 2)
-- Run against the campus_marketplace_ database:
--   psql -U postgres -h localhost -d campus_marketplace_
-- These are the 15 queries I practised while learning SQL.

-- 1. Get all listings
SELECT * FROM listings;

-- 2. Get all users
SELECT * FROM users;

-- 3. Get all listing titles and prices
SELECT title, price FROM listings;

-- 4. Get listings in one category
SELECT * FROM listings WHERE category = 'Electronics';

-- 5. Sort listings by price (cheapest first)
SELECT title, price FROM listings ORDER BY price ASC;

-- 6. Sort listings by price (most expensive first)
SELECT title, price FROM listings ORDER BY price DESC;

-- 7. Get the newest listings first
SELECT title, created_at FROM listings ORDER BY created_at DESC;

-- 8. Get one listing by its id
SELECT * FROM listings WHERE id = 1;

-- 9. Get listings whose title contains a word (search by name)
SELECT * FROM listings WHERE title ILIKE '%calculator%';

-- 10. Count how many listings exist
SELECT COUNT(*) AS total_listings FROM listings;

-- 11. Count listings per category
SELECT category, COUNT(*) FROM listings GROUP BY category;

-- 12. Get the average price per category
SELECT category, AVG(price) FROM listings GROUP BY category;

-- 13. Join: show each listing with its owner's name (FOREIGN KEY at work)
SELECT listings.title, listings.price, users.name AS seller
FROM listings
JOIN users ON users.id = listings.user_id;

-- 14. Join: all listings by one specific user
SELECT listings.title, listings.price
FROM listings
JOIN users ON users.id = listings.user_id
WHERE users.email = 'ayesha@campus.edu';

-- 15. Find listings over a price (a max budget filter)
SELECT title, price, category FROM listings WHERE price <= 50 ORDER BY price ASC;