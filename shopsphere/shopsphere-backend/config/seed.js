// Loads your original product catalog (from frontend data/products.js) into Neon.
// Run once with: npm run seed
require("dotenv").config();
const pool = require("./db");

const products = [
  {
    name: "Wireless Headphones",
    price: 2499,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    description:
      "Premium wireless headphones with noise cancellation and up to 30 hours of battery life.",
    colors: ["Black", "White", "Tan"],
    sizes: [],
  },
  {
    name: "Running Shoes",
    price: 3299,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    description:
      "Lightweight running shoes designed for comfort and performance on any terrain.",
    colors: ["Red", "Black", "Grey"],
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
  },
  {
    name: "Smart Watch",
    price: 4999,
    category: "Technology",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    description:
      "Track your fitness, notifications, and more with this sleek smart watch.",
    colors: ["White", "Black"],
    sizes: [],
  },
  {
    name: "Table Lamp",
    price: 1299,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
    description:
      "A minimalist table lamp that brings warm, ambient lighting to any room.",
    colors: ["Beige", "White"],
    sizes: [],
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query("SELECT COUNT(*)::int AS count FROM products");
    if (rows[0].count > 0) {
      console.log(
        `products table already has ${rows[0].count} row(s) — skipping seed. Delete rows first if you want to reseed.`
      );
      return;
    }

    for (const p of products) {
      await client.query(
        `INSERT INTO products (name, price, category, image, description, colors, sizes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [p.name, p.price, p.category, p.image, p.description, p.colors, p.sizes]
      );
    }
    console.log(`Seeded ${products.length} products.`);
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
