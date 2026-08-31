require("dotenv").config();
const express = require("express");
const cors = require("cors");

const productsRoute = require("./routes/products");
const authRoute = require("./routes/auth");
const ordersRoute = require("./routes/orders");

const app = express();

app.use(cors()); // allows requests from the Vite dev server at localhost:5173
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ShopSphere backend is running" });
});

app.use("/api/products", productsRoute);
app.use("/api/auth", authRoute);
app.use("/api/orders", ordersRoute);

// Catch-all error handler so unexpected errors return JSON, not an HTML crash page
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ShopSphere backend running on http://localhost:${PORT}`);
});
