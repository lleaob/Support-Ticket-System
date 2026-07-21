# support-desk

A small support-ticket dashboard built for the Sparta Bootcamp. A Node/Express
API serves ticket data to a React/Vite frontend, letting a support team view
and (eventually) manage tickets in one place.

## Stack

- **web/** — React + Vite frontend
- **server/** — Node + Express API
- Data is in-memory (`server/src/data/tickets.js`) — no database in Week 1

## Commands

**server/**
```
npm start   # node src/index.js
npm run dev # node --watch src/index.js
```

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
- Data lives in `server/src/data/`.
- Client API/fetch code lives in `web/src/api.js`.

## Do not

- No database.
- No auth.
- No unmasked dependencies.
- No committing `node_modules` or secrets.
