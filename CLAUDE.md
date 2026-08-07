# support-desk

A small support-ticket dashboard built for the Sparta Bootcamp. A Node/Express
API serves ticket data to a React/Vite frontend, letting a signed-in support
team view and (eventually) manage tickets in one place. Access requires a
JWT-based login (see [Auth](#auth)).

## Stack

- **web/** — React + Vite frontend
- **server/** — Node + Express API
- Data is Postgres, accessed via `server/src/db.js` (pg Pool), `server/src/repositories/`,
  and `server/src/services/`
- Schema is managed with `node-pg-migrate`; migrations live in `server/migrations/`
- Connection config comes from `DATABASE_URL` (see `server/.env.example`), loaded via
  `server/src/config/index.js`
- Passwords are hashed with bcrypt (`bcryptjs`) in `server/src/auth/passwords.js`
- User authentication/authorisation uses JWTs (`jsonwebtoken`) signed and
  verified in `server/src/auth/tokens.js`

## Commands

**server/**
```
npm start             # node src/index.js
npm run dev           # node --watch src/index.js
npm run migrate:up    # node-pg-migrate up — apply pending migrations
npm run migrate:down  # node-pg-migrate down — roll back the latest migration
npm run seed          # node src/scripts/seed.js — truncate & repopulate users/tickets
npm run smoke:auth    # node src/scripts/smoke-auth.js — black-box auth/authorisation smoke test (run `npm run seed` first)
```

New migrations are created ad hoc with `npx node-pg-migrate create <name>` (no
dedicated npm script for creation). Files land in `server/migrations/` as
`<timestamp>_<kebab-name>.js` with `up`/`down` exports.

**Database setup (local, one-time)**
1. Provision a local Postgres DB, copy `server/.env.example` → `server/.env`, and set `DATABASE_URL`.
2. `npm run migrate:up` in `server/` to create the schema.
3. `npm run seed` to populate fixture data.
4. `npm run dev` or `npm start` to run the API against it.

**web/**
```
npm run dev      # vite
npm run build    # vite build
npm run lint     # oxlint
npm run preview  # vite preview
```

**Smoke tests** (server running on port 4000)
```
curl -s http://localhost:4000/api/health
curl -s http://localhost:4000/api/ready
```
`GET /api/tickets` requires a valid `Authorization: Bearer <token>` (see
[Auth](#auth)), so it can't be curled directly without first logging in. For
a full auth + ticket-scoping smoke test, run `npm run smoke:auth` in `server/`
instead.

## Auth

- Authentication and authorisation are JWT-based (`jsonwebtoken`, HS256; see `server/src/auth/tokens.js`).
- JWTs are created by the `POST /api/auth/login` and `POST /api/auth/register`
  endpoints (`server/src/routes/auth.js`), both via the shared `signAccessToken`
  helper, and returned to the client as `{ user, token }`.
- `server/src/middleware/requireAuth.js` checks that the current request
  carries a valid `Authorization: Bearer <token>` JWT before allowing access
  to protected routes (mounted ahead of `/tickets` in `server/src/routes/index.js`;
  `/health` and `/auth` stay public).
- On the frontend, `web/` handles authentication/authorisation via a React
  context (`web/src/auth/AuthProvider.jsx`, `useAuth()` in
  `web/src/auth/authContext.js`) — components read the token/user directly
  from `useAuth()`; the JWT is never passed down as a prop.

## Code conventions

- Every API route returns JSON.
- Errors are returned as `{ error: { code, message } }` with the correct
  HTTP status code. The convention is defined by `server/src/constants/index.js`
  (`ERROR_CODES`), typed error classes in `server/src/errors/AppError.js`
  (`.notFound()` / `.validation()` / `.unauthenticated()` / `.conflict()`),
  and applied uniformly by `server/src/middleware/errorHandler.js`.
- Client code calls relative `/api` paths (no hardcoded host/port).
- The client fetch helper throws on a non-ok response.

## Directory norms

- Routes live in `server/src/routes/`.
- Migrations live in `server/migrations/`.
- DB connection/query helpers live in `server/src/db.js` and `server/src/config/`.
- Data access goes through `server/src/repositories/` and `server/src/services/`, not
  direct queries in routes.
- Password hashing and JWT signing/verification live in `server/src/auth/`.
- Express middleware (`requireAuth`, `errorHandler`) lives in `server/src/middleware/`.
- Typed error classes live in `server/src/errors/`; shared constants (error
  codes, enums, etc.) live in `server/src/constants/`.
- One-off/maintenance scripts (seeding, smoke tests) live in `server/src/scripts/`.
- Client API/fetch code lives in `web/src/lib/api.js`.
- Frontend auth (context, provider, login form) lives in `web/src/auth/`.

## Do not

- No unmasked dependencies.
- No committing `node_modules` or secrets.
