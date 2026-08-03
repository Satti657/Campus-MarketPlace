const express = require("express");

const app = express();

const PORT = 3000;

const listings = [
  {
    id: 1,
    title: "Physics Book",
    price: 800,
    description: "Used for one semester",
    category: "Books"
  },
  {
    id: 2,
    title: "Scientific Calculator",
    price: 2500,
    description: "Casio FX-991ES",
    category: "Electronics"
  },
  {
    id: 3,
    title: "Hostel Chair",
    price: 1200,
    description: "Good condition",
    category: "Furniture"
  },
  {
    id: 4,
    title: "Dell Laptop",
    price: 45000,
    description: "Core i5, 8GB RAM",
    category: "Electronics"
  }
];

app.get("/listings/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const listing = listings.find(item => item.id === id);

  if (!listing) {
    return res.status(404).json({
      message: "Listing not found"
    });
  }

  res.json(listing);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/listings", (req, res) => {
    res.json(listings);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});