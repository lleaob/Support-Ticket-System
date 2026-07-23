// In-memory sample support tickets. No database — this array lives in process memory.
export const tickets = [
  {
    id: 1,
    subject: "Cannot log in to my account",
    status: "open",
    priority: "high",
    requester: "alice@example.com",
    description: "Customer is unable to log in to their account and needs assistance.",
  },
  {
    id: 2,
    subject: "Billing invoice question",
    status: "pending",
    priority: "medium",
    requester: "bob@example.com",
    description: "Customer has a question about a billing invoice and needs clarification.",
  },
  {
    id: 3,
    subject: "Feature request: dark mode",
    status: "open",
    priority: "low",
    requester: "carol@example.com",
    description: "Customer is requesting that a dark mode option be added to the product.",
  },
];
