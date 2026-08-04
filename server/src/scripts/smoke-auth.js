// Black-box smoke test: boots the real app on an ephemeral port and hits it
// over HTTP. Requires `npm run seed` to have been run first — it depends on
// the fixed seeded ids/tickets for Alice, Carol, and Dana existing.

import { buildApp } from "../app.js";
import { closePool } from "../db.js";
import { ERROR_CODES, DEMO_PASSWORD } from "../constants/index.js";

const SEEDED = {
  aliceEmail: "alice@example.com",
  aliceId: "11111111-1111-1111-1111-111111111111",
  aliceTicketId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  aliceTicketSubject: "Cannot log in to my account",
  danaEmail: "dev@supportdesk.local",
  carolTicketId: "cccccccc-cccc-cccc-cccc-cccccccccccc",
};
const FAKE_TICKET_ID = "00000000-0000-0000-0000-000000000000";

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    passed++;
    console.log(`PASS: ${label}`);
  } else {
    failed++;
    console.log(`FAIL: ${label}`);
  }
}

async function main() {
  const app = buildApp();
  const server = app.listen(0);
  const base = `http://localhost:${server.address().port}/api`;

  async function call(path, opts = {}) {
    const res = await fetch(`${base}${path}`, opts);
    const body = await res.json().catch(() => null);
    return { status: res.status, body };
  }

  function withToken(token, opts = {}) {
    return { ...opts, headers: { ...(opts.headers || {}), Authorization: `Bearer ${token}` } };
  }

  async function loginAs(email, password) {
    return call("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  }

  // 1. Public probes
  {
    const health = await call("/health");
    assert(health.status === 200, "GET /health responds 200 with no token");

    const ready = await call("/ready");
    assert(ready.status === 200 && ready.body?.status === "ready", "GET /ready responds 200 with no token");
  }

  // 2. Register
  let freshToken;
  let freshUser;
  {
    const newEmail = `smoke-${crypto.randomUUID()}@example.com`;
    const created = await call("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail, name: "Smoke Test", password: DEMO_PASSWORD }),
    });
    assert(created.status === 201, "Register with a new email returns 201");
    assert(typeof created.body?.token === "string", "Register response includes a token");
    assert(created.body?.user?.password_hash === undefined, "Register response omits password_hash");
    assert(created.body?.user?.last_login_at === null, "Register response has last_login_at === null");
    freshToken = created.body.token;
    freshUser = created.body.user;

    const weakPassword = await call("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: `smoke-weak-${crypto.randomUUID()}@example.com`, name: "Smoke Weak", password: "short1" }),
    });
    assert(weakPassword.status === 400, "Register with a short password returns 400");
    assert(weakPassword.body?.error?.code === ERROR_CODES.VALIDATION, "Short password error code is VALIDATION");

    const duplicateEmail = await call("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: SEEDED.aliceEmail, name: "Duplicate", password: DEMO_PASSWORD }),
    });
    assert(duplicateEmail.status === 409, "Register with a seeded (duplicate) email returns 409");
    assert(duplicateEmail.body?.error?.code === ERROR_CODES.CONFLICT, "Duplicate email error code is CONFLICT");
  }

  // 3. Login
  let aliceToken;
  {
    const correct = await loginAs(SEEDED.aliceEmail, DEMO_PASSWORD);
    assert(correct.status === 200, "Login with correct credentials returns 200");
    assert(typeof correct.body?.token === "string", "Login response includes a token");
    assert(correct.body?.user?.password_hash === undefined, "Login response omits password_hash");
    aliceToken = correct.body.token;

    const wrongPassword = await loginAs(SEEDED.aliceEmail, "not-the-real-password");
    assert(wrongPassword.status === 401, "Login with wrong password returns 401");

    const unknownEmail = await loginAs(`nobody-${crypto.randomUUID()}@example.com`, DEMO_PASSWORD);
    assert(unknownEmail.status === 401, "Login with unknown email returns 401");

    assert(wrongPassword.status === unknownEmail.status, "Wrong-password and unknown-email responses have the same status");
    assert(
      wrongPassword.body?.error?.code === unknownEmail.body?.error?.code,
      "Wrong-password and unknown-email responses have the same error code"
    );
    assert(
      wrongPassword.body?.error?.message === unknownEmail.body?.error?.message,
      "Wrong-password and unknown-email responses have the same error message"
    );
  }

  // 4. Authentication
  {
    const noToken = await call("/tickets");
    assert(noToken.status === 401, "GET /tickets with no token returns 401");
    assert(noToken.body?.error?.code === ERROR_CODES.UNAUTHENTICATED, "No-token error code is UNAUTHENTICATED");

    const garbageToken = await call("/tickets", withToken("garbage.token.value"));
    assert(garbageToken.status === 401, "GET /tickets with a garbage token returns 401");
    assert(garbageToken.body?.error?.code === ERROR_CODES.UNAUTHENTICATED, "Garbage-token error code is UNAUTHENTICATED");

    const me = await call("/auth/me", withToken(freshToken));
    assert(me.status === 200, "GET /auth/me with a valid token returns 200");
    assert(me.body?.user?.id === freshUser.id, "GET /auth/me returns the registered user");
  }

  // 5. Authorisation (per-seeded-user list scoping)
  {
    const aliceTickets = await call("/tickets", withToken(aliceToken));
    assert(aliceTickets.status === 200, "GET /tickets with Alice's token returns 200");
    assert(Array.isArray(aliceTickets.body) && aliceTickets.body.length === 1, "Alice sees exactly one ticket");
    assert(
      aliceTickets.body?.[0]?.subject === SEEDED.aliceTicketSubject,
      "Alice's one visible ticket is the one she raised"
    );

    const aliceOpen = await call("/tickets/open", withToken(aliceToken));
    assert(aliceOpen.status === 200, "GET /tickets/open with Alice's token returns 200");
    assert(aliceOpen.body?.open === 1, "Alice's scoped open-ticket count matches her visible list");
  }

  // 6. Core vulnerability check: nonexistent vs not-yours must be indistinguishable
  {
    const notMine = await call(`/tickets/${SEEDED.aliceTicketId}`, withToken(freshToken));
    const nonexistent = await call(`/tickets/${FAKE_TICKET_ID}`, withToken(freshToken));

    assert(notMine.status === 404, "Fetching another user's ticket by id returns 404");
    assert(nonexistent.status === 404, "Fetching a nonexistent ticket id returns 404");
    assert(notMine.status === nonexistent.status, "Not-yours and nonexistent responses have the same status");
    assert(notMine.body?.error?.code === ERROR_CODES.NOT_FOUND, "Not-yours error code is NOT_FOUND");
    assert(notMine.body?.error?.code === nonexistent.body?.error?.code, "Not-yours and nonexistent responses have the same error code");
    assert(
      notMine.body?.error?.message === `Ticket ${SEEDED.aliceTicketId} not found`,
      "Not-yours message matches the `Ticket <id> not found` template"
    );
    assert(
      nonexistent.body?.error?.message === `Ticket ${FAKE_TICKET_ID} not found`,
      "Nonexistent message matches the `Ticket <id> not found` template"
    );
  }

  // 7. Assignee visibility
  {
    const dana = await loginAs(SEEDED.danaEmail, DEMO_PASSWORD);
    assert(dana.status === 200, "Login as the assignee (Dana) returns 200");
    const danaToken = dana.body.token;

    const assigned = await call(`/tickets/${SEEDED.aliceTicketId}`, withToken(danaToken));
    assert(assigned.status === 200, "An assignee (not the requester) can read a ticket assigned to them");
    assert(assigned.body?.subject === SEEDED.aliceTicketSubject, "The assignee-visible ticket is the right one");

    const unrelated = await call(`/tickets/${SEEDED.carolTicketId}`, withToken(danaToken));
    assert(unrelated.status === 404, "A ticket neither raised nor assigned to the caller returns 404");
  }

  // 8. Spoofing
  {
    const own = await call("/tickets", withToken(freshToken));
    const spoofed = await call(`/tickets?userId=${SEEDED.aliceId}`, withToken(freshToken));

    assert(own.status === 200 && Array.isArray(own.body) && own.body.length === 0, "GET /tickets returns an empty list for a fresh user");
    assert(
      spoofed.status === 200 && Array.isArray(spoofed.body) && spoofed.body.length === 0,
      "?userId=<someone else's id> does not change the scoped result"
    );
  }

  server.close();
  await closePool();

  console.log(`Smoke result: ${passed} passed, ${failed} failed.`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
