## Overview
This project is a full-stack support ticket management system designed for tracking and resolving customer issues.

User Story Example:
As a support technician, I'm able to view a list of customer tickets. I'm also able to click on each ticket and view its detailed information.

Sample Ticket Data (JSON):

JSON
{
  "id": 1,
  "subject": "Cannot log in to my account",
  "status": "open",
  "priority": "high",
  "requester": "alice@example.com",
  "description": "Customer is unable to log in to their account and needs assistance."
}

## Tech Stack
Backend: Node/Express 
Frontend: React/Vite
Database: PostgresSQL (to be implemented)

## How to Run

This application consists of a Node/Express backend (`server/`) and a React/Vite frontend (`web/`), each with their own `package.json`. The root `package.json` orchestrates both using npm scripts and `concurrently`.

### Install

```bash
npm run install:all
```

Installs dependencies for both `server` and `web`.

### Development

```bash
npm run dev
```

Runs the backend and frontend together via `concurrently`, with output labelled `[server]` and `[web]`.

To run just one side:

```bash
npm run dev:server   # server/: node --watch src/index.js
npm run dev:web      # web/: vite
```

### Build

```bash
npm run build
```

Builds the frontend for production (`web/`: `vite build`), output to `web/dist/`.

### Start

```bash
npm run start
```

Starts the backend (`server/`: `node src/index.js`).

### Environment variables

While running `npm run dev`, the Vite dev server proxies `/api` requests to the backend. The proxy target is read from `VITE_API_PROXY_TARGET` (see `web/.env`), defaulting to `http://localhost:4000` if not set.

## Folder Structure / Architecture

Monorepo Separation (/server & /web): Keeping the backend and frontend in distinct root-level directories allows us to manage dependencies, configuration files, and build scripts independently while remaining inside a single version-controlled repository.

Backend Layering (/server/src): Organized into modular concerns to ensure clean separation of responsibilities:

/config — Centralizes environment variable parsing and application configuration settings.

/constants — Standardizes parameters and variable naming conventions used across both frontend and backend communication.

/data — Responsible for data persistence. At the moment, data is managed via a JSON file with in-memory state changes, which will be expanded into a database (PostgreSQL) in the future.

/errors — Error-handling architecture providing structured application exceptions.

/middleware — Contains functions that intercept HTTP requests before they reach route handlers.
    Contains error-handling pipelines.
    TODO: Include authentication and authorization checks using JWT tokens.

/routes — Responsible for handling HTTP request endpoints, parameter validation, and mapping routes to handlers.

/services — Responsible for encapsulating core business logic and data manipulation rules.

/web - Contains frontend components.
Uses dedicated modules (TicketList.jsx, TicketDetail.jsx) alongside a centralized API client (src/lib/api.js) and env-based config (src/config.js) to maintain clean component lifecycle and predictable state propagation.

## APIs available
GET /api/tickets
    List of tickets in JSON format.

GET /api/ticket/:id
    Shows the details

Error handling scenarios:
    404 returns NOT_FOUND
    500 returns INTERNAL
    400 returns VALIDATION
