const express = require("express");
const pool = require("../config/db");

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

module.exports = router;
