const express = require("express");
const pool = require("../config/db");
const requireAuth = require("../middleware/auth");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, price, category, image, description, colors, sizes FROM products ORDER BY id"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, price, category, image, description, colors, sizes FROM products WHERE id = $1",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// POST /api/products  (admin only)
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { name, price, category, image, description, colors, sizes } = req.body;

  if (!name || typeof price !== "number" || !category) {
    return res.status(400).json({ error: "name, price and category are required" });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO products (name, price, category, image, description, colors, sizes)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, price, category, image || null, description || null, colors || [], sizes || []]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// PUT /api/products/:id  (admin only)
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  const { name, price, category, image, description, colors, sizes } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE products
       SET name = $1, price = $2, category = $3, image = $4, description = $5, colors = $6, sizes = $7
       WHERE id = $8 RETURNING *`,
      [name, price, category, image, description, colors || [], sizes || [], req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE /api/products/:id  (admin only)
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING id",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;