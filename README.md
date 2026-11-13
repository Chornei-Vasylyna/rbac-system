# RBAC System

Full-stack role-based access control application. It provides email/password authentication, short-lived JWT access tokens with rotating refresh tokens, and an administration UI for managing users, roles, and permissions.

## Features

- User registration, login, refresh, and logout.
- Password hashing with `bcryptjs`.
- JWT access tokens and HTTP-only refresh-token cookies.
- Permission-based route protection in both the API and the frontend.
- User administration: paginated listing, email search and updates, account activation/deactivation, role assignment and removal.
- Role administration: create, edit, and delete custom roles; view the permission directory; assign permissions to roles.
- Built-in `admin` and `user` roles.
- Database safeguards that preserve at least one active administrator and at least one role per user.
- Client-side protected, forbidden (`/403`), and not-found routes.

## Architecture

The repository contains two independent pnpm packages:

```text
backend/    NestJS REST API, authentication, authorization, and database access
frontend/   React single-page application served by Vite
```

The backend exposes its API under `/api`. The frontend communicates with it through Axios and sends credentials so the refresh-token cookie can be used. The access token is kept in client state and renewed through `POST /api/auth/refresh`.

## Tech stack

**Backend:** Node.js, TypeScript, NestJS, PostgreSQL, Drizzle ORM and Drizzle Kit, `@nestjs/jwt`, `bcryptjs`, `class-validator`, `class-transformer`.

**Frontend:** React 19, TypeScript, Vite, React Router, TanStack React Query, Axios, Zustand, React Hook Form, Zod, Tailwind CSS 4.

## Prerequisites

- Node.js 20 or newer
- pnpm 9 or newer
- PostgreSQL, either locally or through Docker Compose

## Local setup

### 1. Install dependencies

```bash
cd backend && pnpm install
cd ../frontend && pnpm install
```

### 2. Configure the backend

Create `backend/.env` from the example (on Windows, use `copy` instead of `cp`):

```bash
cd backend
cp .env.example .env
```

Set the database connection and JWT secrets. Generate each secret with:

```bash
openssl rand -base64 48
```

Example configuration for local development with the provided Docker Compose service:

```dotenv
PORT=3000
DB_USER=postgres
DB_PASSWORD=<local-database-password>
DB_NAME=rbac_db
DATABASE_URL=postgres://postgres:<local-database-password>@localhost:5432/rbac_db
JWT_ACCESS_SECRET=<development-access-secret>
JWT_REFRESH_SECRET=<development-refresh-secret>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

Keep `DB_PASSWORD` and the password in `DATABASE_URL` consistent.

#### Application variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by the API and Drizzle Kit. |
| `JWT_ACCESS_SECRET` | Yes | Secret used to sign access tokens. |
| `JWT_REFRESH_SECRET` | Yes | Secret used to sign refresh tokens. |
| `PORT` | No | API port; defaults to `3000`. |
| `JWT_ACCESS_EXPIRES_IN` | No | Access-token lifetime; defaults to `15m`. |
| `JWT_REFRESH_EXPIRES_IN` | No | Refresh-token lifetime; defaults to `7d`. |
| `FRONTEND_URL` | No | Allowed CORS origin; defaults to `http://localhost:5173`. |
| `NODE_ENV` | No | When set to `production`, the refresh cookie is marked `secure`. |
| `TEST_USER_EMAIL` | No | Seed administrator email. |
| `TEST_USER_PASSWORD` | No | Seed administrator password. |

Duration values use the formats accepted by the `ms` package, such as `15m` and `7d`.

If `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` are omitted, the seed script uses built-in default credentials. These are for development only: set both variables explicitly, and never run the seed against a production database.

#### Docker Compose variables

Used only by the provided PostgreSQL Compose service.

| Variable | Required | Description |
| --- | --- | --- |
| `DB_USER` | No | PostgreSQL user; defaults to `postgres`. |
| `DB_PASSWORD` | No | PostgreSQL password. |
| `DB_NAME` | No | PostgreSQL database name; defaults to `postgres`. |
| `DB_PORT` | No | Published PostgreSQL port; defaults to `5432`. |

### 3. Start PostgreSQL

From `backend/`:

```bash
pnpm db:up
```

The service publishes PostgreSQL on `localhost:5432` and persists data in the `postgres_data` Docker volume.

### 4. Apply migrations and seed data

```bash
pnpm db:migrate
pnpm db:seed
```

The seed creates the `admin` and `user` roles, the development users, and the following permissions:

- `profile:read`
- `users:read`
- `users:manage`
- `roles:manage`

### 5. Run the application

The frontend uses `http://localhost:3000/api` by default. To change it, set `VITE_API_URL` in `frontend/.env`.

Start the backend and frontend in separate terminals:

```bash
# Terminal 1
cd backend
pnpm start:dev

# Terminal 2
cd frontend
pnpm dev
```

Open `http://localhost:5173` in your browser.

## Scripts

### Backend (`backend/`)

| Script | Description |
| --- | --- |
| `pnpm start:dev` | Start the API in watch mode. |
| `pnpm build` | Compile the backend. |
| `pnpm start:prod` | Run the compiled application from `dist`. |
| `pnpm lint` | Run Oxlint. |
| `pnpm db:up` / `pnpm db:down` | Start / stop PostgreSQL with Docker Compose. |
| `pnpm db:generate` | Generate a Drizzle migration from schema changes. |
| `pnpm db:migrate` | Apply pending Drizzle migrations. |
| `pnpm db:seed` | Build the backend and run the seed script. |
| `pnpm db:studio` | Open Drizzle Studio. |

### Frontend (`frontend/`)

| Script | Description |
| --- | --- |
| `pnpm dev` | Start the Vite development server. |
| `pnpm build` | Type-check and create a production build. |
| `pnpm lint` | Run ESLint. |
| `pnpm preview` | Preview the production build locally. |

## Routes

### Frontend

| Route | Access |
| --- | --- |
| `/login` | Public login page. |
| `/register` | Public registration page. |
| `/` | Authenticated dashboard showing the current user's roles and permissions. |
| `/admin/users` | Users administration; requires `users:read`. |
| `/admin/roles` | Role and permission administration; requires `roles:manage`. |
| `/403` | Forbidden page. |
| Any other path | Not-found page. |

### API

All routes use the `/api` prefix.

- `/auth`: registration, login, refresh, and logout.
- `/users`: listing, profile updates, role assignment and removal, and status changes.
- `/roles`: role listing, creation, updates, deletion, permission listing, and role-permission updates.

User and role endpoints require authentication and the relevant permissions. Refresh tokens are stored hashed in PostgreSQL and delivered in an HTTP-only cookie scoped to `/api/auth`.

## Database management

Drizzle schema definitions are in `backend/src/db/schema`, and migrations are in `backend/drizzle`. After changing the schema:

```bash
cd backend
pnpm db:generate
pnpm db:migrate
```