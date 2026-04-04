# NovaCommerce

Modern full-stack e-commerce project with:
- `backend`: NestJS + Prisma + PostgreSQL
- `frontend`: Next.js (App Router) + Tailwind + Zustand

---

## Tech Stack

### Backend
- NestJS 11
- Prisma ORM
- PostgreSQL
- JWT auth (access + refresh)
- Swagger docs

### Frontend
- Next.js 16
- React 19
- Tailwind CSS 4
- Axios
- Zustand
- Zod

---

## Project Structure

```text
NovaCommerce/
|- backend/
|  |- prisma/
|  |- src/
|- frontend/
|  |- src/
|- .husky/
`- README.md
```

---

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL running locally

---

## Environment Variables

### Backend (`backend/.env`)
Copy from `backend/.env.example`:

```bash
cd backend
cp .env.example .env
# PowerShell:
# Copy-Item .env.example .env
```

Main variables:
- `PORT` (default `3000`)
- `DATABASE_URL`
- `JWT_SECRET`
- `CORS_ORIGIN` (default frontend `http://localhost:3001`)

### Frontend (`frontend/.env`)
Copy from `frontend/.env.example`:

```bash
cd frontend
cp .env.example .env
# PowerShell:
# Copy-Item .env.example .env
```

Main variable:
- `NEXT_PUBLIC_API_URL` (default `http://localhost:3000`)

---

## Installation

Install app dependencies:

```bash
cd backend && npm install
cd ../frontend && npm install
```

---

## Database Setup (Backend)

From `backend/`:

```bash
npm run prisma:merge
npm run prisma:generate
npm run prisma:migrate:dev -- --name init
npm run prisma:seed
```

---

## Run in Development

### Backend
From `backend/`:

```bash
npm run start:dev
```

Backend URL: `http://localhost:3000`

Swagger:
- UI: `http://localhost:3000/api/docs`
- JSON: `http://localhost:3000/api/docs-json`

### Frontend
From `frontend/`:

```bash
npm run dev
```

Frontend URL: `http://localhost:3001`

---

## Main Functional Areas

### Backend APIs
- Auth: register, login, refresh, logout
- Users (admin): list users, update role
- Categories: CRUD
- Products: CRUD + filters + pagination
- Cart: get cart, add item, update quantity, remove item
- Orders: create order, pay mock, list my orders, admin order management
- Admin stats: dashboard KPIs

### Frontend
- Auth pages: login / register
- Shop:
  - product list with filters
  - product details page
  - cart page (quantity update, remove line, clear cart)
- Admin:
  - dashboard stats
  - categories management
  - products management
  - orders management
  - users management

---

## Quality Checks

### Backend
From `backend/`:

```bash
npm run lint
npm run test
npm run build
```

### Frontend
From `frontend/`:

```bash
npm run lint
npm run build
```

---

## Git Hooks

Repo uses Husky (`.husky/`) with:
- `pre-commit`: `lint-staged`
- `commit-msg`: commit message validation

---

## Notes

- Backend is configured with ESM (`"type": "module"`).
- Frontend consumes backend through `NEXT_PUBLIC_API_URL`.
- Cart badge in navbar is synced from backend cart data.