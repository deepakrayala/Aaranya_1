# Aranya backend

This folder contains the separate Node.js, TypeScript, Express, and PostgreSQL API for Aranya. It is intentionally independent from the TanStack Start frontend.

## What is included in phase 1

- Express application setup
- Environment-variable validation
- PostgreSQL connection pool
- Request logging and JSON error responses
- `GET /api/v1/health`, including a PostgreSQL connectivity check

No authentication, products, orders, database tables, or migrations are included yet.

## Prerequisites

- Node.js 22 or later
- A running PostgreSQL server

## Setup

1. From this directory, install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and change `DATABASE_URL` if required.

3. Start the development server:

   ```bash
   npm run dev
   ```

The server starts on `http://localhost:4000` by default.

## Health check

```bash
curl http://localhost:4000/api/v1/health
```

When PostgreSQL is reachable, the response is:

```json
{
  "status": "ok",
  "database": "connected"
}
```

When PostgreSQL is unavailable, the endpoint returns HTTP `503` and reports `database: "disconnected"`.

## Commands

```bash
npm run dev     # Run the backend with automatic restart
npm run check   # Type-check without creating build files
npm run build   # Compile TypeScript to dist/
npm start       # Run the compiled server
npm run create:admin # Interactively create the initial admin account
```

## Initial admin account

Create an admin only from a trusted local terminal after the database is configured:

```bash
npm run create:admin
```

The setup script prompts for the name, email, and hidden password, stores only an Argon2id password hash, and creates role `1` (ADMIN). It must run in an interactive terminal so the password is not exposed. It does not expose an HTTP endpoint, does not place credentials in source control, and will not create a duplicate account for an existing email. Admins use the normal `/api/v1/auth/login` endpoint.
