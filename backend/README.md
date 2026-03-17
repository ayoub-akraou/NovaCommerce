# NovaCommerce Backend (NestJS)

Backend API pour la plateforme e-commerce NovaCommerce.

## Stack

- NestJS 11
- Prisma + PostgreSQL
- JWT (auth + refresh)
- Swagger (`/api/docs`)
- ESLint + Prettier + Husky + lint-staged + commitlint

## Structure

`src/` modules principaux :

- `auth`: register/login/refresh/logout + guards RBAC
- `users`: administration des rôles utilisateurs
- `categories`: CRUD catégories
- `products`: CRUD produits + filtres/pagination
- `cart`: panier utilisateur (CRUD items)
- `orders`: création commande, paiement mock, statuts admin
- `admin-stats`: KPI dashboard admin
- `prisma`: accès base de données
- `common`: filtres globaux (gestion erreurs)
- `config`: validation et lecture des variables d’environnement

## Prérequis

- Node.js 20+ (ou version compatible Nest 11)
- PostgreSQL local

## Installation

```bash
npm install
```

## Variables d’environnement

Créer `.env` à partir de `.env.example` :

```bash
cp .env.example .env
# Windows PowerShell:
# Copy-Item .env.example .env
```

Variables utilisées :

- `PORT`
- `NODE_ENV`
- `DATABASE_URL`
- `JWT_SECRET`
- `CORS_ORIGIN`

## Base de données (Prisma)

Après modification du schéma :

```bash
npm run prisma:merge
npm run prisma:generate
npm run prisma:migrate:dev -- --name <migration_name>
```

Seed :

```bash
npm run prisma:seed
```

## Lancer le backend

```bash
npm run start:dev
```

Build :

```bash
npm run build
```

## Documentation API (Swagger)

- UI: `http://localhost:<PORT>/api/docs`
- JSON: `http://localhost:<PORT>/api/docs-json`

## Qualité de code

Format :

```bash
npm run format
npm run format:check
```

Lint :

```bash
npm run lint
npm run lint:check
```

Tests :

```bash
npm run test
npm run test:cov
```

## Git hooks

Hooks configurés à la racine du repo (`.husky/`) :

- `pre-commit`: lance `lint-staged`
- `commit-msg`: valide le message avec `commitlint` (convention commits)

Le script `prepare` configure automatiquement :

```bash
git -C .. config core.hooksPath .husky
```

## Endpoints principaux (résumé)

Auth:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

Catalogue:

- `GET /categories`
- `GET /products`
- `GET /products/:id`

Panier:

- `GET /cart`
- `POST /cart/items`
- `PATCH /cart/items/:id`
- `DELETE /cart/items/:id`

Commandes:

- `POST /orders`
- `GET /orders/me`
- `GET /orders/:id`
- `PATCH /orders/:id/pay`
- `GET /orders/admin`
- `PATCH /orders/admin/:id/status`

Admin:

- `GET /admin/users`
- `PATCH /admin/users/:id/role`
- `GET /admin/stats`
