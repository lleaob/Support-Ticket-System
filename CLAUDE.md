# support-desk

A small support-ticket dashboard built for the Sparta Bootcamp. A Node/Express
API serves ticket data to a React/Vite frontend, letting a support team view
and (eventually) manage tickets in one place.

## Stack

- **web/** — React + Vite frontend
- **server/** — Node + Express API
- Data is Postgres, accessed via `server/src/db.js` (pg Pool), `server/src/repository/`,
  and `server/src/services/`
- Schema is managed with `node-pg-migrate`; migrations live in `server/migrations/`
- Connection config comes from `DATABASE_URL` (see `server/.env.example`), loaded via
  `server/src/config/index.js`

## Commands

**server/**
```
npm start             # node src/index.js
npm run dev           # node --watch src/index.js
npm run migrate:up    # node-pg-migrate up — apply pending migrations
npm run migrate:down  # node-pg-migrate down — roll back the latest migration
npm run seed          # node src/scripts/seed.js — truncate & repopulate users/tickets
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
curl -s http://localhost:4000/api/tickets
```

## Code conventions

- Every API route returns JSON.
- Errors are returned as `{ "error": "" }` with the correct HTTP status code.
- Client code calls relative `/api` paths (no hardcoded host/port).
- The client fetch helper throws on a non-ok response.

## Directory norms

- Routes live in `server/src/routes/`.
- Migrations live in `server/migrations/`.
- DB connection/query helpers live in `server/src/db.js` and `server/src/config/`.
- Data access goes through `server/src/repository/` and `server/src/services/`, not
  direct queries in routes.
- Client API/fetch code lives in `web/src/api.js`.

## Do not

- No unmasked dependencies.
- No committing `node_modules` or secrets.
