# NovaCommerce

Modern full-stack e-commerce project:
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
|- .github/workflows/
|- .husky/
|- docker-compose.yml
`- README.md
```

---

## Prerequisites

- Node.js 20+ (for local non-Docker workflow)
- npm
- Docker Desktop (or Docker Engine + Compose)

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
- `CORS_ORIGIN` (default `http://localhost:3001`)

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

## Run with Docker (recommended)

From repo root:

```bash
docker compose up --build
```

URLs:
- Frontend: `http://localhost:3001`
- Backend: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api/docs`
- Prisma Studio (when started): `http://localhost:5555`

### Useful Docker Commands

```bash
# Start in background
docker compose up -d --build

# See logs
docker compose logs -f

# Run database migrations manually (if needed)
docker compose exec backend npm run prisma:migrate:deploy

# Seed database manually
docker compose exec backend npm run prisma:seed

# Start Prisma Studio inside Docker
docker compose exec backend npx prisma studio --port 5555 --browser none

# Stop services
docker compose down

# Stop + remove DB volume (full reset)
docker compose down -v
```

---

## Run locally without Docker

### Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### Database setup (backend)

```bash
cd backend
npm run prisma:merge
npm run prisma:generate
npm run prisma:migrate:dev -- --name init
npm run prisma:seed
```

### Start development servers

```bash
# backend
cd backend
npm run start:dev

# frontend
cd frontend
npm run dev
```

---

## CI/CD (GitHub Actions)

Workflows:
- `.github/workflows/ci.yml`
  - Trigger: `push` and `pull_request` on `main`
  - Jobs:
    - backend: install, build, test
    - frontend: install, build
    - docker-build: build backend/frontend Docker images
- `.github/workflows/cd.yml`
  - Trigger: `push` on `main` + manual `workflow_dispatch`
  - Builds and pushes Docker images to GHCR:
    - `ghcr.io/<owner>/novacommerce-backend`
    - `ghcr.io/<owner>/novacommerce-frontend`
  - Tags:
    - `latest`
    - short commit SHA

### GitHub Secrets / Permissions

For current CD push to GHCR, no custom secret is required beyond default `GITHUB_TOKEN`.

Required repository settings:
- Actions enabled
- Workflow permissions allowing package write (the workflow also sets `packages: write`)

Optional (only if you enable VPS deploy step in `cd.yml`):
- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`

---

## Quality Checks

### Backend

```bash
cd backend
npm run lint
npm run test
npm run build
```

### Frontend

```bash
cd frontend
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
- Prisma runs with PostgreSQL adapter (`@prisma/adapter-pg`).
- Frontend consumes backend through `NEXT_PUBLIC_API_URL`.
