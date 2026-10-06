# Backend (Node/Express/MongoDB)

Minimal backend for the Poshipine project.

Environment

- Copy `.env.example` to `.env` and set values (MONGO_URI, JWT_SECRET, CLIENT_URL, etc.).

Install

```bash
cd backend
npm install
```

Run (development)

```bash
NODE_ENV=development node server.js
```

API (high-level)

- `POST /api/auth/register` — register
- `POST /api/auth/login` — login
- `GET /api/auth/me` — profile (protected)
- `GET /api/products` — list products
- `GET /api/products/:id` — get product
- `POST /api/cart/add` — add to cart (protected)
- `POST /api/orders` — create order (protected)

Uploads

- Uploaded images are stored in `backend/uploads/` (configurable via `UPLOAD_DIR`).

Next steps

- Add integration tests, CI, and any payment provider connectors.
