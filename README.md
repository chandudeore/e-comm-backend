# E-Commerce REST API (Node.js, Express, MySQL & Swagger)

A scalable, layered, and versioned backend REST API built with **Node.js**, **Express**, and **MySQL (`mysql2/promise`)**. Migrated from a flat MongoDB/Mongoose setup to a relational, production-grade architecture featuring **JWT authentication**, **role-based access control (RBAC)**, **dynamic safe query building**, **centralized error handling**, and **interactive OpenAPI 3.0 (Swagger) documentation**.

---

## Key Features

- **Layered Architecture:** Clean separation of concerns across `Routes → Controllers → Services → Repositories`.
- **API Versioning:** Versioned endpoints under `/api/v1` with health checks at `/api/health` and future version extensibility (`/api/v2`).
- **MySQL Connection Pooling:** Configured with `mysql2/promise`, automatic decimal casting, parameterized queries, and graceful shutdown (`SIGINT`/`SIGTERM`).
- **Dynamic Query Engine (`queryBuilder.js`):** Whitelisted filtering (`category`), price range filtering (`minPrice`, `maxPrice`), multi-column keyword `search`, dynamic sorting (`sortBy`, `order`), and pagination (`page`, `limit`).
- **Authentication & RBAC:** Password hashing with `bcryptjs`, stateless `jsonwebtoken` Bearer authentication, and role-based authorization (`customer`, `admin`).
- **Interactive Swagger UI:** Full OpenAPI 3.0 specification exposed at `/api/docs` and raw spec at `/api/docs.json` with persistent Bearer authorization.
- **Security & Observability:** Hardened with `helmet`, `cors`, `express-rate-limit`, `morgan` HTTP logging, and unified error mapping (operational `AppError` + MySQL error codes).

---

## Project Structure

```text
src/
├── config/
│   ├── env.js                 # Environment variable validation & configuration
│   └── db.js                  # MySQL2 connection pool & connection ping helper
├── database/
│   └── schema.sql             # Normalized MySQL schema (users, products, cart_items)
├── docs/
│   ├── swagger.js             # OpenAPI 3.0 spec generator & Swagger UI options
│   └── components.js          # Reusable OpenAPI schemas, responses & BearerAuth
├── middlewares/
│   ├── authenticate.js        # JWT Bearer token verification
│   ├── authorize.js           # Role-based access control (RBAC)
│   ├── validate.js            # Request validation middleware
│   ├── notFound.js            # 404 handler for unmatched routes
│   └── errorHandler.js        # Centralized error formatter (MySQL & operational errors)
├── utils/
│   ├── AppError.js            # Custom operational error class
│   ├── asyncHandler.js        # Async controller wrapper
│   ├── queryBuilder.js        # Whitelisted dynamic SQL filter/sort/pagination builder
│   └── apiResponse.js         # Standardized JSON response envelope
├── repositories/
│   ├── user.repository.js     # Parameterized SQL queries for users
│   ├── product.repository.js  # Parameterized SQL + dynamic product queries
│   └── cart.repository.js     # User-scoped cart SQL with product JOINs
├── services/
│   ├── auth.service.js        # Registration, login, password hashing & JWT signing
│   ├── product.service.js     # Product business logic
│   └── cart.service.js        # Cart business logic & product validation
├── controllers/
│   ├── auth.controller.js     # HTTP handlers for auth
│   ├── product.controller.js  # HTTP handlers for products
│   └── cart.controller.js     # HTTP handlers for cart
├── routes/
│   ├── index.js               # Mounts /health, /docs, /docs.json, and /v1
│   └── v1/
│       ├── index.js           # Aggregates v1 resource routers
│       ├── auth.routes.js     # Auth endpoints + OpenAPI annotations
│       ├── product.routes.js  # Product endpoints + OpenAPI annotations
│       └── cart.routes.js     # Cart endpoints + OpenAPI annotations
├── app.js                     # Express middleware & route mounting
└── server.js                  # Server bootstrap & graceful shutdown
products_111.json              # Sample dataset (111 products across 5 categories)
.env                           # Local environment configuration
package.json
```

---

## Prerequisites

- **Node.js** `v18+` (includes native `fetch` for running seed scripts)
- **MySQL** `v8.0+` running locally (or via Docker/XAMPP/Workbench)

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
NODE_ENV=development
PORT=8080

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=app_db
DB_CONNECTION_LIMIT=10

