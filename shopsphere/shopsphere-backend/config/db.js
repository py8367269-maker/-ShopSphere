const { Pool } = require("pg");
require("dotenv").config();

// Neon requires SSL. This works whether or not ?sslmode=require is on your DATABASE_URL.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle Postgres client", err);
});

module.exports = pool;
