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

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_price, status)
       VALUES ($1, $2, 'placed') RETURNING id`,
      [req.userId, totalPrice]
    );
    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, name, price, quantity, color, size)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          orderId,
          item.id,
          item.name,
          item.price,
          item.quantity,
          item.selectedColor || null,
          item.selectedSize || null,
        ]
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ orderId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Failed to place order" });
  } finally {
    client.release();
  }
});

// GET /api/orders  (Bearer token) -> list of orders for the logged-in user
router.get("/", requireAuth, async (req, res) => {
  try {
    const { rows: orders } = await pool.query(
      `SELECT id, total_price, status, created_at
       FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.userId]
    );

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const { rows: items } = await pool.query(
          `SELECT product_id AS id, name, color, size, quantity, price
           FROM order_items WHERE order_id = $1`,
          [order.id]
        );
        return {
          id: order.id,
          created_at: order.created_at,
          status: order.status,
          total_price: order.total_price,
          items,
        };
      })
    );

    res.json(ordersWithItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// PATCH /api/orders/:id/cancel  (Bearer token) -> cancels an order if still "placed"
router.patch("/:id/cancel", requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT id, status FROM orders WHERE id = $1 AND user_id = $2`,
      [id, req.userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (rows[0].status !== "placed") {
      return res.status(400).json({ error: "Only placed orders can be cancelled" });
    }

    await pool.query(
      `UPDATE orders SET status = 'cancelled' WHERE id = $1`,
      [id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to cancel order" });
  }
});

module.exports = router;