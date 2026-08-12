SELECT * FROM listings;

SELECT * FROM listings
WHERE id = 1;

SELECT * FROM listings
WHERE category = 'Books';

SELECT * FROM listings
WHERE category = 'Electronics';

SELECT * FROM listings
WHERE price < 3000;

SELECT * FROM listings
WHERE price > 3000;

SELECT * FROM listings
ORDER BY price ASC;

SELECT * FROM listings
ORDER BY price DESC;

SELECT * FROM listings
WHERE title ILIKE '%book%';

SELECT * FROM listings
WHERE user_id = 1;

SELECT * FROM listings
WHERE user_id = 2;

SELECT
    listings.id,
    listings.title,
    listings.price,
    listings.category,
    users.name AS seller
FROM listings
JOIN users
ON listings.user_id = users.id;

SELECT
    listings.title,
    listings.price,
    users.name AS seller
FROM listings
JOIN users
ON listings.user_id = users.id;

-- UPDATE
UPDATE listings
SET price = 1500
WHERE id = 1;

-- DELETE
DELETE FROM listings
WHERE id = 4;
