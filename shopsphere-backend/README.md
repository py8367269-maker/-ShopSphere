# ShopSphere Backend — Setup

This rebuilds your Express + Neon Postgres backend to match your recovered frontend exactly.

## 1. Install dependencies
```bash
cd shopsphere-backend
npm install
```

## 2. Configure your database
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Then open `.env` and paste in your **real Neon connection string** (Neon dashboard → your project → Connection Details → copy the connection string that starts with `postgres://`). Also set `JWT_SECRET` to any long random string.

**Important:** If your Neon project already has tables from before (check the Tables view in Neon first!), do NOT run the schema file below — tell me the existing table/column names instead and I'll adjust the routes to match, so we don't touch your real data.

If Neon is empty / this is a fresh project, create the tables:
```bash
psql "$DATABASE_URL" -f config/schema.sql
```
(Or paste the contents of `config/schema.sql` into the Neon SQL Editor in your browser.)

## 3. Seed the product catalog (only if products table is empty)
```bash
npm run seed
```
This loads the same 4 products from your `data/products.js` into Neon so `/api/products` returns real data immediately.

## 4. Run the server
```bash
npm run dev
```
You should see:
```
ShopSphere backend running on http://localhost:5000
```

## 5. Test it
With the frontend running (`npm run dev` in `frontend_recovered`) on `localhost:5173`, visit `/shop` — products should now load instead of "Failed to fetch".

## Endpoints implemented
| Method | Path | Auth | Body |
|---|---|---|---|
| GET | /api/products | no | — |
| POST | /api/auth/signup | no | `{ name, email, password }` |
| POST | /api/auth/login | no | `{ email, password }` |
| POST | /api/orders | Bearer token | `{ items, totalPrice }` |
| GET | /api/orders | Bearer token | — |

Cart itself stays entirely client-side (as it already was) — no cart endpoints needed.
