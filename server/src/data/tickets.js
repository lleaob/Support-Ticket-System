// In-memory sample support tickets. No database — this array lives in process memory.
export const tickets = [
  {
    id: 1,
    subject: "Cannot log in to my account",
    status: "open",
    priority: "high",
    requester: "alice@example.com",
  },
  {
    id: 2,
    subject: "Billing invoice question",
    status: "pending",
    priority: "medium",
    requester: "bob@example.com",
  },
  {
    id: 3,
    subject: "Feature request: dark mode",
    status: "open",
    priority: "low",
    requester: "carol@example.com",
  },
];