JWT_SECRET_KEY=replace_with_a_strong_secret_key
JWT_EXPIRES_IN=7d

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### 3. Initialize the MySQL Database

Run the schema script (`src/database/schema.sql`) against your local MySQL server:

```bash
mysql -h 127.0.0.1 -P 3306 -u root -p < src/database/schema.sql
```

This creates the `app_db` database and three normalized tables:
- `users` (`id`, `first_name`, `last_name`, `email`, `password`, `role`, `status`, `created_at`, `updated_at`)
- `products` (`id`, `title`, `price`, `description`, `category`, `image`, `stock`, `rating_rate`, `rating_count`, `created_at`, `updated_at`)
- `cart_items` (`id`, `user_id`, `product_id`, `quantity`, `created_at`, `updated_at` with foreign keys to `users` and `products`)

### 4. Start the Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:8080/api/v1` and Swagger UI at `http://localhost:8080/api/docs`.

---

## Authentication & Admin Setup

1. **Register a user:**
   ```bash
   curl -X POST http://localhost:8080/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "first_name": "Aarav",
       "last_name": "Sharma",
       "email": "aarav@example.com",
       "password": "Secret@123"
     }'
   ```

2. **Promote a user to `admin` (required for `POST /api/v1/products`):**
   ```sql
   USE app_db;
   UPDATE users SET role = 'admin' WHERE email = 'aarav@example.com';
   ```

3. **Log in to obtain a JWT Bearer token:**
   ```bash
   curl -X POST http://localhost:8080/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "aarav@example.com",
       "password": "Secret@123"
     }'
   ```
   Copy `data.token` from the response and pass it as `Authorization: Bearer <token>` (or click **Authorize** in Swagger UI).

---

## Seeding Sample Products (`products_111.json`)

The repository includes `products_111.json` with 111 items across `electronics`, `men's clothing`, `women's clothing`, `home & kitchen`, and `sports & fitness`. With the server running and an admin JWT token ready:

```javascript
// seed-products.js
const fs = require("fs");

const API_URL = "http://localhost:8080/api/v1/products";
const ADMIN_TOKEN = "YOUR_ADMIN_JWT_TOKEN";

async function seed() {
  const products = JSON.parse(fs.readFileSync("./products_111.json", "utf8"));
  for (const item of products) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify(item),
    });
    if (!res.ok) console.error(`Failed "${item.title}":`, await res.text());
  }
  console.log("Seeding complete.");
}

seed();
```

---

## API Reference (`/api/v1`)

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Verify API & MySQL pool connectivity |
| `GET` | `/api/docs` | Public | Interactive Swagger UI documentation |
| `GET` | `/api/docs.json` | Public | Raw OpenAPI 3.0 JSON specification |
| `POST` | `/api/v1/auth/register` | Public | Register a new customer account |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user & issue JWT token |
| `GET` | `/api/v1/products` | Public | Dynamic product listing (filter, search, sort, paginate) |
| `GET` | `/api/v1/products/:id` | Public | Retrieve single product details |
| `POST` | `/api/v1/products` | `Admin` | Create a new product |
| `GET` | `/api/v1/cart` | `Bearer` | Fetch authenticated user's cart & total |
| `POST` | `/api/v1/cart` | `Bearer` | Add a product or increment quantity in cart |
| `DELETE` | `/api/v1/cart/:id` | `Bearer` | Remove an item from user's cart |

### Dynamic Product Query Examples

```http
GET /api/v1/products?category=electronics&search=wireless&minPrice=25&maxPrice=150&sortBy=price&order=ASC&page=1&limit=6
```

Supported query parameters for `GET /api/v1/products`:
- `page` (default: `1`) & `limit` (default: `6`, max: `100`)
- `category` (exact match, e.g., `electronics`, `home & kitchen`)
- `search` (case-insensitive `LIKE` search across `title`, `description`, `category`)
- `minPrice` & `maxPrice` (numeric price bounds)
- `sortBy` (`id`, `price`, `title`, `rating_rate`, `created_at`)
- `order` (`ASC` or `DESC`)

---

## Standard Response Format

All endpoints return a consistent JSON envelope:

```json
{
  "success": true,
  "message": "Products fetched",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 6,
    "total": 111,
    "totalPages": 19
  }
}
```
