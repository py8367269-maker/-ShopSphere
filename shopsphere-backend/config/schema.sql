-- Run this once against your Neon database to create the tables.
-- In Neon: open the SQL Editor for your project and paste this in, or
-- run: psql "$DATABASE_URL" -f config/schema.sql

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  description TEXT,
  colors TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  items JSONB NOT NULL,        -- snapshot of cart items at time of order
  total_price INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'Placed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
