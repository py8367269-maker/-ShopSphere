const express = require("express");
const pool = require("../config/db");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// POST /api/orders  (Bearer token)  { items, totalPrice } -> { orderId }
router.post("/", requireAuth, async (req, res) => {
  const { items, totalPrice } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Order must include at least one item" });
  }
  if (typeof totalPrice !== "number") {
    return res.status(400).json({ error: "totalPrice is required" });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO orders (user_id, items, total_price, status)
       VALUES ($1, $2, $3, 'Placed') RETURNING id`,
      [req.userId, JSON.stringify(items), totalPrice]
    );
    res.status(201).json({ orderId: rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// GET /api/orders  (Bearer token) -> list of orders for the logged-in user
router.get("/", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, items, total_price, status, created_at
       FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.userId]
    );

    // Orders.jsx expects each item to have: id, name, color, size, quantity, price.
    // CartContext stores selectedColor/selectedSize, so map those field names here.
    const orders = rows.map((order) => ({
      id: order.id,
      created_at: order.created_at,
      status: order.status,
      total_price: order.total_price,
      items: order.items.map((item) => ({
        id: item.id,
        name: item.name,
        color: item.selectedColor || item.color || null,
        size: item.selectedSize || item.size || null,
        quantity: item.quantity,
        price: item.price,
      })),
    }));

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

module.exports = router;
